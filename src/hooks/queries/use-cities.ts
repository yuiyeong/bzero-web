import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getActiveCities } from "@/api/cities.ts";
import { queryKeys } from "@/lib/query-client.ts";
import type { B0ApiError } from "@/lib/api-errors.ts";
import type { ListResponse, City } from "@/types.ts";

/**
 * 도시 목록을 조회하는 쿼리 훅
 *
 * B0 터미널 페이지에서 도시 목록을 표시할 때 사용
 * includeInactive=true일 경우 비활성화된 도시도 포함
 *
 * @param offset - 조회 시작 위치 (기본값: 0)
 * @param limit - 조회할 최대 개수 (기본값: 20)
 * @param includeInactive - 비활성화된 도시 포함 여부 (기본값: false)
 */
export function useCities(
  offset = 0,
  limit = 20,
  includeInactive = false
): UseQueryResult<ListResponse<City>, B0ApiError> {
  return useQuery({
    queryKey: [...queryKeys.cities.all, { offset, limit, includeInactive }],
    queryFn: () => getActiveCities(offset, limit),
  });
}
