/**
 * 개별 메시지 버블 컴포넌트
 */
import { forwardRef } from "react";
import { cn } from "@/lib/utils.ts";
import { MessageWrapper } from "@/components/chat/message-wrapper.tsx";
import type { ChatMessage } from "@/types.ts";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

/**
 * 메시지 버블 컴포넌트
 *
 * - 본인 메시지: 오른쪽, 보라색 배경
 * - 상대방 메시지: 왼쪽, 회색 배경
 * - iOS Safari 키보드 처리를 위해 forwardRef 지원
 */
export const MessageBubble = forwardRef<HTMLDivElement, MessageBubbleProps>(function MessageBubble(
  { message, isOwn },
  ref
) {
  return (
    <MessageWrapper ref={ref} message={message} isOwn={isOwn}>
      <div className={cn("rounded-2xl px-4 py-2.5", isOwn ? "bg-b0-purple text-white" : "bg-zinc-700/80 text-white")}>
        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{message.content}</p>
      </div>
    </MessageWrapper>
  );
});
