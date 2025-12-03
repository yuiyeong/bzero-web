import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  disabled?: boolean;
}

const PROFILE_EMOJIS = ["🙂", "😊", "😎", "😍", "🤔", "👉", "🌟", "👍", "🤩", "🚀"];

export function EmojiPicker({ value, onChange, disabled }: EmojiPickerProps) {
  return (
    <div className="border-border bg-input grid grid-cols-5 gap-3 rounded-xl border p-4">
      {PROFILE_EMOJIS.map((emoji) => (
        <Button
          key={emoji}
          type="button"
          variant="ghost"
          onClick={() => onChange(emoji)}
          disabled={disabled}
          className={cn(
            "h-12 w-12 rounded-xl text-2xl",
            value === emoji && "bg-primary ring-accent hover:bg-primary/90 ring-2"
          )}
        >
          {emoji}
        </Button>
      ))}
    </div>
  );
}
