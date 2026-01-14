import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getCurrentRoomStay } from "@/api/room-stays.ts";
import { queryKeys } from "@/lib/query-client.ts";
import type { B0ApiError } from "@/lib/api-errors.ts";
import type { RoomStay } from "@/types.ts";

interface UseCurrentRoomStayOptions {
  /** 폴링 간격 (ms). false로 설정 시 폴링 비활성화. 기본값: false */
  refetchInterval?: number | false;
  /** 윈도우 포커스 시 refetch 여부. 기본값: false */
  refetchOnWindowFocus?: boolean;
}

/**
 * 현재 체크인 중인 체류 정보를 조회하는 쿼리 훅
 *
 * - retry: false로 설정하여 NOT_FOUND 에러 시 재시도하지 않음
 * - TravelStatusGuard에서 사용자의 체류 상태 확인에 활용
 * - CheckInPage에서 폴링 옵션과 함께 사용
 */
export function useCurrentRoomStay(options?: UseCurrentRoomStayOptions): UseQueryResult<RoomStay, B0ApiError> {
  return useQuery({
    queryKey: queryKeys.roomStays.current,
    queryFn: getCurrentRoomStay,
    retry: false,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    refetchInterval: options?.refetchInterval ?? false,
  });
}
