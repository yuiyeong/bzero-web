import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { useSignInWithPassword } from "@/hooks/mutations/use-sign-in-with-password.ts";
import { generateAuthErrorMessage } from "@/lib/errors.ts";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import type { AuthError } from "@supabase/supabase-js";
import { ROUTES } from "@/lib/routes.ts";
import { trackEvent } from "@/lib/analytics.ts";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { mutate: signInWithPassword, isPending } = useSignInWithPassword({
    onSuccess: () => {
      trackEvent("signin_success");
      navigate(ROUTES.HOME, { replace: true });
    },
    onError: (e: AuthError) => {
      trackEvent("signin_error", { error_code: e.code });
      if (e.code === "email_not_confirmed") {
        navigate(ROUTES.EMAIL_VERIFICATION, { replace: true });
      } else {
        toast.error(generateAuthErrorMessage(e));
      }
    },
  });

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    let errorMessage: string | null = null;

    if (email.trim() === "") {
      errorMessage = "이메일을 작성해주세요.";
    } else if (password.trim() === "") {
      errorMessage = "비밀번호를 작성해주세요.";
    }

    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    signInWithPassword({ email, password });
  };

  return (
    <form className="flex h-full flex-col px-6 py-8" onSubmit={handleSubmit}>
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
      </div>
      <Button className="w-full py-6 text-lg" type="submit" disabled={isPending}>
        로그인
      </Button>
    </form>
  );
}
