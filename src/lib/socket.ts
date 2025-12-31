/**
 * Socket.IO 클라이언트 설정 및 타입 정의
 */
import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "@/stores/auth-store.ts";
import type { ChatMessage, SocketError } from "@/types.ts";

// ============================================================================
// 타입 정의
// ============================================================================

/** Socket.IO 서버 → 클라이언트 이벤트 */
export interface ServerToClientEvents {
  /** 새 메시지 수신 (텍스트, 카드 공유) */
  new_message: (data: { message: ChatMessage }) => void;
  /** 시스템 메시지 수신 (입장, 퇴장) */
  system_message: (data: { message: ChatMessage }) => void;
  /** 에러 발생 */
  error: (error: SocketError) => void;
}

/** Socket.IO 클라이언트 → 서버 이벤트 */
export interface ClientToServerEvents {
  /** 룸 입장 */
  join_room: (payload: { room_id: string }) => void;
  /** 텍스트 메시지 전송 */
  send_message: (payload: { content: string }) => void;
  /** 카드 공유 */
  share_card: (payload: { card_id: string }) => void;
}

/** 타입 안전한 Socket 인스턴스 */
export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

// ============================================================================
// 설정
// ============================================================================

/**
 * Socket.IO 서버 URL
 *
 * VITE_SOCKET_URL이 있으면 우선 사용하고,
 * 없으면 VITE_API_BASE_URL에서 origin만 추출하여 사용 (경로 제외)
 */
const getSocketUrl = (): string => {
  const socketUrl = import.meta.env.VITE_SOCKET_URL;
  if (socketUrl) {
    return socketUrl;
  }

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  if (apiUrl) {
    try {
      const url = new URL(apiUrl);
      return url.origin;
    } catch (e) {
      console.error("Invalid VITE_API_BASE_URL:", e);
    }
  }

  return window.location.origin;
};

const SOCKET_URL: string = getSocketUrl();

/** Socket.IO 연결 옵션 */
const SOCKET_OPTIONS = {
  path: "/ws/socket.io", // 백엔드 Socket.IO 경로 (FastAPI 마운트 경로)
  autoConnect: false, // 수동 연결 (useSocket에서 제어)
  reconnection: true, // 자동 재연결 활성화
  reconnectionAttempts: 5, // 최대 재연결 시도 횟수
  reconnectionDelay: 2000, // 재연결 시도 간격 (ms)
  reconnectionDelayMax: 5000, // 최대 재연결 간격 (ms)
  timeout: 10000, // 연결 타임아웃 (ms)
  transports: ["websocket", "polling"] as string[], // WebSocket 우선, polling fallback
};

// ============================================================================
// 함수
// ============================================================================

/**
 * Socket.IO 클라이언트 인스턴스 생성
 *
 * @param roomId - 연결할 룸 ID
 * @returns 타입 안전한 Socket 인스턴스
 * @throws Error - 인증 토큰이 없는 경우
 *
 * @example
 * ```typescript
 * const socket = createSocket("room-123");
 * socket.connect();
 * socket.on("new_message", (msg) => console.log(msg));
 * ```
 */
export function createSocket(roomId: string): TypedSocket {
  const session = useAuthStore.getState().session;
  const token = session?.access_token;

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 로그인이 필요합니다.");
  }

  return io(SOCKET_URL, {
    ...SOCKET_OPTIONS,
    auth: {
      token,
      room_id: roomId,
    },
  }) as TypedSocket;
}

/**
 * 현재 인증 토큰 가져오기
 *
 * Socket 연결 전 토큰 유효성 확인에 사용
 */
export function getAuthToken(): string | null {
  return useAuthStore.getState().session?.access_token ?? null;
}
