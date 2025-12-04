import { useNavigate } from "react-router";
import type { City } from "@/types.ts";

interface CityCardProps {
  city: City;
}

// 도시별 아이콘 매핑
const CITY_ICONS: Record<string, string> = {
  세렌시아: "🌅",
  로렌시아: "🌲",
  엠마시아: "☀️",
  다마린: "🌊",
  갈리시아: "🌟",
};

// 도시별 그라데이션 클래스
const CITY_GRADIENTS: Record<string, string> = {
  세렌시아: "from-[#f97316] to-[#fbbf24]",
  로렌시아: "from-[#22c55e] to-[#16a34a]",
  엠마시아: "from-[#facc15] to-[#fde68a]",
  다마린: "from-[#3b82f6] to-[#60a5fa]",
  갈리시아: "from-[#a855f7] to-[#c084fc]",
};

export default function CityCard({ city }: CityCardProps) {
  const navigate = useNavigate();
  const icon = CITY_ICONS[city.name] || "🏙️";
  const gradient = CITY_GRADIENTS[city.name] || "from-purple-600 to-purple-400";
  const isComingSoon = !city.is_active;

  const handleBookingClick = () => {
    if (isComingSoon) return;
    navigate(`/terminal/booking/${city.city_id}`, { state: { city } });
  };

  return (
    <div
      className={`border-border bg-b0-card-navy relative overflow-hidden rounded-2xl border ${isComingSoon ? "opacity-50" : ""}`}
    >
      {/* 티켓 구멍 효과 */}
      <div className="bg-b0-deep-navy absolute top-1/2 left-[-10px] h-5 w-5 -translate-y-1/2 rounded-full" />
      <div className="bg-b0-deep-navy absolute top-1/2 right-[-10px] h-5 w-5 -translate-y-1/2 rounded-full" />

      {/* 상단: 도시 정보 */}
      <div className="border-border flex items-center gap-4 border-b border-dashed p-5">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-2xl ${gradient}`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="mb-0.5 text-lg font-semibold text-white">{city.name}</div>
          <div className="text-b0-light-purple text-sm">{city.theme}</div>
        </div>
        {isComingSoon && <div className="rounded bg-zinc-700 px-2 py-1 text-xs text-zinc-400">준비 중</div>}
      </div>

      {/* 하단: 티켓 정보 */}
      <div className="flex items-center justify-between p-5">
        <div className="flex gap-5">
          <div>
            <div className="mb-0.5 text-[10px] tracking-wider text-zinc-500 uppercase">출발</div>
            <div className="text-sm font-medium text-zinc-300">B0</div>
          </div>
          <div>
            <div className="mb-0.5 text-[10px] tracking-wider text-zinc-500 uppercase">도착</div>
            <div className="text-sm font-medium text-zinc-300">{city.name}</div>
          </div>
          <div>
            <div className="mb-0.5 text-[10px] tracking-wider text-zinc-500 uppercase">소요</div>
            <div className="text-sm font-medium text-zinc-300">{isComingSoon ? "-" : "5분"}</div>
          </div>
        </div>
        <button
          onClick={handleBookingClick}
          disabled={isComingSoon}
          className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
            isComingSoon ? "cursor-not-allowed bg-zinc-700" : "bg-b0-purple hover:bg-b0-light-purple transition-colors"
          }`}
        >
          {isComingSoon ? (
            <>
              <span className="text-[10px] opacity-80">Coming</span>
              <br />
              Soon
            </>
          ) : (
            <>
              <span className="text-[10px] opacity-80">일반석</span>
              <br />
              300P
            </>
          )}
        </button>
      </div>
    </div>
  );
}
