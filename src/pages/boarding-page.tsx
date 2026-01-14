import { TicketCard } from "@/components/boarding/ticket-card.tsx";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { useBoardingTicket } from "@/hooks/queries/use-boarding-ticket.ts";
import { ROUTES } from "@/lib/routes.ts";
import GlobalLoader from "@/components/global-loader.tsx";
import img_bg_boarding from "@/assets/images/img_bg_boarding.webp";
import { trackEvent } from "@/lib/analytics.ts";

/**
 * 비행선 탑승 중 화면
 *
 * - 탑승 중인 티켓 정보 표시
 * - 도착까지 카운트다운 타이머 (TicketCard 내부에서 처리)
 * - 도착 시 게스트하우스 페이지로 이동
 * - 탑승 중인 티켓이 없으면 홈으로 리다이렉트
 */
export default function BoardingPage() {
  const navigate = useNavigate();

  const { data: ticket, isLoading, isError } = useBoardingTicket();

  // 탑승 중인 티켓이 없으면 홈으로 리다이렉트
  useEffect(() => {
    if (isError) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isError, navigate]);

  // 도착 시 체크인 페이지로 이동
  const handleArrival = useCallback(async () => {
    if (ticket) {
      trackEvent("arrival", { city_id: ticket.city.city_id });
    }
    // 체크인 페이지로 이동 (city 이름을 state로 전달)
    navigate(ROUTES.CHECK_IN, {
      replace: true,
      state: { cityName: ticket?.city.name },
    });
  }, [navigate, ticket]);

  if (isLoading || !ticket) {
    return <GlobalLoader />;
  }

  return (
    <div className="relative flex h-full flex-col items-center justify-center">
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src={img_bg_boarding}
        alt="날아가는 비행선의 배경 이미지"
      />
      <div className="absolute inset-0 bg-black/75" />

      {/* 티켓 카드 */}
      <div className="relative z-10 w-full max-w-sm px-4">
        <TicketCard
          ticketNumber={ticket.ticket_number}
          city={ticket.city}
          airship={ticket.airship}
          arrivalDatetime={ticket.arrival_datetime}
          onArrival={handleArrival}
        />
      </div>

      {/* 하단 안내 문구 */}
      <p className="relative z-10 mt-8 animate-bounce text-center text-zinc-400">비행 중..!</p>
    </div>
  );
}
