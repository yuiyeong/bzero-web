import { useNavigate } from "react-router";
import { ROUTES } from "@/lib/routes.ts";
import logo from "@/assets/images/logo.webp";

interface TerminalHeaderProps {
  myEmoji: string;
  currentPoints: number;
}

/**
 * B0 터미널 헤더 컴포넌트
 *
 * 로고와 현재 포인트를 표시
 * 이모지를 클릭하면 설정 페이지로 이동
 */
export function TerminalHeader({ myEmoji, currentPoints }: TerminalHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="relative z-10 grid grid-cols-3 items-center border-b-0 bg-transparent py-4">
      <button
        onClick={() => navigate(ROUTES.MYPAGE)}
        className="justify-self-start text-2xl transition-transform hover:scale-110"
        aria-label="설정"
      >
        {myEmoji}
      </button>
      <img src={logo} alt="B0 Logo" className="h-10 justify-self-center" />
      <div className="flex items-center gap-3 justify-self-end">
        <div className="bg-b0-purple/20 text-b0-light-purple rounded-full px-3 py-1 text-sm font-semibold">
          {currentPoints}P
        </div>
      </div>
    </header>
  );
}
