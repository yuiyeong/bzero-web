import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "@/api/users.ts";
import type { UseMutationCallback, User } from "@/types.ts";
import { queryKeys } from "@/lib/query-client.ts";
import type { B0ApiError } from "@/lib/api-errors.ts";
import { logger } from "@/lib/logger.ts";

/**
 * 사용자 정보 업데이트 mutation 훅
 *
 * 프로필 완성 페이지에서 닉네임, 이모지 설정 시 사용
 * 성공 시 캐시된 사용자 정보를 자동으로 업데이트
 */
export function useUpdateMe(callback?: UseMutationCallback<User, B0ApiError>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMe,
    onSuccess: (data: User) => {
      // 캐시된 사용자 정보 업데이트 (refetch 없이 즉시 반영)
      queryClient.setQueryData(queryKeys.me.detail, () => data);
      callback?.onSuccess?.(data);
    },
    onError: (error: B0ApiError) => {
      logger.error(error);
      callback?.onError?.(error);
    },
  });
}
