import { forwardRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { DirectMessage, User } from "@/types";
import { format } from "date-fns";

interface MessageBubbleProps {
  message: DirectMessage;
  isMe: boolean;
  sender?: User; // Only needed if !isMe
}

/**
 * DM 메시지 버블 컴포넌트
 *
 * iOS Safari 키보드 처리를 위해 forwardRef + tabIndex 지원
 */
const MessageBubble = forwardRef<HTMLDivElement, MessageBubbleProps>(function MessageBubble(
  { message, isMe, sender },
  ref
) {
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
            isMe ? "rounded-tr-none bg-indigo-500 text-white" : "rounded-tl-none bg-zinc-100 text-zinc-900"
          )}
        >
          {message.content}
        </div>
        <span className="mt-1 px-1 text-[10px] text-zinc-400">{format(new Date(message.created_at), "HH:mm")}</span>
      </div>
    </div>
  );
});

export default MessageBubble;
