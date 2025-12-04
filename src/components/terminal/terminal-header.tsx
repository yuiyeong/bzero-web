import logo from "@/assets/images/logo.webp";

interface TerminalHeaderProps {
  currentPoints: number;
}

/**
 * B0 터미널 헤더 컴포넌트
 *
 * 로고와 현재 포인트를 표시
 */
export function TerminalHeader({ currentPoints }: TerminalHeaderProps) {
  return (
    <header className="relative z-10 flex items-center justify-between border-b-0 bg-transparent px-6 py-4">
      <div className="text-3xl">🌟</div>
      <img src={logo} alt="B0 Logo" className="h-10" />
      <div className="bg-b0-purple/20 text-b0-light-purple rounded-full px-3 py-1 text-sm font-semibold">
        {currentPoints}P
      </div>
    </header>
  );
}
