import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getBoardingTicket } from "@/api/tickets.ts";
import { queryKeys } from "@/lib/query-client.ts";
import type { B0ApiError } from "@/lib/api-errors.ts";
import type { Ticket } from "@/types.ts";

/**
 * 현재 탑승 중인 티켓 정보를 조회하는 쿼리 훅
 *
 * - retry: false로 설정하여 NOT_FOUND 에러 시 재시도하지 않음
 * - 탑승 화면에서 카운트다운 및 도착 정보 표시에 활용
 */
export function useBoardingTicket(): UseQueryResult<Ticket, B0ApiError> {
  return useQuery({
    queryKey: queryKeys.tickets.boarding,
    queryFn: getBoardingTicket,
    retry: false,
  });
}
