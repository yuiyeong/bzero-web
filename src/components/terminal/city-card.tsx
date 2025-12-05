import { useNavigate } from "react-router";
import { getCityIcon, getCityGradient } from "@/lib/city-theme.ts";
import { ROUTES } from "@/lib/routes.ts";
import { AIRSHIP_OPTIONS } from "@/lib/airship.ts";
import type { City } from "@/types.ts";

interface CityCardProps {
  city: City;
}

const STANDARD_AIRSHIP = AIRSHIP_OPTIONS[0]; // 일반 비행선

export function CityCard({ city }: CityCardProps) {
  const navigate = useNavigate();
  const icon = getCityIcon(city.name);
  const gradient = getCityGradient(city.name);
  const isComingSoon = !city.is_active;

  const handleBookingClick = () => {
    if (isComingSoon) return;
    navigate(ROUTES.TICKET_BOOKING.replace(":cityId", city.city_id), { state: { city } });
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
            <div className="text-sm font-medium text-zinc-300">{isComingSoon ? "-" : STANDARD_AIRSHIP.duration}</div>
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
              {STANDARD_AIRSHIP.price}P
            </>
          )}
        </button>
      </div>
    </div>
  );
}
