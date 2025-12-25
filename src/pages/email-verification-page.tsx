import { LoaderPinwheelIcon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import supabase from "@/lib/supabase.ts";
import { toast } from "sonner";
import { ROUTES } from "@/lib/routes.ts";

export default function EmailVerificationPage() {
  const [isChecking, setIsChecking] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 회원가입 페이지에서 전달받은 이메일과 비밀번호
  const { email, password } = (location.state as { email?: string; password?: string }) || {};

  const handleCompleteClicked = async () => {
    // 이메일/비밀번호가 없으면 (직접 URL 접근 시)
    if (!email || !password) {
      toast.error("회원가입 페이지에서 다시 시작해주세요.");
      navigate(ROUTES.SIGN_UP, { replace: true });
      return;
    }

    setIsChecking(true);

    try {
      // 로그인 시도로 이메일 인증 완료 여부 확인
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // email_not_confirmed 에러 = 아직 이메일 인증 안됨
        if (error.code === "email_not_confirmed") {
          toast.error("아직 이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.");
        } else {
          throw error;
        }
        return;
      }

      // 로그인 성공 = 이메일 인증 완료
      if (data.session) {
        navigate(ROUTES.HOME, { replace: true });
      }
    } catch (error) {
      console.error("인증 확인 중 오류 발생:", error);
      toast.error("인증 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="flex h-full flex-col px-6 py-8">
      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        <LoaderPinwheelIcon className="text-primary size-16 animate-spin" />
        <div className="flex flex-col gap-2 text-center">
          <p>회원가입한 이메일을 통해</p>
          <p>인증을 완료해주세요.</p>
        </div>
      </div>
      <Button className="w-full py-6 text-lg" onClick={handleCompleteClicked} disabled={isChecking}>
        {isChecking ? "확인 중..." : "인증 완료"}
      </Button>
    </div>
  );
}
