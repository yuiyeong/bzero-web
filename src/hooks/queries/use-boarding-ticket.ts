import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { getBoardingTicket } from "@/api/tickets.ts";
import { queryKeys } from "@/lib/query-client.ts";
import type { B0ApiError } from "@/lib/api-errors.ts";
import type { Ticket } from "@/types.ts";

interface UseBoardingTicketOptions {
  /** 폴링 간격 (ms). false로 설정 시 폴링 비활성화. 기본값: false */
  refetchInterval?: number | false;
  /** 윈도우 포커스 시 refetch 여부. 기본값: false */
  refetchOnWindowFocus?: boolean;
}

/**
 * 현재 탑승 중인 티켓 정보를 조회하는 쿼리 훅
 *
 * - retry: false로 설정하여 NOT_FOUND 에러 시 재시도하지 않음
 * - 탑승 화면에서 카운트다운 및 도착 정보 표시에 활용
 * - CheckInPage에서 폴링 옵션과 함께 사용
 */
export function useBoardingTicket(options?: UseBoardingTicketOptions): UseQueryResult<Ticket | null, B0ApiError> {
  return useQuery({
    queryKey: queryKeys.tickets.boarding,
    queryFn: async () => {
      try {
        return await getBoardingTicket();
      } catch (error) {
        if (isAxiosError(error) && error.response?.data?.error?.code === "NOT_FOUND_TICKET") {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    refetchInterval: options?.refetchInterval ?? false,
  });
}
