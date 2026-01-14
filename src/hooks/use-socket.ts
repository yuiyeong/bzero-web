/**
 * Socket.IO 연결 및 이벤트 관리 훅
 *
 * 룸 입장 시 Socket.IO 연결을 설정하고, 메시지 수신 이벤트를 처리
 * 컴포넌트 언마운트 시 자동으로 연결 해제
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import {
  addMessageToInfiniteData,
  findSendingMessageTempId,
  joinSenderToMessages,
  removeMessageFromInfiniteData,
  replaceTempMessageInInfiniteData,
  updateMessageStatusInInfiniteData,
} from "@/api/chat.ts";
import { logger } from "@/lib/logger.ts";
import { queryKeys } from "@/lib/query-client.ts";
import { createSocket, type TypedSocket } from "@/lib/socket.ts";
import type { ChatMessage, ChatMessagePage, User } from "@/types.ts";
import { useChatActions } from "@/stores/chat-store.ts";

/** Optimistic UI 타임아웃 시간 (ms) */
const OPTIMISTIC_TIMEOUT_MS = 10000;

// ============================================================================
// 타입 정의
// ============================================================================

interface UseSocketOptions {
  /** 연결할 룸 ID */
  roomId: string;
  /** 연결 활성화 여부 (기본: true) */
  enabled?: boolean;
}

interface UseSocketReturn {
  /** 텍스트 메시지 전송 */
  sendMessage: (content: string) => void;
  /** 카드 공유 */
  shareCard: (cardId: string) => void;
  /** 재연결 */
  reconnect: () => void;
  /** 연결 해제 */
  disconnect: () => void;
  /** 실패한 메시지 재전송 */
  retryMessage: (tempId: string) => void;
}

// ============================================================================
// 훅 구현
// ============================================================================

/**
 * Socket.IO 연결 및 이벤트 관리 훅
 *
 * @param options - 연결 옵션
 * @returns 메시지 전송 및 연결 제어 함수
 */
