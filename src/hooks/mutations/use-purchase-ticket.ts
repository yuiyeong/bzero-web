import { useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseTicket } from "@/api/tickets.ts";
import type { UseMutationCallback, Ticket } from "@/types.ts";
import { queryKeys } from "@/lib/query-client.ts";
import type { B0ApiError } from "@/lib/api-errors.ts";

/**
 * 비행선 티켓 구매 mutation 훅
 *
 * 티켓 예매 페이지에서 티켓 구매 시 사용
 * 성공 시 캐시된 사용자 정보를 무효화하여 포인트 갱신
 */
export function usePurchaseTicket(callback?: UseMutationCallback<Ticket, B0ApiError>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: purchaseTicket,
    onSuccess: async (data: Ticket) => {
      // 사용자 정보 캐시 무효화 (포인트가 차감되므로 다시 조회)
      await queryClient.invalidateQueries({ queryKey: queryKeys.me.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });

      callback?.onSuccess?.(data);
    },
    onError: (error: B0ApiError) => {
      console.error(error);
      callback?.onError?.(error);
    },
  });
}
