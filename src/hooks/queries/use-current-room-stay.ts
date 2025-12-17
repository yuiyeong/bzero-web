import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getCurrentRoomStay } from "@/api/room-stays.ts";
import { queryKeys } from "@/lib/query-client.ts";
import type { B0ApiError } from "@/lib/api-errors.ts";
import type { RoomStay } from "@/types.ts";

/**
 * 현재 체크인 중인 체류 정보를 조회하는 쿼리 훅
 *
 * - retry: false로 설정하여 NOT_FOUND 에러 시 재시도하지 않음
 * - TravelStatusGuard에서 사용자의 체류 상태 확인에 활용
 */
export function useCurrentRoomStay(): UseQueryResult<RoomStay, B0ApiError> {
  return useQuery({
    queryKey: queryKeys.roomStays.current,
    queryFn: getCurrentRoomStay,
    retry: false,
  });
}
