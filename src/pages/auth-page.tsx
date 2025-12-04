import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router";
import { ROUTES } from "@/lib/routes.ts";

export default function AuthPage() {
  return (
    <div className="flex h-full flex-col gap-4 py-12">
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="text-primary text-3xl font-bold">B0</div>
        <div>"당신의 마음이 잠시 쉬어갈 곳"</div>
      </div>

      <Link to={ROUTES.SIGN_UP}>
        <Button className="w-full py-6 text-lg">회원가입</Button>
      </Link>

      <div className="flex w-full items-center justify-center gap-2">
        <div>이미 계정이 있으신가요?</div>
        <Link className="text-primary hover:cursor-pointer hover:underline" to={ROUTES.SIGN_IN}>
          로그인
        </Link>
      </div>
    </div>
  );
}
