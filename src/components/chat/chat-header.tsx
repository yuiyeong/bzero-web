/**
 * 채팅방 헤더 컴포넌트
 */
import { useRoomMembers } from "@/hooks/queries/use-room-members.ts";
import { cn } from "@/lib/utils.ts";
import type { SocketConnectionStatus } from "@/types.ts";

interface ChatHeaderProps {
  /** 룸 ID */
  roomId: string;
  connectionStatus: SocketConnectionStatus;
}

const CONNECTION_STATUS_CONFIG: Record<SocketConnectionStatus, { text: string; className: string }> = {
  connected: { text: "연결됨", className: "bg-green-500" },
  connecting: { text: "연결 중...", className: "animate-pulse bg-yellow-500" },
  disconnected: { text: "연결 안됨", className: "bg-zinc-500" },
  error: { text: "연결 오류", className: "bg-red-500" },
};

/**
 * 채팅방 헤더 컴포넌트
 *
 * - 연결 상태 인디케이터
 * - 현재 참여자 수 표시
 */
export function ChatHeader({ roomId, connectionStatus }: ChatHeaderProps) {
  const { data: members } = useRoomMembers(roomId, { enabled: connectionStatus === "connected" });
  const memberCount = members?.length ?? 0;
  const statusConfig = CONNECTION_STATUS_CONFIG[connectionStatus];

  return (
    <div className="bg-b0-deep-navy/90 flex items-center justify-between border-b border-zinc-800/50 px-4 py-3 backdrop-blur-sm">
      {/* 연결 상태 */}
      <div className="flex items-center gap-2">
        <div className={cn("h-2 w-2 rounded-full", statusConfig.className)} />
        <span className="text-xs text-zinc-400">{statusConfig.text}</span>
      </div>

      {/* 참여자 수 */}
      {connectionStatus === "connected" && memberCount > 0 && (
        <div className="flex items-center gap-1.5">
          <span className="text-sm">👥</span>
          <span className="text-xs text-zinc-400">{memberCount}명 참여 중</span>
        </div>
      )}
    </div>
  );
}
