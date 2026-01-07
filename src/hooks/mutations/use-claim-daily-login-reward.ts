import { useMutation, useQueryClient } from "@tanstack/react-query";
import { claimDailyLoginReward } from "@/api/rewards.ts";
import type { DailyLoginReward, UseMutationCallback } from "@/types.ts";
import { queryKeys } from "@/lib/query-client.ts";
import type { B0ApiError } from "@/lib/api-errors.ts";
import { logger } from "@/lib/logger.ts";

/**
 * 일일 로그인 보상 수령 mutation 훅
 *
 * AuthGuard 내 DailyRewardGuard에서 자동 호출되어 일일 보상을 수령
 * 보상 수령 성공 시 사용자 정보 캐시를 무효화하여 포인트 갱신
 */
export function useClaimDailyLoginReward(callback?: UseMutationCallback<DailyLoginReward, B0ApiError>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: claimDailyLoginReward,
    onSuccess: async (data: DailyLoginReward) => {
      // 새로 보상이 지급된 경우에만 사용자 정보 캐시 무효화
      if (data.claimed) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.me.all });
      }
      callback?.onSuccess?.(data);
    },
    onError: (error: B0ApiError) => {
      logger.error(error);
      callback?.onError?.(error);
    },
  });
}
