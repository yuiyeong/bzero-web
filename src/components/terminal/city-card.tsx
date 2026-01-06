import { useNavigate } from "react-router";
import { buildPath } from "@/lib/routes.ts";
import type { Airship, City } from "@/types.ts";
import { trackButtonClick } from "@/lib/analytics.ts";

interface CityCardProps {
  city: City;
  /** 기본 비행선 (cost_factor가 가장 낮은 비행선) */
  baseAirship: Airship | null;
}

// 도시별 테마 그라디언트 및 아이콘 배경
const CITY_THEMES: Record<string, string> = {
  세렌시아: "from-orange-500 to-amber-400",
  로렌시아: "from-green-500 to-green-600",
  엠마시아: "from-yellow-400 to-yellow-200",
  다마린: "from-blue-500 to-blue-400",
  갈리시아: "from-purple-500 to-purple-400",
};

const DEFAULT_THEME = "from-zinc-500 to-zinc-400";

// 도시별 이모지 매핑 (백엔드에 없을 경우 대비)
const CITY_ICONS: Record<string, string> = {
  세렌시아: "🌅",
  로렌시아: "🌲",
  엠마시아: "☀️",
  다마린: "🌫️",
  갈리시아: "🌆", // 와이어프레임엔 없음, 임의 지정
};

export function CityCard({ city, baseAirship }: CityCardProps) {
  const navigate = useNavigate();
  const isComingSoon = !city.is_active;

  // 가격 계산: city.base_cost_points × airship.cost_factor
  const price = baseAirship ? city.base_cost_points * baseAirship.cost_factor : 0;

  // 테마 색상 결정
  const gradientClass = Object.entries(CITY_THEMES).find(([key]) => city.name.includes(key))?.[1] ?? DEFAULT_THEME;
  const iconEmoji = city.image_url ? null : (CITY_ICONS[city.name] ?? "🏙️");

  const handleBookingClick = () => {
    if (isComingSoon) return;
    trackButtonClick("city_select", { city_id: city.city_id, city_name: city.name });
    navigate(buildPath.ticketBooking(city.city_id), { state: { city } });
  };

  return (
    <div
      onClick={handleBookingClick}
      className={`relative mb-4 overflow-hidden rounded-2xl border border-white/10 bg-[#1e1e24] ${
        isComingSoon ? "cursor-not-allowed opacity-50" : "cursor-pointer transition-transform active:scale-[0.98]"
      }`}
    >
      {/* 티켓 노치 (좌우 반원) */}
      <div className="absolute top-1/2 left-[-10px] h-5 w-5 -translate-y-1/2 rounded-full bg-[#121212]" />
      <div className="absolute top-1/2 right-[-10px] h-5 w-5 -translate-y-1/2 rounded-full bg-[#121212]" />

      {/* 상단: 목적지 정보 */}
      <div className="flex items-center gap-4 border-b border-dashed border-white/10 px-5 py-4">
        {/* 도시 아이콘 */}
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradientClass} text-2xl shadow-lg`}
        >
          {city.image_url ? (
            <img src={city.image_url} alt={city.name} className="h-full w-full rounded-xl object-cover" />
          ) : (
            iconEmoji
          )}
        </div>

        {/* 도시 이름 및 테마 */}
        <div className="flex-1">
          <div className="mb-[2px] text-[18px] font-semibold text-white">{city.name}</div>
          <div className="text-[13px] text-[#a78bfa]">{city.theme}</div>
        </div>

        {/* Coming Soon 뱃지 (상단) */}
        {isComingSoon && <div className="rounded bg-zinc-800/50 px-2 py-1 text-xs text-zinc-500">준비 중</div>}
      </div>

      {/* 하단: 경로 및 가격 정보 */}
      <div className="flex items-center justify-between px-5 py-3">
        {/* 경로 정보 */}
        <div className="flex gap-5">
          {/* 출발 */}
          <div className="text-left">
            <div className="mb-[2px] text-[10px] tracking-[1px] text-zinc-500 uppercase">출발</div>
            <div className="text-[14px] font-medium text-zinc-300">B0</div>
          </div>
          {/* 도착 */}
          <div className="text-left">
            <div className="mb-[2px] text-[10px] tracking-[1px] text-zinc-500 uppercase">도착</div>
            <div className="text-[14px] font-medium text-zinc-300">{city.name}</div>
          </div>
          {/* 소요 */}
          <div className="text-left">
            <div className="mb-[2px] text-[10px] tracking-[1px] text-zinc-500 uppercase">소요</div>
            <div className="text-[14px] font-medium text-zinc-300">
              {isComingSoon || !baseAirship ? "-" : (baseAirship.description?.replace(" 소요", "") ?? "5분")}
            </div>
          </div>
        </div>

        {/* 가격 배지 */}
        {isComingSoon ? (
          <div className="rounded-lg bg-zinc-700 px-4 py-2 text-[14px] font-semibold text-zinc-400">
            <span className="mb-0.5 block text-[10px] leading-none opacity-80">Coming</span>
            Soon
          </div>
        ) : (
          <div className="rounded-lg bg-[#7c3aed] px-4 py-2 text-right text-white shadow-lg shadow-purple-500/20">
            <span className="mb-0.5 block text-[10px] leading-none opacity-80">{baseAirship?.name ?? "일반석"}</span>
            <span className="text-[14px] font-semibold">{price}P</span>
          </div>
        )}
      </div>
    </div>
  );
}
