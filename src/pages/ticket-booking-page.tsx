import { useState } from "react";
import { useLocation, useParams } from "react-router";
import { toast } from "sonner";
import { CityInfo } from "@/components/booking/city-info.tsx";
import { AirshipSelector } from "@/components/booking/airship-selector.tsx";
import { PaymentSummary } from "@/components/booking/payment-summary.tsx";
import { PurchaseButton } from "@/components/booking/purchase-button.tsx";
import { getCityIcon, getCityGradient } from "@/lib/city-theme.ts";
import { useMe } from "@/hooks/queries/use-me.ts";
import { useCity } from "@/hooks/queries/use-city.ts";
import { AIRSHIP_OPTIONS, type AirshipType } from "@/lib/airship.ts";
import type { City } from "@/types.ts";

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

  const icon = city ? getCityIcon(city.name) : "🏙️";
  const gradient = city ? getCityGradient(city.name) : "from-purple-600 to-purple-400";

  const handlePurchase = () => {
    // TODO: 티켓 구매 API 호출
    toast.info("티켓 구매 기능은 곧 제공될 예정입니다.");
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
