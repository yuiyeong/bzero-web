import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import apiClient from "@/lib/api-client.ts";
import { queryKeys } from "@/lib/query-client.ts";
import type { B0ApiError } from "@/lib/api-errors.ts";
import type { ListResponse, City } from "@/types.ts";

/**
 * Coming Soon 도시 목록을 조회하는 쿼리 훅
 *
 * is_active=false인 도시만 필터링하여 반환
 */
export function useComingSoonCities(): UseQueryResult<City[], B0ApiError> {
  return useQuery({
    queryKey: [...queryKeys.cities.all, "coming-soon"],
    queryFn: async () => {
      // include_inactive=true로 전체 도시 조회 후 inactive만 필터
      const { data } = await apiClient.get<ListResponse<City>>("/cities", {
        params: { offset: 0, limit: 50, include_inactive: true },
      });
      return data.list.filter((city) => !city.is_active);
    },
  });
}
