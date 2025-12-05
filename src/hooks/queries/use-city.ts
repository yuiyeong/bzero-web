import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getCityById } from "@/api/cities.ts";
import { queryKeys } from "@/lib/query-client.ts";
import type { B0ApiError } from "@/lib/api-errors.ts";
import type { City } from "@/types.ts";

interface UseCityOptions {
  /** 쿼리 활성화 여부 (기본값: true) */
  enabled?: boolean;
}

/**
 * 도시 상세 정보를 조회하는 쿼리 훅
 *
 * 비행선 티켓 예매 페이지에서 도시 정보를 표시할 때 사용
 * state로 전달된 도시 정보가 없는 경우에만 API를 호출하도록 enabled 옵션 활용
 *
 * @param cityId - 도시 ID (UUID hex 문자열)
 * @param options - 쿼리 옵션
 */
export function useCity(cityId: string | undefined, options?: UseCityOptions): UseQueryResult<City, B0ApiError> {
  return useQuery({
    queryKey: queryKeys.cities.detail(cityId || ""),
    queryFn: () => getCityById(cityId!),
    enabled: options?.enabled !== false && !!cityId,
  });
}
