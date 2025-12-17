import { SpaceCard } from "@/components/guesthouse/space-card.tsx";
import { toast } from "sonner";

/** 게스트하우스 내 공간 정보 */
const SPACES = [
  { icon: "💬", title: "사랑방", description: "다른 여행자들과 대화" },
  { icon: "👥", title: "라운지", description: "1:1 대화 신청" },
  { icon: "🛏️", title: "개인 숙소", description: "일기와 문답지 작성" },
] as const;

/**
 * 게스트하우스 거실에서 이동 가능한 공간 목록을 표시하는 컴포넌트
 *
 * MVP에서는 클릭 시 "준비 중" 토스트 표시
 */
export function SpaceList() {
  const handleSpaceClick = (spaceName: string) => {
    toast.info(`${spaceName} 기능은 준비 중입니다.`);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      {SPACES.map((space) => (
        <SpaceCard
          key={space.title}
          icon={space.icon}
          title={space.title}
          description={space.description}
          onClick={() => handleSpaceClick(space.title)}
        />
      ))}
    </div>
  );
}
