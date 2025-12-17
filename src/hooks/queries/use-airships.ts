import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getAirships } from "@/api/airships.ts";
import { queryKeys } from "@/lib/query-client.ts";
import type { B0ApiError } from "@/lib/api-errors.ts";
import type { Airship, ListResponse } from "@/types.ts";

/**
 * 비행선 목록을 조회하는 쿼리 훅
 *
 * 티켓 구매 페이지에서 비행선 옵션을 표시할 때 사용
 */
export function useAirships(): UseQueryResult<ListResponse<Airship>, B0ApiError> {
  return useQuery({
    queryKey: queryKeys.airships.all,
    queryFn: getAirships,
  });
}
