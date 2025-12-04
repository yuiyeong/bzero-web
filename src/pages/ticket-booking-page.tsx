import { useState } from "react";
import { useLocation, useParams } from "react-router";
import { CityInfo } from "@/components/booking/city-info.tsx";
import { AirshipSelector } from "@/components/booking/airship-selector.tsx";
import { PaymentSummary } from "@/components/booking/payment-summary.tsx";
import { PurchaseButton } from "@/components/booking/purchase-button.tsx";
import { useMe } from "@/hooks/queries/use-me.ts";
import { useCity } from "@/hooks/queries/use-city.ts";
import { AIRSHIP_OPTIONS, type AirshipType } from "@/lib/airship.ts";
import type { City } from "@/types.ts";

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
  const { data: cityFromApi, isLoading } = useCity(cityId, {
    enabled: !cityFromState,
  });

  const city = cityFromState || cityFromApi;
  const selectedOption = AIRSHIP_OPTIONS.find((opt) => opt.type === selectedType)!;
  const remainingPoints = (user?.current_points ?? 0) - selectedOption.price;
  const hasEnoughPoints = remainingPoints >= 0;

  const icon = city ? CITY_ICONS[city.name] || "🏙️" : "🏙️";
  const gradient = city
    ? CITY_GRADIENTS[city.name] || "from-purple-600 to-purple-400"
    : "from-purple-600 to-purple-400";

  const handlePurchase = () => {
    // TODO: 티켓 구매 API 호출
  };

  if (isLoading || !city) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-zinc-400">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="-mx-6 flex h-full flex-col px-6 py-6">
      <CityInfo city={city} icon={icon} gradient={gradient} />
      <AirshipSelector selectedType={selectedType} onSelectType={setSelectedType} />
      <PaymentSummary
        currentPoints={user?.current_points ?? 0}
        ticketPrice={selectedOption.price}
        remainingPoints={remainingPoints}
        hasEnoughPoints={hasEnoughPoints}
      />
      <PurchaseButton hasEnoughPoints={hasEnoughPoints} onPurchase={handlePurchase} />
    </div>
  );
}
