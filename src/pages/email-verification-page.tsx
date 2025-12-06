import { LoaderPinwheelIcon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { useNavigate } from "react-router";
import { ROUTES } from "@/lib/routes.ts";

export default function EmailVerificationPage() {
  const navigate = useNavigate();

  const handleCompleteClicked = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <div className="flex h-full flex-col py-8">
      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        <LoaderPinwheelIcon className="text-primary size-16 animate-spin" />
        <div className="flex flex-col gap-2 text-center">
          <p>회원가입한 이메일을 통해</p>
          <p>인증을 완료해주세요.</p>
        </div>
      </div>
      <Button className="w-full py-6 text-lg" onClick={handleCompleteClicked}>
        인증 완료
      </Button>
    </div>
  );
}
