import { LoaderPinwheelIcon } from "lucide-react";
import { useLocation } from "react-router";
import { useCurrentRoomStay } from "@/hooks/queries/use-current-room-stay.ts";
import { useBoardingTicket } from "@/hooks/queries/use-boarding-ticket.ts";

const POLLING_INTERVAL = 5000;

/**
 * 체크인 페이지
 *
 * 비행선 도착 후 체크인 처리 중인 상태를 표시
 * - roomStay와 ticket을 폴링하여 상태 변화 감지
 * - roomStay가 생기면 TravelStatusGuard가 자동으로 게스트하우스로 리다이렉트
 */
export default function CheckInPage() {
  const location = useLocation();

  // location.state에서 cityName을 받음 (BoardingPage에서 전달)
  const { cityName: cityNameFromState } = (location.state as { cityName?: string }) || {};

  // roomStay와 ticket을 5초마다 폴링
  // roomStay가 생기거나 ticket이 삭제되면 TravelStatusGuard가 적절히 리다이렉트
  useCurrentRoomStay({
    refetchInterval: POLLING_INTERVAL,
    refetchOnWindowFocus: true,
  });

  const { data: ticket } = useBoardingTicket({
    refetchInterval: POLLING_INTERVAL,
    refetchOnWindowFocus: true,
  });

  const cityName = cityNameFromState || ticket?.city.name || "도시";

  return (
    <div className="bg-b0-deep-navy flex h-full flex-col items-center justify-center">
      <LoaderPinwheelIcon className="text-primary size-16 animate-spin" />
      <p className="mt-6 text-xl text-white">체크인 하는 중...</p>
      <p className="mt-2 text-sm text-zinc-400">{cityName}에 도착했습니다</p>
    </div>
  );
}
