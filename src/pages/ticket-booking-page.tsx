import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { CityInfo } from "@/components/booking/city-info.tsx";
import { AirshipSelector } from "@/components/booking/airship-selector.tsx";
import { PaymentSummary } from "@/components/booking/payment-summary.tsx";
import { PurchaseButton } from "@/components/booking/purchase-button.tsx";
import { useMe } from "@/hooks/queries/use-me.ts";
import { useCity } from "@/hooks/queries/use-city.ts";
import { useAirships } from "@/hooks/queries/use-airships.ts";
import { usePurchaseTicket } from "@/hooks/mutations/use-purchase-ticket.ts";
import type { B0ApiError } from "@/lib/api-errors.ts";
import { ROUTES } from "@/lib/routes.ts";
import type { City } from "@/types.ts";

export default function TicketBookingPage() {
  const { cityId } = useParams<{ cityId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const cityFromState = location.state?.city as City | undefined;

  const [selectedAirshipId, setSelectedAirshipId] = useState<string | null>(null);

  const { data: user } = useMe();
  const { data: airshipsData, isLoading: isAirshipsLoading } = useAirships();
  const { mutate: purchaseTicket, isPending } = usePurchaseTicket({
    onSuccess: (ticket) => {
      toast.success(`${ticket.city.name}행 티켓이 발권되었습니다.`);
      navigate(ROUTES.BOARDING, { replace: true });
    },
    onError: (error: B0ApiError) => {
      toast.error(error.message);
    },
  });

  const airships = airshipsData?.list ?? [];

  // state로 전달된 city가 없으면 API로 조회
  const { data: cityFromApi, isLoading: isCityLoading } = useCity(cityId, {
    enabled: !cityFromState,
  });

  const city = cityFromState || cityFromApi;
  const isLoading = isCityLoading || isAirshipsLoading;

  // 선택된 비행선 찾기 (없으면 첫 번째 비행선 자동 선택)
  const selectedAirship = airships.find((a) => a.airship_id === selectedAirshipId) ?? airships[0] ?? null;

  // 티켓 가격 계산: city.base_cost_points × airship.cost_factor
  const ticketPrice = city && selectedAirship ? city.base_cost_points * selectedAirship.cost_factor : 0;
  const remainingPoints = (user?.current_points ?? 0) - ticketPrice;
  const hasEnoughPoints = remainingPoints >= 0;

  const handleSelectAirship = (airshipId: string) => {
    setSelectedAirshipId(airshipId);
  };

  const handlePurchase = () => {
    if (!city || !selectedAirship) return;
    purchaseTicket({
      city_id: city.city_id,
      airship_id: selectedAirship.airship_id,
    });
  };

  if (isLoading || !city || airships.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-zinc-400">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col px-6 py-6">
      <CityInfo city={city} gradient="from-purple-600 to-purple-400" />
      <AirshipSelector
        airships={airships}
        selectedAirshipId={selectedAirship?.airship_id ?? null}
        baseCostPoints={city.base_cost_points}
        onSelectAirship={handleSelectAirship}
      />
      <PaymentSummary
        currentPoints={user?.current_points ?? 0}
        ticketPrice={ticketPrice}
        remainingPoints={remainingPoints}
        hasEnoughPoints={hasEnoughPoints}
      />
      <PurchaseButton hasEnoughPoints={hasEnoughPoints} isPending={isPending} onPurchase={handlePurchase} />
    </div>
  );
}
