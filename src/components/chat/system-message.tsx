/**
 * 시스템 메시지 컴포넌트 (입장/퇴장 알림 등)
 */
import type { ChatMessage } from "@/types.ts";

interface SystemMessageProps {
  message: ChatMessage;
}

/**
 * 시스템 메시지 컴포넌트
 *
 * 입장/퇴장 알림 등을 가운데 정렬로 표시
 */
export function SystemMessage({ message }: SystemMessageProps) {
  return (
    <div className="flex justify-center py-2">
      <span className="rounded-full bg-zinc-800/60 px-4 py-1.5 text-xs text-zinc-400">{message.content}</span>
    </div>
  );
}
