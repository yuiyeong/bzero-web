import { CheckCircle2Icon, LoaderCircleIcon, XCircleIcon } from "lucide-react";
import { EmailStatusMessage } from "@/components/email-status-message.tsx";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase.ts";
import { logger } from "@/lib/logger.ts";

/**
 * 이메일 인증 완료 페이지
 *
 * Supabase 이메일 인증 링크를 통해 리다이렉트된 후 표시되는 페이지
 * URL 해시에서 토큰을 파싱하여 세션을 생성하고 사용자에게 안내
 */
export default function EmailConfirmedPage() {
  const [status, setStatus] = useState<"checking" | "success" | "error">("checking");

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Supabase가 URL 해시를 자동으로 파싱하여 세션 생성
        // 약간의 지연을 두고 세션 확인
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session && session.user.email_confirmed_at) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        logger.error("세션 확인 중 오류:", error);
        setStatus("error");
      }
    };

    checkSession();
  }, []);

  if (status === "checking") {
    return (
      <EmailStatusMessage
        icon={LoaderCircleIcon}
        iconClassName="text-primary size-16 animate-spin"
        title="인증 처리 중..."
      >
        <p className="text-muted-foreground">잠시만 기다려주세요.</p>
      </EmailStatusMessage>
    );
  }

  if (status === "error") {
    return (
      <EmailStatusMessage icon={XCircleIcon} iconClassName="text-destructive size-16" title="인증 처리 실패">
        <p className="text-muted-foreground">인증 링크가 만료되었거나 잘못되었습니다.</p>
        <p className="text-muted-foreground">다시 시도해주세요.</p>
      </EmailStatusMessage>
    );
  }

  return (
    <EmailStatusMessage icon={CheckCircle2Icon} iconClassName="text-primary size-16" title="이메일 인증 완료!">
      <p className="text-muted-foreground">인증이 성공적으로 완료되었습니다.</p>
      <p className="text-muted-foreground">이 탭을 닫고 앱으로 돌아가주세요.</p>
    </EmailStatusMessage>
  );
}
