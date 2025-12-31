import {
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { getRoomMessages, joinSenderToMessages } from "@/api/chat.ts";
import { queryKeys } from "@/lib/query-client.ts";
import type { B0ApiError } from "@/lib/api-errors.ts";
import type { ChatMessagePage, User } from "@/types.ts";

interface UseRoomMessagesOptions {
  /** 쿼리 활성화 여부 (기본값: true) */
  enabled?: boolean;
}

/**
 * 채팅방 메시지를 조회하는 Infinite Query 훅
 *
 * cursor 기반 페이지네이션으로 이전 메시지 로드 지원
 * fetchNextPage로 이전 메시지를 불러올 수 있음
 *
 * @param roomId - 룸 ID
 * @param options - 쿼리 옵션
 */
export function useRoomMessages(
  roomId: string | undefined,
  options?: UseRoomMessagesOptions
): UseInfiniteQueryResult<InfiniteData<ChatMessagePage>, B0ApiError> {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: queryKeys.chat.messages(roomId || ""),
    queryFn: async ({ pageParam }) => {
      const response = await getRoomMessages(roomId!, pageParam, 50);

      // API가 최신→과거 순으로 반환하므로 reverse하여 오래된 순으로 정렬
      const sortedMessages = [...response.list].reverse();

      // 캐시된 멤버 정보로 sender 조인
      const members = queryClient.getQueryData<User[]>(queryKeys.chat.members(roomId!)) ?? [];
      const messagesWithSender = joinSenderToMessages(sortedMessages, members);

      // 다음 페이지 커서 계산 (원본 응답의 마지막 메시지 ID = 가장 오래된 메시지)
      const nextCursor = response.list.length >= 50 ? response.list[response.list.length - 1].message_id : undefined;

      return {
        messages: messagesWithSender,
        nextCursor,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
    enabled: options?.enabled !== false && !!roomId,
  });
}
