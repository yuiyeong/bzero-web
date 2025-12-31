import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getRandomConversationCard } from "@/api/chat.ts";
import { queryKeys } from "@/lib/query-client.ts";
import type { B0ApiError } from "@/lib/api-errors.ts";
import type { ConversationCard } from "@/types.ts";

interface UseRandomConversationCardOptions {
  /** 쿼리 활성화 여부 (기본값: true) */
  enabled?: boolean;
}

/**
 * 랜덤 대화 카드를 조회하는 쿼리 훅
 *
 * - 모달이 열릴 때 enabled=true로 활성화
 * - refetch()로 새 카드 뽑기
 * - staleTime: 0으로 설정하여 항상 새로운 카드 fetch
 *
 * @param cityId - 도시 ID
 * @param options - 쿼리 옵션
 */
export function useRandomConversationCard(
  cityId: string | undefined,
  options?: UseRandomConversationCardOptions
): UseQueryResult<ConversationCard, B0ApiError> {
  return useQuery({
    queryKey: queryKeys.chat.card(cityId || ""),
    queryFn: () => getRandomConversationCard(cityId!),
    enabled: options?.enabled !== false && !!cityId,
    staleTime: 0, // 항상 새로운 카드 fetch
    gcTime: 0, // 캐시 즉시 제거 (다시 뽑기 시 새로운 카드 보장)
  });
}
