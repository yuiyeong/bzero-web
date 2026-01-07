/**
 * 메시지 공통 래퍼 컴포넌트
 *
 * MessageBubble과 CardMessage에서 공통으로 사용하는 레이아웃을 제공
 */
import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils.ts";
import { formatMessageTime } from "@/lib/date-utils.ts";
import type { ChatMessage } from "@/types.ts";

interface MessageWrapperProps {
  message: ChatMessage;
  isOwn: boolean;
  /** 버블 최대 너비 (기본: 70%) */
  maxWidth?: string;
  children: ReactNode;
}

/**
 * 메시지 공통 래퍼
 *
 * - 프로필 이모지 (상대방만)
 * - 닉네임 (상대방만)
 * - 시간 표시
 * - iOS Safari 키보드 처리를 위해 forwardRef + tabIndex 지원
 */
export const MessageWrapper = forwardRef<HTMLDivElement, MessageWrapperProps>(function MessageWrapper(
  { message, isOwn, maxWidth = "max-w-[70%]", children },
  ref
) {
  const time = formatMessageTime(message.created_at);

  return (
    <div ref={ref} tabIndex={-1} className={cn("flex gap-2 outline-none", isOwn ? "flex-row-reverse" : "flex-row")}>
      {/* 프로필 이모지 */}
      {!isOwn && (
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-zinc-700 text-lg">
          {message.sender?.profile_emoji || "👤"}
        </div>
      )}

      {/* 메시지 영역 */}
      <div className={cn("flex flex-col", maxWidth, isOwn ? "items-end" : "items-start")}>
        {/* 닉네임 */}
        {!isOwn && message.sender?.nickname && (
          <span className="mb-1 text-xs text-zinc-400">{message.sender.nickname}</span>
        )}

        {/* 버블 (children) */}
        {children}

        {/* 시간 */}
        <span className={cn("mt-1 text-[10px] text-zinc-500", isOwn ? "text-right" : "text-left")}>{time}</span>
      </div>
    </div>
  );
});
