import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmailStatusMessageProps {
  icon: LucideIcon;
  iconClassName?: string;
  title: string;
  children: ReactNode;
}

/**
 * 이메일 인증 상태 메시지 컴포넌트
 *
 * 이메일 인증 관련 페이지에서 상태별 메시지를 표시할 때 사용
 * 아이콘, 제목, 설명으로 구성된 중앙 정렬 레이아웃
 */
export function EmailStatusMessage({ icon: Icon, iconClassName, title, children }: EmailStatusMessageProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 py-8">
      <Icon className={iconClassName} />
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-xl font-bold">{title}</h2>
        {children}
      </div>
    </div>
  );
}
