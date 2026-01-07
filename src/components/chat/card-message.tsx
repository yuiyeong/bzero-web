/**
 * 카드 공유 메시지 컴포넌트
 */
import { forwardRef } from "react";
import { MessageWrapper } from "@/components/chat/message-wrapper.tsx";
import type { ChatMessage } from "@/types.ts";

interface CardMessageProps {
  message: ChatMessage;
  isOwn: boolean;
}

/**
 * 카드 공유 메시지 컴포넌트
 *
 * 대화 카드가 공유되었을 때 특별한 스타일로 표시
 * iOS Safari 키보드 처리를 위해 forwardRef 지원
 */
export const CardMessage = forwardRef<HTMLDivElement, CardMessageProps>(function CardMessage({ message, isOwn }, ref) {
  return (
    <MessageWrapper ref={ref} message={message} isOwn={isOwn} maxWidth="max-w-[80%]">
      <div className="border-b0-purple/30 from-b0-purple/20 to-b0-deep-navy rounded-2xl border bg-gradient-to-br p-4">
        {/* 카드 아이콘 + 라벨 */}
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🎴</span>
          <span className="text-b0-light-purple text-xs font-medium">대화 카드</span>
        </div>

        {/* 질문 내용 */}
        <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap text-white">{message.content}</p>
      </div>
    </MessageWrapper>
  );
});
