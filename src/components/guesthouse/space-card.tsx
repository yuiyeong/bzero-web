import { cn } from "@/lib/utils.ts";

interface SpaceCardProps {
  /** 공간을 나타내는 이모지 아이콘 */
  icon: string;
  /** 공간 이름 */
  title: string;
  /** 공간 설명 */
  description: string;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 비활성화 여부 */
  disabled?: boolean;
}

/**
 * 게스트하우스 내 공간(사랑방, 라운지, 개인 숙소)을 표시하는 카드 컴포넌트
 */
export function SpaceCard({ icon, title, description, onClick, disabled }: SpaceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "glass flex w-full items-center gap-6 rounded-2xl px-6 py-4 text-left transition-colors",
        "hover:bg-white/10",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      {/* 아이콘 */}
      <span className="text-5xl">{icon}</span>

      {/* 공간 정보 */}
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-sm text-zinc-400">{description}</p>
      </div>
    </button>
  );
}
