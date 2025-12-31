/**
 * Socket.IO 연결 및 이벤트 관리 훅
 *
 * 룸 입장 시 Socket.IO 연결을 설정하고, 메시지 수신 이벤트를 처리
 * 컴포넌트 언마운트 시 자동으로 연결 해제
 */
import { useEffect, useRef, useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createSocket, type TypedSocket } from "@/lib/socket.ts";
import { useChatActions } from "@/stores/chat-store.ts";
import { joinSenderToMessages, addMessageToInfiniteData } from "@/api/chat.ts";
import { queryKeys } from "@/lib/query-client.ts";
import { logger } from "@/lib/logger.ts";
import type { InfiniteData } from "@tanstack/react-query";
import type { ChatMessagePage, User } from "@/types.ts";

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
        const errorMessage = description || error.message || "서버에 연결할 수 없습니다.";

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

        // InfiniteQuery 캐시에 메시지 추가
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
      });

      // --- 에러 수신 ---
      socket.on("error", (error) => {
        if (!isActive) return;

        logger.error("[Socket] 에러:", error);
        actionsRef.current.setError(error);
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

    // Cleanup
    return () => {
      isActive = false;
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
        socketRef.current = null;
      }
      actionsRef.current.reset();
    };
  }, [enabled, roomId, reconnectTrigger, queryClient]);

  // --------------------------------------------------------
  // 메시지 전송
  // --------------------------------------------------------

  const sendMessage = useCallback((content: string) => {
    if (!socketRef.current?.connected) {
      logger.warn("[Socket] 연결되지 않음 - 메시지 전송 실패");
      return;
    }
    socketRef.current.emit("send_message", { content });
  }, []);

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

  return {
    sendMessage,
    shareCard,
    reconnect,
    disconnect,
  };
}
