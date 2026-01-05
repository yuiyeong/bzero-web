import { SettingsButton } from "@/components/settings-button.tsx";
import logo from "@/assets/images/logo.webp";

interface TerminalHeaderProps {
  myEmoji: string;
  currentPoints: number;
}

/**
 * B0 터미널 헤더 컴포넌트
 *
 * 로고와 현재 포인트를 표시
 */
export function TerminalHeader({ myEmoji, currentPoints }: TerminalHeaderProps) {
  return (
    <header className="relative z-10 grid grid-cols-3 items-center border-b-0 bg-transparent py-4">
      <div className="justify-self-start text-2xl">{myEmoji}</div>
      <img src={logo} alt="B0 Logo" className="h-10 justify-self-center" />
      <div className="flex items-center gap-3 justify-self-end">
        <div className="bg-b0-purple/20 text-b0-light-purple rounded-full px-3 py-1 text-sm font-semibold">
          {currentPoints}P
        </div>
        <SettingsButton />
      </div>
    </header>
  );
}
