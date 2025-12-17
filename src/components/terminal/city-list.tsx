import { CityCard } from "@/components/terminal/city-card.tsx";
import type { Airship, City } from "@/types.ts";

interface CityListProps {
  cities: City[];
  /** 기본 비행선 (cost_factor가 가장 낮은 비행선) */
  baseAirship: Airship | null;
  isLoading: boolean;
  isError: boolean;
}

/**
 * 도시 목록 컴포넌트
 *
 * 도시 목록, 로딩 상태, 에러 상태를 처리
 */
export function CityList({ cities, baseAirship, isLoading, isError }: CityListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-zinc-400">로딩 중...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-red-400">도시 목록을 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cities.map((city) => (
        <CityCard key={city.city_id} city={city} baseAirship={baseAirship} />
      ))}
    </div>
  );
}
