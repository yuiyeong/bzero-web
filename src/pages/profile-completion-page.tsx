import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { EmojiPicker } from "@/components/emoji-picker.tsx";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { useUpdateMe } from "@/hooks/mutations/use-update-me.ts";
import type { B0ApiError } from "@/lib/api-errors.ts";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { ROUTES } from "@/lib/routes.ts";

export default function ProfileCompletionPage() {
  const [nickname, setNickname] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🌟");
  const navigate = useNavigate();
  const { mutate: updateMe, isPending } = useUpdateMe({
    onSuccess: () => {
      navigate(ROUTES.HOME, { replace: true });
    },
    onError: (error: B0ApiError) => {
      toast.error(error.message);
    },
  });

  const validateNickname = (value: string): string | null => {
    const trimmed = value.trim();
    if (trimmed === "") {
      return "닉네임을 입력해주세요.";
    }
    if (trimmed.length < 2 || trimmed.length > 10) {
      return "닉네임은 2~10자로 입력해주세요.";
    }
    return null;
  };

  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const errorMessage = validateNickname(nickname);
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    updateMe({ nickname: nickname.trim(), profile_emoji: selectedEmoji });
  };

  return (
    <form className="flex h-full flex-col py-8" onSubmit={handleSubmit}>
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground">닉네임</Label>
          <Input
            className="placeholder:text-input px-4 py-6"
            type="text"
            placeholder="여행자"
            value={nickname}
            onChange={handleNicknameChange}
            disabled={isPending}
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label className="text-muted-foreground">프로필 이모지</Label>
          <EmojiPicker value={selectedEmoji} onChange={setSelectedEmoji} disabled={isPending} />
        </div>
      </div>
      <Button className="w-full py-6 text-lg" type="submit" disabled={isPending}>
        시작하기
      </Button>
    </form>
  );
}
