import { useState } from "react";
import { useLocation, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getCityById } from "@/api/cities.ts";
import { useMe } from "@/hooks/queries/use-me.ts";
import type { City } from "@/types.ts";

// 비행선 종류
type AirshipType = "standard" | "express";

interface AirshipOption {
  type: AirshipType;
  name: string;
  duration: string;
  price: number;
}

const AIRSHIP_OPTIONS: AirshipOption[] = [
  { type: "standard", name: "일반 비행선", duration: "5분 소요", price: 300 },
  { type: "express", name: "쾌속 비행선", duration: "즉시 도착", price: 500 },
];

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

export default function TicketBookingPage() {
  const { cityId } = useParams<{ cityId: string }>();
  const location = useLocation();
  const cityFromState = location.state?.city as City | undefined;

  const [selectedType, setSelectedType] = useState<AirshipType>("standard");

  const { data: user } = useMe();

  // state로 전달된 city가 없으면 API로 조회
  const { data: cityFromApi, isLoading } = useQuery({
    queryKey: ["cities", cityId],
    queryFn: () => getCityById(cityId!),
    enabled: !cityFromState && !!cityId,
  });

  const city = cityFromState || cityFromApi;
  const selectedOption = AIRSHIP_OPTIONS.find((opt) => opt.type === selectedType)!;
  const remainingPoints = (user?.current_points ?? 0) - selectedOption.price;
  const hasEnoughPoints = remainingPoints >= 0;

  const icon = city ? CITY_ICONS[city.name] || "🏙️" : "🏙️";
  const gradient = city
    ? CITY_GRADIENTS[city.name] || "from-purple-600 to-purple-400"
    : "from-purple-600 to-purple-400";

  if (isLoading || !city) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-zinc-400">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="-mx-6 flex h-full flex-col px-6 py-6">
      {/* 도시 정보 */}
      <div className="mb-6 text-center">
        <div
          className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[20px] bg-gradient-to-br text-[40px] ${gradient}`}
        >
          {icon}
        </div>
        <h2 className="mb-1 text-2xl font-semibold text-white">{city.name}</h2>
        <p className="text-b0-light-purple mb-2 text-sm">{city.theme}</p>
        <p className="text-sm leading-relaxed text-zinc-400">
          {city.description || "노을빛 항구 마을에서\n소중한 인연을 만나요"}
        </p>
      </div>

      {/* 티켓 선택 */}
      <div className="mb-6">
        <h3 className="mb-3 text-base font-semibold text-white">티켓 선택</h3>
        <div className="space-y-3">
          {AIRSHIP_OPTIONS.map((option) => (
            <button
              key={option.type}
              onClick={() => setSelectedType(option.type)}
              className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                selectedType === option.type
                  ? "border-b0-purple bg-b0-purple/10"
                  : "border-border bg-b0-card-navy hover:border-zinc-600"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full border-2 transition-all ${
                  selectedType === option.type ? "border-b0-purple bg-b0-purple" : "border-zinc-600"
                }`}
              >
                {selectedType === option.type && (
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">{option.name}</h3>
                <p className="text-sm text-zinc-400">{option.duration}</p>
              </div>
              <div className="text-b0-light-purple font-semibold">{option.price}P</div>
            </button>
          ))}
        </div>
      </div>

      {/* 결제 정보 */}
      <div className="border-border bg-b0-card-navy mb-6 rounded-lg border p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-zinc-400">보유 포인트</span>
          <span className="text-sm font-medium text-zinc-200">{user?.current_points ?? 0}P</span>
        </div>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-zinc-400">티켓 가격</span>
          <span className="text-sm font-medium text-red-400">-{selectedOption.price}P</span>
        </div>
        <div className="border-border flex items-center justify-between border-t pt-3">
          <span className="text-sm text-zinc-400">결제 후 잔액</span>
          <span className={`text-base font-semibold ${hasEnoughPoints ? "text-b0-light-purple" : "text-red-400"}`}>
            {remainingPoints}P
          </span>
        </div>
      </div>

      {/* 포인트 부족 안내 */}
      {!hasEnoughPoints && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          포인트가 부족합니다. 일기를 쓰거나 대화에 참여해보세요.
        </div>
      )}

      {/* 구매 버튼 */}
      <div className="mt-auto">
        <button
          disabled={!hasEnoughPoints}
          className={`w-full rounded-lg py-4 text-base font-semibold text-white transition-colors ${
            hasEnoughPoints ? "bg-b0-purple hover:bg-b0-light-purple" : "cursor-not-allowed bg-zinc-700 text-zinc-400"
          }`}
        >
          🎫 비행선 탑승하기
        </button>
      </div>
    </div>
  );
}
