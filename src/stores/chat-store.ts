/**
 * 채팅 상태 관리 스토어
 *
 * Socket.IO 연결 상태와 에러만 관리 (클라이언트 상태)
 * 메시지와 멤버 데이터는 TanStack Query로 관리
 */
import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";
import type { SocketConnectionStatus, SocketError } from "@/types.ts";

// ============================================================================
// 타입 정의
// ============================================================================

interface ChatState {
  /** Socket.IO 연결 상태 */
  connectionStatus: SocketConnectionStatus;
  /** 현재 연결된 룸 ID */
  roomId: string | null;
  /** Socket.IO 에러 */
  error: SocketError | null;
}

interface ChatActions {
  actions: {
    /** 연결 상태 설정 */
    setConnectionStatus: (status: SocketConnectionStatus) => void;
    /** 룸 ID 설정 */
    setRoomId: (roomId: string | null) => void;
    /** 에러 설정 */
    setError: (error: SocketError | null) => void;
    /** 상태 초기화 (룸 퇴장 시) */
    reset: () => void;
  };
}

// ============================================================================
// 초기 상태
// ============================================================================

const initialState: ChatState = {
  connectionStatus: "disconnected",
  roomId: null,
  error: null,
};

// ============================================================================
// 스토어 생성
// ============================================================================

export const useChatStore = create(
  devtools(
    combine(initialState, (set) => {
      const chatActions: ChatActions = {
        actions: {
          setConnectionStatus: (status) => {
            set((state) => ({
              ...state,
              connectionStatus: status,
              // 연결 성공 시 에러 초기화
              error: status === "connected" ? null : state.error,
            }));
          },

          setRoomId: (roomId) => {
            set({ roomId });
          },

          setError: (error) => {
            set((state) => ({
              ...state,
              error,
              connectionStatus: error ? "error" : state.connectionStatus,
            }));
          },

          reset: () => {
            set(initialState);
          },
        },
      };
      return chatActions;
    }),
    {
      name: "chatStore",
      enabled: import.meta.env.DEV,
    }
  )
);

// ============================================================================
// 셀렉터 훅 (불필요한 리렌더링 방지)
// ============================================================================

/** 연결 상태 */
export const useChatConnectionStatus = () => useChatStore((s) => s.connectionStatus);
/** 에러 */
export const useChatError = () => useChatStore((s) => s.error);
/** 액션 */
export const useChatActions = () => useChatStore((s) => s.actions);
