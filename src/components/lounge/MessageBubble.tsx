/**
 * DM 메시지 버블 컴포넌트
 *
 * Optimistic UI 지원:
 * - sending 상태: 일반 메시지와 동일하게 표시 (성공처럼 보임)
 * - failed 상태: 빨간 테두리 + "전송 실패" + 재시도 버튼
 */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { forwardRef } from "react";
import { format } from "date-fns";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import type { DirectMessage, User } from "@/types.ts";

interface MessageBubbleProps {
  message: DirectMessage;
  isMe: boolean;
  sender?: User; // Only needed if !isMe
  /** 실패한 메시지 재전송 콜백 */
  onRetry?: (tempId: string) => void;
}

/**
 * DM 메시지 버블 컴포넌트
 *
 * iOS Safari 키보드 처리를 위해 forwardRef + tabIndex 지원
 */
const MessageBubble = forwardRef<HTMLDivElement, MessageBubbleProps>(function MessageBubble(
  { message, isMe, sender, onRetry },
  ref
) {
  const isFailed = message.status === "failed";

  const handleRetry = () => {
    if (message.tempId && onRetry) {
      onRetry(message.tempId);
    }
  };

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={cn("mb-4 flex w-full items-start gap-2 outline-none", isMe ? "justify-end" : "justify-start")}
    >
      {!isMe && (
        <Avatar className="h-8 w-8">
          {sender?.profile_emoji && <AvatarImage src={`/avatars/${sender.profile_emoji}.png`} />}
          <AvatarFallback className="bg-zinc-100 text-xs">{sender?.profile_emoji || "?"}</AvatarFallback>
        </Avatar>
      )}

      <div className={cn("flex max-w-[70%] flex-col", isMe ? "items-end" : "items-start")}>
        {!isMe && sender && <span className="mb-1 ml-1 text-[10px] text-zinc-500">{sender.nickname}</span>}
        <div
          className={cn(
            "rounded-2xl px-4 py-2 text-sm break-words whitespace-pre-wrap",
            isMe ? "rounded-tr-none bg-indigo-500 text-white" : "rounded-tl-none bg-zinc-100 text-zinc-900",
            isFailed && "ring-2 ring-red-500/70"
          )}
        >
          {message.content}
        </div>
        <span className="mt-1 px-1 text-[10px] text-zinc-400">{format(new Date(message.created_at), "HH:mm")}</span>

        {/* 실패 상태 UI */}
        {isFailed && isMe && (
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs text-red-400">전송 실패</span>
            <button
              type="button"
              onClick={handleRetry}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-red-400 transition-colors hover:bg-red-500/10"
            >
              <RotateCcw className="h-3 w-3" />
              재시도
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default MessageBubble;
