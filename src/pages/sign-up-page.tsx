import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { toast } from "sonner";
import { useSignUp } from "@/hooks/mutations/use-sign-up.ts";
import { generateAuthErrorMessage } from "@/lib/errors.ts";
import { useNavigate } from "react-router";
import type { AuthError } from "@supabase/supabase-js";
import { ROUTES } from "@/lib/routes.ts";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { mutate: signUp, isPending } = useSignUp({
    onSuccess: () => {
      navigate(ROUTES.EMAIL_VERIFICATION, { replace: true });
    },
    onError: (e: AuthError) => {
      toast.error(generateAuthErrorMessage(e));
    },
  });

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    let errorMessage: string | null = null;

    if (email.trim() === "") {
      errorMessage = "이메일을 작성해주세요.";
    } else if (password.trim() === "") {
      errorMessage = "비밀번호를 작성해주세요.";
    } else if (password.length < 8) {
      errorMessage = "비밀번호는 8자 이상이어야 합니다.";
    } else if (password !== confirmPassword) {
      errorMessage = "비밀번호가 다릅니다. 확인해주세요.";
    }

    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    signUp({ email, password });
  };

  return (
    <form className="flex h-full flex-col py-8" onSubmit={handleSubmit}>
      <div className="flex flex-1 flex-col gap-2">
        <Label className="text-muted-foreground">이메일</Label>
        <Input
          className="placeholder:text-input px-4 py-6"
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={handleEmailChange}
          disabled={isPending}
        />

        <Label className="text-muted-foreground mt-4">비밀번호</Label>
        <Input
          className="placeholder:text-input px-4 py-6"
          type="password"
          placeholder="8자 이상 입력해주세요."
          value={password}
          onChange={handlePasswordChange}
          disabled={isPending}
        />

        <Label className="text-muted-foreground mt-4">비밀번호 확인</Label>
        <Input
          className="placeholder:text-input px-4 py-6"
          type="password"
          placeholder="8자 이상 입력해주세요."
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          disabled={isPending}
        />
      </div>
      <Button className="w-full py-6 text-lg" type="submit" disabled={isPending}>
        다음
      </Button>
    </form>
  );
}
