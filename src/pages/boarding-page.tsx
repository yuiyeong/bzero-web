import { TicketCard } from "@/components/boarding/ticket-card.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { useBoardingTicket } from "@/hooks/queries/use-boarding-ticket.ts";
import { queryKeys } from "@/lib/query-client.ts";
import { ROUTES } from "@/lib/routes.ts";

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
  const queryClient = useQueryClient();

  const { data: ticket, isLoading, isError } = useBoardingTicket();

  // 탑승 중인 티켓이 없으면 홈으로 리다이렉트
  useEffect(() => {
    if (isError) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isError, navigate]);

  // 도착 시 쿼리 캐시 무효화 후 홈으로 이동 (TravelStatusGuard가 체크인 상태 감지 후 게스트하우스로 리다이렉트)
  const handleArrival = useCallback(async () => {
    // 서버 상태 변경 반영을 위해 관련 쿼리 캐시 무효화
    await queryClient.invalidateQueries({ queryKey: queryKeys.tickets.boarding });
    await queryClient.invalidateQueries({ queryKey: queryKeys.roomStays.current });

    navigate(ROUTES.HOME, { replace: true });
  }, [queryClient, navigate]);

  if (isLoading || !ticket) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center bg-gradient-to-b from-[#3a2a5a] to-[#1a1a2e]">
        <div className="text-zinc-400">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-screen flex-col items-center justify-center">
      {/* 구름 배경 효과 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 text-8xl opacity-10">☁️</div>
        <div className="absolute top-48 right-8 text-6xl opacity-10">☁️</div>
        <div className="absolute top-72 left-5 text-7xl opacity-10">☁️</div>
        <div className="absolute right-12 bottom-48 text-5xl opacity-10">☁️</div>
        <div className="absolute bottom-24 left-10 text-6xl opacity-10">☁️</div>
      </div>

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
      <p className="relative z-10 mt-8 text-center text-zinc-400">비행 중..!</p>
    </div>
  );
}
