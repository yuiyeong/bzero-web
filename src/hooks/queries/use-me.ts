import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getMe } from "@/api/users.ts";
import { queryKeys } from "@/lib/query-client.ts";
import type { B0ApiError } from "@/lib/api-errors.ts";
import type { User } from "@/types.ts";

/**
 * 현재 로그인한 사용자 정보를 조회하는 쿼리 훅
 *
 * - retry: false로 설정하여 NOT_FOUND_USER 에러 시 재시도하지 않음
 * - AuthGuard에서 사용자 존재 여부 확인에 활용
 */
export function useMe(): UseQueryResult<User, B0ApiError> {
  return useQuery({
    queryKey: queryKeys.me.detail,
    queryFn: getMe,
    retry: false,
  });
}
