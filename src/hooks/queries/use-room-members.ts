import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getRoomMembers } from "@/api/chat.ts";
import { queryKeys } from "@/lib/query-client.ts";
import type { B0ApiError } from "@/lib/api-errors.ts";
import type { User } from "@/types.ts";

interface UseRoomMembersOptions {
  /** 쿼리 활성화 여부 (기본값: true) */
  enabled?: boolean;
}

/**
 * 채팅방 멤버 목록을 조회하는 Query 훅
 *
 * 채팅방 헤더에서 참여자 수 표시 및 메시지 sender 조인에 사용
 *
 * @param roomId - 룸 ID
 * @param options - 쿼리 옵션
 */
export function useRoomMembers(
  roomId: string | undefined,
  options?: UseRoomMembersOptions
): UseQueryResult<User[], B0ApiError> {
  return useQuery({
    queryKey: queryKeys.chat.members(roomId || ""),
    queryFn: async () => {
      const response = await getRoomMembers(roomId!);
      return response.list;
    },
    enabled: options?.enabled !== false && !!roomId,
  });
}
