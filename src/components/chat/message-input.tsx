/**
 * 메시지 입력 컴포넌트
 */
import { type FormEvent, type ChangeEvent, type KeyboardEvent, useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils.ts";

interface MessageInputProps {
  /** 메시지 전송 콜백 */
  onSend: (content: string) => void;
  /** 카드 버튼 클릭 콜백 (없으면 버튼 숨김) */
  onCardClick?: () => void;
  /** 비활성화 여부 */
  disabled?: boolean;
}

/** 최대 메시지 길이 (이슈 #17 요구사항) */
const MAX_MESSAGE_LENGTH = 300;

/** 전송 쿨다운 (ms) - 2초 (이슈 #17 요구사항) */
const SEND_COOLDOWN = 2000;

/**
 * 메시지 입력 컴포넌트
 *
 * - 최대 300자 제한 (실시간 카운터)
 * - 2초 전송 쿨다운
 * - Enter: 전송 / Shift+Enter: 줄바꿈
 * - 대화 카드 버튼
 */
export function MessageInput({ onSend, onCardClick, disabled }: MessageInputProps) {
  const [content, setContent] = useState("");
  const [isCooldown, setIsCooldown] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --------------------------------------------------------
  // 입력 처리
  // --------------------------------------------------------
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_MESSAGE_LENGTH) {
      setContent(value);
    }
  };

  // --------------------------------------------------------
  // 전송 처리
  // --------------------------------------------------------
  const handleSubmit = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();

      const trimmed = content.trim();

      // 전송 조건 체크
      if (!trimmed || disabled || isCooldown) return;

      // 메시지 전송
      onSend(trimmed);
      setContent("");

      // 쿨다운 시작
      setIsCooldown(true);
      cooldownTimerRef.current = setTimeout(() => {
        setIsCooldown(false);
      }, SEND_COOLDOWN);

      // 포커스 유지
      textareaRef.current?.focus();
    },
    [content, disabled, isCooldown, onSend]
  );

  // --------------------------------------------------------
  // 키보드 처리
  // --------------------------------------------------------
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // IME 조합 중이면 무시 (한글 입력 등)
    if (e.nativeEvent.isComposing) return;

    // Enter로 전송, Shift+Enter로 줄바꿈
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // --------------------------------------------------------
  // 정리
  // --------------------------------------------------------
  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current);
      }
    };
  }, []);

  const isOverLimit = content.length >= MAX_MESSAGE_LENGTH;
  const canSend = content.trim().length > 0 && !disabled && !isCooldown;

  return (
    <form onSubmit={handleSubmit} className="bg-b0-deep-navy/95 flex items-end gap-2 border-t border-zinc-800 p-3">
      {/* 대화 카드 버튼 */}
      {/* 대화 카드 버튼 */}
      {onCardClick && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={onCardClick}
          disabled={disabled}
          className="h-10 w-10 flex-shrink-0 text-xl hover:bg-zinc-800"
          aria-label="대화 카드"
        >
          🎴
        </Button>
      )}

      {/* 입력 영역 */}
      <div className="relative flex-1">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요..."
          disabled={disabled}
          rows={1}
          className="focus-visible:ring-b0-purple max-h-28 min-h-10 resize-none border-zinc-700 bg-zinc-800/50 pr-14 text-sm text-white placeholder:text-zinc-500"
        />

        {/* 글자 수 카운터 */}
        <span className={cn("absolute right-2 bottom-2 text-[10px]", isOverLimit ? "text-red-400" : "text-zinc-500")}>
          {content.length}/{MAX_MESSAGE_LENGTH}
        </span>
      </div>

      {/* 전송 버튼 */}
      <Button
        type="submit"
        size="icon"
        disabled={!canSend}
        className={cn(
          "h-10 w-10 flex-shrink-0 rounded-full",
          canSend ? "bg-b0-purple hover:bg-b0-purple/80" : "bg-zinc-700 text-zinc-500"
        )}
        aria-label="전송"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
