import { useQuery } from "@tanstack/react-query";
import { getActiveCities } from "@/api/cities.ts";
import CityCard from "@/components/terminal/city-card.tsx";
import { useMe } from "@/hooks/queries/use-me.ts";
import logo from "@/assets/images/logo.png";

export default function TerminalPage() {
  const { data: user } = useMe();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cities", "active"],
    queryFn: () => getActiveCities(0, 20),
  });

  return (
    <div className="relative -mx-6 flex h-full flex-col">
      {/* 배경 효과 */}
      <div className="from-b0-purple/15 absolute top-0 right-0 left-0 h-[180px] overflow-hidden bg-gradient-to-b to-transparent">
        <div className="bg-b0-light-purple/30 absolute top-5 left-1/2 h-[120px] w-[200px] -translate-x-1/2 rounded-full blur-3xl" />
      </div>

      {/* 헤더 */}
      <header className="relative z-10 flex items-center justify-between border-b-0 bg-transparent px-6 py-4">
        <div className="text-3xl">🌟</div>
        <img src={logo} alt="B0 Logo" className="h-10" />
        <div className="bg-b0-purple/20 text-b0-light-purple rounded-full px-3 py-1 text-sm font-semibold">
          {user?.current_points ?? 0}P
        </div>
      </header>

      {/* 스크롤 영역 */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 pb-5">
        {/* 타이틀 */}
        <div className="pt-16 pb-4 text-center">
          <h1 className="mb-1 text-sm tracking-[2px] text-zinc-400 uppercase">Departure Terminal</h1>
          <h2 className="text-[22px] font-semibold text-white">어디로 떠나볼까요?</h2>
        </div>

        {/* 안내 메시지 */}
        <div className="border-b0-purple/30 bg-b0-purple/10 mb-4 flex items-start gap-3 rounded-xl border p-3">
          <div className="text-xl">🛫</div>
          <div className="text-[13px] leading-relaxed text-zinc-300">
            비행선을 타고 원하는 도시로 떠나보세요.
            <br />각 도시에서 새로운 여행자들을 만날 수 있어요.
          </div>
        </div>

        {/* 도시 목록 */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-zinc-400">로딩 중...</div>
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center py-20">
            <div className="text-red-400">도시 목록을 불러오는데 실패했습니다.</div>
          </div>
        )}

        {data && (
          <div className="space-y-4">
            {data.list.map((city) => (
              <CityCard key={city.city_id} city={city} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
