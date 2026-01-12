/**
 * DM Socket.IO 연결 및 이벤트 관리 훅
 *
 * DM 룸 입장 시 Socket.IO 연결을 설정하고, 메시지 수신 이벤트를 처리
 * Optimistic UI 패턴을 적용하여 메시지 전송 즉시 UI에 표시
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addDMMessageToInfiniteData,
  findSendingDMMessageTempId,
  removeDMMessageFromInfiniteData,
  replaceTempDMMessageInInfiniteData,
  updateDMMessageStatusInInfiniteData,
} from "@/api/dm.ts";
import { logger } from "@/lib/logger.ts";
import { queryKeys } from "@/lib/query-client.ts";
import { createDMSocket, type TypedSocket } from "@/lib/socket.ts";
import type { DirectMessage, DirectMessagePage, User } from "@/types.ts";

/** Optimistic UI 타임아웃 시간 (ms) */
const OPTIMISTIC_TIMEOUT_MS = 10000;

interface UseDMSocketOptions {
  dmRoomId: string;
  enabled?: boolean;
}

interface UseDMSocketReturn {
  sendMessage: (content: string) => void;
  isConnected: boolean;
  retryMessage: (tempId: string) => void;
}

export function useDMSocket({ dmRoomId, enabled = true }: UseDMSocketOptions): UseDMSocketReturn {
  const socketRef = useRef<TypedSocket | null>(null);
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  // Optimistic UI: 타임아웃 관리 (tempId -> timeoutId)
  const timeoutMapRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Optimistic UI: 임시 메시지 내용 저장 (tempId -> content) - 재시도용
  const pendingMessagesRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    if (!enabled || !dmRoomId) return;

    // Cleanup previous
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    let socket: TypedSocket | null = null;
    let isActive = true;

    try {
      socket = createDMSocket(dmRoomId);
      socketRef.current = socket;

      socket.on("connect", () => {
        if (!isActive) return;
        setIsConnected(true);
        socket?.emit("join_dm_room", { dm_room_id: dmRoomId });
      });

      socket.on("disconnect", () => {
        if (!isActive) return;
        setIsConnected(false);
      });

      socket.on("error", (err: unknown) => {
        logger.error("[DM Socket] 에러:", err);
      });

      // Listen for new messages
      socket.on("new_dm_message", (data: { message: DirectMessage }) => {
        if (!isActive) return;

        logger.warn("[DM Socket] 새 메시지:", data.message);

        // 현재 사용자 정보 가져오기
        const me = queryClient.getQueryData<User>(queryKeys.me.detail);

        // Optimistic UI: 자신이 보낸 메시지인지 확인
        if (me && data.message.from_user_id === me.user_id) {
          const cachedData = queryClient.getQueryData<InfiniteData<DirectMessagePage>>(queryKeys.dm.messages(dmRoomId));
          const tempId = findSendingDMMessageTempId(cachedData, me.user_id, data.message.content);

          if (tempId) {
            // 임시 메시지를 실제 메시지로 교체
            queryClient.setQueryData(
              queryKeys.dm.messages(dmRoomId),
              (oldData: InfiniteData<DirectMessagePage> | undefined) =>
                replaceTempDMMessageInInfiniteData(oldData, tempId, data.message)
            );

            // 타임아웃 클리어
            const timeoutId = timeoutMapRef.current.get(tempId);
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutMapRef.current.delete(tempId);
            }

            // 대기 중인 메시지 제거
            pendingMessagesRef.current.delete(tempId);

            logger.warn("[DM Socket] Optimistic UI: 임시 메시지 교체 완료", { tempId });
            return;
          }
        }

        // 다른 사용자의 메시지 또는 매칭되지 않은 메시지 → 캐시에 추가
        queryClient.setQueryData(
          queryKeys.dm.messages(dmRoomId),
          (oldData: InfiniteData<DirectMessagePage> | undefined) => addDMMessageToInfiniteData(oldData, data.message)
        );
      });

      socket.connect();
    } catch (err) {
      logger.error("[DM Socket] 초기화 에러:", err);
    }

    // Cleanup을 위해 현재 ref 값 캡처 (ESLint react-hooks/exhaustive-deps 경고 방지)
    const timeoutMap = timeoutMapRef.current;

    return () => {
      isActive = false;
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
      }

      // Optimistic UI: 모든 타임아웃 정리
      timeoutMap.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutMap.clear();
    };
  }, [dmRoomId, enabled, queryClient]);

  // --------------------------------------------------------
  // 메시지 전송 (Optimistic UI)
  // --------------------------------------------------------

  const sendMessage = useCallback(
    (content: string) => {
      if (!socketRef.current?.connected) {
        toast.error("연결되지 않았습니다.");
        return;
      }

      // 현재 사용자 정보 가져오기
      const me = queryClient.getQueryData<User>(queryKeys.me.detail);
      if (!me) {
        logger.warn("[DM Socket] 사용자 정보 없음 - 메시지 전송 실패");
        return;
      }

      // 임시 ID 생성
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // 임시 메시지 생성
      const tempMessage: DirectMessage = {
        dm_id: tempId,
        dm_room_id: dmRoomId,
        from_user_id: me.user_id,
        to_user_id: "", // 상대방 ID는 알 수 없음, 서버에서 채워짐
        content,
        is_read: false,
        created_at: new Date().toISOString(),
        status: "sending",
        tempId,
      };

      // 캐시에 임시 메시지 추가 (즉시 UI 표시)
      queryClient.setQueryData(
        queryKeys.dm.messages(dmRoomId),
        (oldData: InfiniteData<DirectMessagePage> | undefined) => addDMMessageToInfiniteData(oldData, tempMessage)
      );

      // 대기 중인 메시지 저장 (재시도용)
      pendingMessagesRef.current.set(tempId, content);

      // Socket.IO로 메시지 전송
      socketRef.current.emit("send_dm_message", { dm_room_id: dmRoomId, content });

      // 타임아웃 설정 (10초)
      const timeoutId = setTimeout(() => {
        logger.warn("[DM Socket] Optimistic UI: 타임아웃 - 메시지 전송 실패", { tempId });

        // 상태를 failed로 변경
        queryClient.setQueryData(
          queryKeys.dm.messages(dmRoomId),
          (oldData: InfiniteData<DirectMessagePage> | undefined) =>
            updateDMMessageStatusInInfiniteData(oldData, tempId, "failed")
        );

        timeoutMapRef.current.delete(tempId);
      }, OPTIMISTIC_TIMEOUT_MS);

      timeoutMapRef.current.set(tempId, timeoutId);

      logger.warn("[DM Socket] Optimistic UI: 임시 메시지 추가", { tempId, content });
    },
    [dmRoomId, queryClient]
  );

  // --------------------------------------------------------
  // 실패한 메시지 재전송 (Optimistic UI)
  // --------------------------------------------------------

  const retryMessage = useCallback(
    (oldTempId: string) => {
      // 대기 중인 메시지 내용 가져오기
      const content = pendingMessagesRef.current.get(oldTempId);
      if (!content) {
        logger.warn("[DM Socket] 재시도 실패 - 메시지 내용 없음", { oldTempId });
        return;
      }

      if (!socketRef.current?.connected) {
        toast.error("연결되지 않았습니다.");
        return;
      }

      // 현재 사용자 정보 가져오기
      const me = queryClient.getQueryData<User>(queryKeys.me.detail);
      if (!me) {
        logger.warn("[DM Socket] 사용자 정보 없음 - 재시도 실패");
        return;
      }

      // 기존 실패 메시지 삭제 및 pendingMessages에서 제거
      queryClient.setQueryData(
        queryKeys.dm.messages(dmRoomId),
        (oldData: InfiniteData<DirectMessagePage> | undefined) => removeDMMessageFromInfiniteData(oldData, oldTempId)
      );
      pendingMessagesRef.current.delete(oldTempId);

      // 기존 타임아웃 정리
      const existingTimeout = timeoutMapRef.current.get(oldTempId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
        timeoutMapRef.current.delete(oldTempId);
      }

      // 새로운 임시 ID 생성
      const newTempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // 새로운 임시 메시지 생성
      const tempMessage: DirectMessage = {
        dm_id: newTempId,
        dm_room_id: dmRoomId,
        from_user_id: me.user_id,
        to_user_id: "", // 상대방 ID는 알 수 없음, 서버에서 채워짐
        content,
        is_read: false,
        created_at: new Date().toISOString(),
        status: "sending",
        tempId: newTempId,
      };

      // 캐시에 새 임시 메시지 추가
      queryClient.setQueryData(
        queryKeys.dm.messages(dmRoomId),
        (oldData: InfiniteData<DirectMessagePage> | undefined) => addDMMessageToInfiniteData(oldData, tempMessage)
      );

      // 대기 중인 메시지 저장 (재시도용)
      pendingMessagesRef.current.set(newTempId, content);

      // Socket.IO로 메시지 재전송
      socketRef.current.emit("send_dm_message", { dm_room_id: dmRoomId, content });

      // 타임아웃 설정
      const timeoutId = setTimeout(() => {
        logger.warn("[DM Socket] Optimistic UI: 재시도 타임아웃", { newTempId });

        queryClient.setQueryData(
          queryKeys.dm.messages(dmRoomId),
          (oldData: InfiniteData<DirectMessagePage> | undefined) =>
            updateDMMessageStatusInInfiniteData(oldData, newTempId, "failed")
        );

        timeoutMapRef.current.delete(newTempId);
      }, OPTIMISTIC_TIMEOUT_MS);

      timeoutMapRef.current.set(newTempId, timeoutId);

      logger.warn("[DM Socket] Optimistic UI: 메시지 재시도", { oldTempId, newTempId, content });
    },
    [dmRoomId, queryClient]
  );

  return { sendMessage, isConnected, retryMessage };
}
