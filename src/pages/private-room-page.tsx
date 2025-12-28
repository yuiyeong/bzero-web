import img_bg_private_room from "@/assets/images/img_bg_private_room.webp";
import { Button } from "@/components/ui/button.tsx";
import { buildPath } from "@/lib/routes.ts";
import { useNavigate, useParams } from "react-router";

export default function PrivateRoomPage() {
  const navigate = useNavigate();
  const { guesthouseId } = useParams<{ guesthouseId: string }>();

  const handleDiaryClick = () => {
    if (!guesthouseId) return;
    navigate(buildPath.diary(guesthouseId));
  };

  const handleQuestionnaireClick = () => {
    if (!guesthouseId) return;
    navigate(buildPath.questionnaire(guesthouseId));
  };

  const handleBackClick = () => {
    if (!guesthouseId) return;
    navigate(buildPath.guesthouse(guesthouseId));
  };

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* 배경 이미지 */}
      <img className="absolute inset-0 h-full w-full object-cover" src={img_bg_private_room} alt="개인 숙소 배경" />
      <div className="absolute inset-0 bg-black/60" />

      {/* 헤더 (뒤로가기) */}
      <div className="relative z-10 flex h-14 items-center px-4">
        <Button variant="ghost" className="text-white hover:bg-white/10" onClick={handleBackClick}>
          ← 돌아가기
        </Button>
      </div>

      {/* 메인 컨텐츠 (대시보드) */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-6 pb-20">
        <h1 className="text-3xl font-bold text-white drop-shadow-lg">나만의 공간</h1>
        <p className="text-center text-zinc-300">
          이곳에서는 여행을 기록하고
          <br />
          자신을 돌아볼 수 있습니다.
        </p>

        <div className="grid w-full max-w-sm grid-cols-2 gap-4">
          <DashboardCard title="일기장" description="오늘 하루 기록하기" icon="📝" onClick={handleDiaryClick} />
          <DashboardCard title="문답지" description="나를 찾아가는 질문" icon="💭" onClick={handleQuestionnaireClick} />
        </div>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  icon,
  onClick,
}: {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="glass group flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl p-4 transition-all hover:bg-white/10 active:scale-95"
    >
      <span className="text-4xl transition-transform group-hover:scale-110">{icon}</span>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-xs text-zinc-400">{description}</p>
      </div>
    </button>
  );
}