export function useSocket({ roomId, enabled = true }: UseSocketOptions): UseSocketReturn {
  const socketRef = useRef<TypedSocket | null>(null);
  const queryClient = useQueryClient();
  const actions = useChatActions();
  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  // 재연결 트리거를 위한 상태
  const [reconnectTrigger, setReconnectTrigger] = useState(0);

  // Optimistic UI: 타임아웃 관리 (tempId -> timeoutId)
  const timeoutMapRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Optimistic UI: 임시 메시지 내용 저장 (tempId -> content) - 재시도용
  const pendingMessagesRef = useRef<Map<string, string>>(new Map());

  // --------------------------------------------------------
  // Socket 연결 및 이벤트 처리 (단일 effect)
  // --------------------------------------------------------

  useEffect(() => {
    if (!enabled || !roomId) return;

    // 이전 소켓 정리 (Strict Mode에서 이전 effect의 소켓이 남아있을 수 있음)
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    let isActive = true;
    let socket: TypedSocket | null = null;

    // 소켓 연결 시작
    try {
      actionsRef.current.setConnectionStatus("connecting");
      actionsRef.current.setRoomId(roomId);

      socket = createSocket(roomId);
      socketRef.current = socket;

      // --- 연결 이벤트 ---
      socket.on("connect", () => {
        if (!isActive) {
          socket?.disconnect();
          return;
        }

        logger.warn("[Socket] 연결 성공");
        actionsRef.current.setConnectionStatus("connected");
        actionsRef.current.setError(null);

        socket?.emit("join_room", { room_id: roomId });
        // 초기 데이터는 Query 훅에서 자동으로 fetch됨
      });

      // --- 연결 해제 이벤트 ---
      socket.on("disconnect", (reason) => {
        if (!isActive) return;

        logger.warn("[Socket] 연결 해제:", reason);

        actionsRef.current.setConnectionStatus("disconnected");

        if (reason === "io server disconnect") {
          socket?.connect();
        }
      });

      // --- 연결 에러 ---
      socket.on("connect_error", (error) => {
        if (!isActive) return;

        logger.error("[Socket] 연결 에러:", {
          message: error.message,
          description: (error as { description?: string }).description,
          context: (error as { context?: unknown }).context,
        });

        const description = (error as { description?: string }).description;
        const rawMessage = description || error.message;

        // error.message가 객체일 경우를 대비해 문자열로 변환
        let errorMessage = "서버에 연결할 수 없습니다.";
        if (typeof rawMessage === "string") {
          errorMessage = rawMessage;
        } else if (typeof rawMessage === "object") {
          errorMessage = JSON.stringify(rawMessage);
        }

        actionsRef.current.setError({
          code: "CONNECTION_ERROR",
          message: errorMessage,
        });
        actionsRef.current.setConnectionStatus("error");
      });

      // --- 새 메시지 수신 ---
      socket.on("new_message", (data) => {
        if (!isActive) return;

        logger.warn("[Socket] 새 메시지:", data.message);

        // 캐시된 멤버 정보로 sender 조인
        const members = queryClient.getQueryData<User[]>(queryKeys.chat.members(roomId)) ?? [];
        const [messageWithSender] = joinSenderToMessages([data.message], members);

        // 현재 사용자 정보 가져오기
        const me = queryClient.getQueryData<User>(queryKeys.me.detail);

        // Optimistic UI: 자신이 보낸 메시지인지 확인
        if (me && data.message.user_id === me.user_id) {
          const cachedData = queryClient.getQueryData<InfiniteData<ChatMessagePage>>(queryKeys.chat.messages(roomId));
          const tempId = findSendingMessageTempId(cachedData, me.user_id, data.message.content);

          if (tempId) {
            // 임시 메시지를 실제 메시지로 교체
            queryClient.setQueryData(
              queryKeys.chat.messages(roomId),
              (oldData: InfiniteData<ChatMessagePage> | undefined) =>
                replaceTempMessageInInfiniteData(oldData, tempId, messageWithSender)
            );

            // 타임아웃 클리어
            const timeoutId = timeoutMapRef.current.get(tempId);
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutMapRef.current.delete(tempId);
            }

            // 대기 중인 메시지 제거
            pendingMessagesRef.current.delete(tempId);

            logger.warn("[Socket] Optimistic UI: 임시 메시지 교체 완료", { tempId });
            return;
          }
        }

        // 다른 사용자의 메시지 또는 매칭되지 않은 메시지 → 캐시에 추가
        queryClient.setQueryData(
          queryKeys.chat.messages(roomId),
          (oldData: InfiniteData<ChatMessagePage> | undefined) => addMessageToInfiniteData(oldData, messageWithSender)
        );
      });

      // --- 시스템 메시지 수신 ---
      socket.on("system_message", (data) => {
        if (!isActive) return;

        logger.warn("[Socket] 시스템 메시지:", data.message);

        // InfiniteQuery 캐시에 시스템 메시지 추가
        queryClient.setQueryData(
          queryKeys.chat.messages(roomId),
          (oldData: InfiniteData<ChatMessagePage> | undefined) => addMessageToInfiniteData(oldData, data.message)
        );

        // 멤버 목록 갱신 (입장/퇴장 메시지이므로)
        void queryClient.invalidateQueries({ queryKey: queryKeys.chat.members(roomId) });
        void queryClient.invalidateQueries({ queryKey: queryKeys.room.members(roomId) });
      });

      // --- 에러 수신 ---
      socket.on("error", (error) => {
        if (!isActive) return;

        logger.error("[Socket] 에러:", error);

        // Error 객체이거나 message 속성이 있는 경우
        let message = "알 수 없는 소켓 에러가 발생했습니다.";

        if (error instanceof Error) {
          message = error.message;
        } else if (typeof error === "string") {
          message = error;
        } else if (typeof error === "object" && error !== null) {
          const msg = (error as { message?: unknown }).message;
          if (typeof msg === "string") {
            message = msg;
          } else if (msg) {
            message = JSON.stringify(msg);
          }
        }

        actionsRef.current.setError({
          code: "SOCKET_ERROR",
          message,
        });
      });

      // 연결 시작
      socket.connect();
    } catch (error) {
      logger.error("[Socket] 초기화 에러:", error);
      actionsRef.current.setError({
        code: "INIT_ERROR",
        message: error instanceof Error ? error.message : "소켓 연결에 실패했습니다.",
      });
    }

    // Cleanup을 위해 현재 ref 값 캡처 (ESLint react-hooks/exhaustive-deps 경고 방지)
    const timeoutMap = timeoutMapRef.current;

    // Cleanup
    return () => {
      isActive = false;
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
        socketRef.current = null;
      }
      actionsRef.current.reset();

      // Optimistic UI: 모든 타임아웃 정리
      timeoutMap.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutMap.clear();
    };
  }, [enabled, roomId, reconnectTrigger, queryClient]);

  // --------------------------------------------------------
  // 메시지 전송 (Optimistic UI)
  // --------------------------------------------------------

  const sendMessage = useCallback(
    (content: string) => {
      if (!socketRef.current?.connected) {
        logger.warn("[Socket] 연결되지 않음 - 메시지 전송 실패");
        return;
      }

      // 현재 사용자 정보 가져오기
      const me = queryClient.getQueryData<User>(queryKeys.me.detail);
      if (!me) {
        logger.warn("[Socket] 사용자 정보 없음 - 메시지 전송 실패");
        return;
      }

      // 임시 ID 생성
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // 임시 메시지 생성
      const tempMessage: ChatMessage = {
        message_id: tempId,
        room_id: roomId,
        user_id: me.user_id,
        content,
        card_id: null,
        message_type: "text",
        is_system: false,
        created_at: new Date().toISOString(),
        sender: {
          user_id: me.user_id,
          nickname: me.nickname,
          profile_emoji: me.profile_emoji,
        },
        status: "sending",
        tempId,
      };

      // 캐시에 임시 메시지 추가 (즉시 UI 표시)
      queryClient.setQueryData(queryKeys.chat.messages(roomId), (oldData: InfiniteData<ChatMessagePage> | undefined) =>
        addMessageToInfiniteData(oldData, tempMessage)
      );

      // 대기 중인 메시지 저장 (재시도용)
      pendingMessagesRef.current.set(tempId, content);

      // Socket.IO로 메시지 전송
      socketRef.current.emit("send_message", { content });

      // 타임아웃 설정 (10초)
      const timeoutId = setTimeout(() => {
        logger.warn("[Socket] Optimistic UI: 타임아웃 - 메시지 전송 실패", { tempId });

        // 상태를 failed로 변경
        queryClient.setQueryData(
          queryKeys.chat.messages(roomId),
          (oldData: InfiniteData<ChatMessagePage> | undefined) =>
            updateMessageStatusInInfiniteData(oldData, tempId, "failed")
        );

        timeoutMapRef.current.delete(tempId);
      }, OPTIMISTIC_TIMEOUT_MS);

      timeoutMapRef.current.set(tempId, timeoutId);

      logger.warn("[Socket] Optimistic UI: 임시 메시지 추가", { tempId, content });
    },
    [roomId, queryClient]
  );

  // --------------------------------------------------------
  // 카드 공유
  // --------------------------------------------------------

  const shareCard = useCallback((cardId: string) => {
    if (!socketRef.current?.connected) {
      logger.warn("[Socket] 연결되지 않음 - 카드 공유 실패");
      return;
    }
    socketRef.current.emit("share_card", { card_id: cardId });
  }, []);

  // --------------------------------------------------------
  // 재연결
  // --------------------------------------------------------

  const reconnect = useCallback(() => {
    setReconnectTrigger((prev) => prev + 1);
  }, []);

  // --------------------------------------------------------
  // 연결 해제
  // --------------------------------------------------------

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    actionsRef.current.reset();
  }, []);

  // --------------------------------------------------------
  // 실패한 메시지 재전송 (Optimistic UI)
  // --------------------------------------------------------

  const retryMessage = useCallback(
    (oldTempId: string) => {
      // 대기 중인 메시지 내용 가져오기
      const content = pendingMessagesRef.current.get(oldTempId);
      if (!content) {
        logger.warn("[Socket] 재시도 실패 - 메시지 내용 없음", { oldTempId });
        return;
      }

      if (!socketRef.current?.connected) {
        logger.warn("[Socket] 연결되지 않음 - 재시도 실패");
        return;
      }

      // 현재 사용자 정보 가져오기
      const me = queryClient.getQueryData<User>(queryKeys.me.detail);
      if (!me) {
        logger.warn("[Socket] 사용자 정보 없음 - 재시도 실패");
        return;
      }

      // 기존 실패 메시지 삭제 및 pendingMessages에서 제거
      queryClient.setQueryData(queryKeys.chat.messages(roomId), (oldData: InfiniteData<ChatMessagePage> | undefined) =>
        removeMessageFromInfiniteData(oldData, oldTempId)
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
      const tempMessage: ChatMessage = {
        message_id: newTempId,
        room_id: roomId,
        user_id: me.user_id,
        content,
        card_id: null,
        message_type: "text",
        is_system: false,
        created_at: new Date().toISOString(),
        sender: {
          user_id: me.user_id,
          nickname: me.nickname,
          profile_emoji: me.profile_emoji,
        },
        status: "sending",
        tempId: newTempId,
      };

      // 캐시에 새 임시 메시지 추가
      queryClient.setQueryData(queryKeys.chat.messages(roomId), (oldData: InfiniteData<ChatMessagePage> | undefined) =>
        addMessageToInfiniteData(oldData, tempMessage)
      );

      // 대기 중인 메시지 저장 (재시도용)
      pendingMessagesRef.current.set(newTempId, content);

      // Socket.IO로 메시지 재전송
      socketRef.current.emit("send_message", { content });

      // 타임아웃 설정
      const timeoutId = setTimeout(() => {
        logger.warn("[Socket] Optimistic UI: 재시도 타임아웃", { newTempId });

        queryClient.setQueryData(
          queryKeys.chat.messages(roomId),
          (oldData: InfiniteData<ChatMessagePage> | undefined) =>
            updateMessageStatusInInfiniteData(oldData, newTempId, "failed")
        );

        timeoutMapRef.current.delete(newTempId);
      }, OPTIMISTIC_TIMEOUT_MS);

      timeoutMapRef.current.set(newTempId, timeoutId);

      logger.warn("[Socket] Optimistic UI: 메시지 재시도", { oldTempId, newTempId, content });
    },
    [roomId, queryClient]
  );

  return {
    sendMessage,
    shareCard,
    reconnect,
    disconnect,
    retryMessage,
  };
}
