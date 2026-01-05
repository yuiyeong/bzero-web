import { Settings } from "lucide-react";
import { useNavigate } from "react-router";
import { ROUTES } from "@/lib/routes.ts";

interface SettingsButtonProps {
  className?: string;
}

/**
 * 설정 페이지로 이동하는 버튼 컴포넌트
 *
 * 터미널 헤더, 게스트하우스 페이지 등에서 재사용
 */
export function SettingsButton({ className }: SettingsButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(ROUTES.SETTINGS);
  };

  return (
    <button type="button" onClick={handleClick} className={className} aria-label="설정">
      <Settings className="text-primary size-6" />
    </button>
  );
}
