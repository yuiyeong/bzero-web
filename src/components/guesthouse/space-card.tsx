interface SpaceCardProps {
  /** 공간을 나타내는 이모지 아이콘 */
  icon: string;
  /** 공간 이름 */
  title: string;
  /** 공간 설명 */
  description: string;
  /** 클릭 핸들러 */
  onClick?: () => void;
}

/**
 * 게스트하우스 내 공간(사랑방, 라운지, 개인 숙소)을 표시하는 카드 컴포넌트
 */
export function SpaceCard({ icon, title, description, onClick }: SpaceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="glass flex w-full items-center gap-6 rounded-2xl px-6 py-4 text-left"
    >
      {/* 아이콘 */}
      <img className="h-12 w-12" src={icon} alt={`${title} 아이콘`} />

      {/* 공간 정보 */}
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-sm text-zinc-400">{description}</p>
      </div>
    </button>
  );
}
