import { useComingSoonCities } from "@/hooks/queries/use-coming-soon-cities";
import { Skeleton } from "@/components/ui/skeleton";
import { CityCard } from "@/components/terminal/city-card";

export function ComingSoonSection() {
  const { data: cities, isLoading } = useComingSoonCities();

  // 데이터가 없으면 섹션을 표시하지 않음
  if (!isLoading && (!cities || cities.length === 0)) {
    return null;
  }

  return (
    <div className="mt-8">
      {/* Section Header */}
      <div className="mb-4 flex items-center gap-2 px-4">
        <span className="text-lg">🚀</span>
        <h2 className="text-sm font-medium text-zinc-400">곧 새로운 여행지가 열려요</h2>
      </div>

      {/* Vertical Stack Cities */}
      <div className="space-y-4 pb-10">
        {isLoading
          ? // 로딩 스켈레톤 - Ticket size
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[140px] w-full rounded-2xl bg-zinc-900/50" />
            ))
          : cities?.map((city) => <CityCard key={city.city_id} city={city} baseAirship={null} />)}
      </div>
    </div>
  );
}
