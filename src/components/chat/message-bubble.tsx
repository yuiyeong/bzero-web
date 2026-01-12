/**
 * 개별 메시지 버블 컴포넌트
 *
 * Optimistic UI 지원:
 * - sending 상태: 일반 메시지와 동일하게 표시 (성공처럼 보임)
 * - failed 상태: 빨간 테두리 + "전송 실패" + 재시도 버튼
 */
import { MessageWrapper } from "@/components/chat/message-wrapper.tsx";
import { forwardRef } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import type { ChatMessage } from "@/types.ts";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  /** 실패한 메시지 재전송 콜백 */
  onRetry?: (tempId: string) => void;
}

/**
 * 메시지 버블 컴포넌트
 *
 * - 본인 메시지: 오른쪽, 보라색 배경
 * - 상대방 메시지: 왼쪽, 회색 배경
 * - 실패한 메시지: 빨간 테두리 + 재시도 버튼
 * - iOS Safari 키보드 처리를 위해 forwardRef 지원
 */
export const MessageBubble = forwardRef<HTMLDivElement, MessageBubbleProps>(function MessageBubble(
  { message, isOwn, onRetry },
  ref
) {
  const isFailed = message.status === "failed";

  const handleRetry = () => {
    if (message.tempId && onRetry) {
      onRetry(message.tempId);
    }
  };

  return (
    <MessageWrapper ref={ref} message={message} isOwn={isOwn}>
      <div className="flex flex-col gap-1">
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5",
            isOwn ? "bg-b0-purple text-white" : "bg-zinc-700/80 text-white",
            isFailed && "ring-2 ring-red-500/70"
          )}
        >
          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* 실패 상태 UI */}
        {isFailed && isOwn && (
          <div className="flex items-center justify-end gap-2">
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
    </MessageWrapper>
  );
});
