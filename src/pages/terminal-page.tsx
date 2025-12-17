import { TerminalHeader } from "@/components/terminal/terminal-header.tsx";
import { TerminalTitle } from "@/components/terminal/terminal-title.tsx";
import { TerminalInfo } from "@/components/terminal/terminal-info.tsx";
import { CityList } from "@/components/terminal/city-list.tsx";
import { useMe } from "@/hooks/queries/use-me.ts";
import { useActiveCities } from "@/hooks/queries/use-active-cities.ts";
import { useAirships } from "@/hooks/queries/use-airships.ts";
import type { Airship } from "@/types.ts";

const CITIES_PER_PAGE = 20;

export default function TerminalPage() {
  const { data: user } = useMe();
  const {
    data: cityListData,
    isLoading: isCitiesLoading,
    isError: isCitiesError,
  } = useActiveCities(0, CITIES_PER_PAGE);
  const { data: airshipListData, isLoading: isAirshipsLoading, isError: isAirshipsError } = useAirships();

  const airships: Airship[] = airshipListData?.list ?? [];

  // 기본 비행선: cost_factor가 가장 낮은 비행선
  const baseAirship =
    airships.length > 0 ? airships.reduce((min, a) => (a.cost_factor < min.cost_factor ? a : min), airships[0]) : null;

  const isLoading = isCitiesLoading || isAirshipsLoading;
  const isError = isCitiesError || isAirshipsError;

  return (
    <div className="relative -mx-6 flex h-full flex-col px-6">
      {/* 배경 효과 */}
      <div className="from-b0-purple/15 absolute top-0 right-0 left-0 h-[180px] overflow-hidden bg-gradient-to-b to-transparent">
        <div className="bg-b0-light-purple/30 absolute top-5 left-1/2 h-[120px] w-[200px] -translate-x-1/2 rounded-full blur-3xl" />
      </div>

      <TerminalHeader currentPoints={user?.current_points ?? 0} />

      {/* 스크롤 영역 */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 pb-5">
        <TerminalTitle />
        <TerminalInfo />
        <CityList cities={cityListData?.list ?? []} baseAirship={baseAirship} isLoading={isLoading} isError={isError} />
      </div>
    </div>
  );
}
