import { SpaceCard } from "@/components/guesthouse/space-card.tsx";

import icon_living_room from "@/assets/images/icon_living_room.webp";
import icon_private_room from "@/assets/images/icon_private_room.webp";
import icon_lounge from "@/assets/images/icon_lounge.webp";
import type { SpaceType } from "@/types.ts";
import { useNavigate, useParams } from "react-router";
import { buildPath } from "@/lib/routes.ts";
import { trackButtonClick } from "@/lib/analytics.ts";

/** 게스트하우스 내 공간 정보 */
const SPACES = [
  { icon: icon_living_room, spaceType: "living_room", title: "사랑방", description: "다른 여행자들과 대화" },
  { icon: icon_lounge, spaceType: "lounge", title: "라운지", description: "1:1 대화 신청" },
  { icon: icon_private_room, spaceType: "private_room", title: "개인 숙소", description: "일기와 문답지 작성" },
] as const;

/**
 * 게스트하우스 거실에서 이동 가능한 공간 목록을 표시하는 컴포넌트
 *
 * MVP에서는 클릭 시 "준비 중" 토스트 표시
 */
export function SpaceList() {
  const navigate = useNavigate();
  const { guesthouseId } = useParams<{ guesthouseId: string }>();

  const handleSpaceClick = (spaceType: SpaceType) => {
    if (!guesthouseId) return;

    trackButtonClick("space_select", { space_type: spaceType });

    switch (spaceType) {
      case "living_room":
        navigate(buildPath.livingRoom(guesthouseId));
        break;
      case "lounge":
        navigate(buildPath.lounge(guesthouseId));
        break;
      case "private_room":
        navigate(buildPath.privateRoom(guesthouseId));
        break;
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6">
      {SPACES.map((space) => (
        <SpaceCard
          key={space.title}
          icon={space.icon}
          title={space.title}
          description={space.description}
          onClick={() => handleSpaceClick(space.spaceType)}
        />
      ))}
    </div>
  );
}
