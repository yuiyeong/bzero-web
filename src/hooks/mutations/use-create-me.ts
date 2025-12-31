import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationCallback, User } from "@/types.ts";
import { createMe } from "@/api/users.ts";
import { queryKeys } from "@/lib/query-client.ts";
import type { B0ApiError } from "@/lib/api-errors.ts";
import { logger } from "@/lib/logger.ts";

/**
 * 백엔드에 새 사용자 생성 mutation 훅
 *
 * AuthGuard에서 Supabase 인증은 완료했지만 백엔드 User가 없는 경우 자동 호출
 * 성공 시 캐시에 사용자 정보를 저장하여 즉시 사용 가능하게 함
 */
export function useCreateMe(callback?: UseMutationCallback<User, B0ApiError>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMe,
    onSuccess: (data: User) => {
      // 생성된 사용자 정보를 캐시에 저장
      queryClient.setQueryData(queryKeys.me.detail, () => data);
      callback?.onSuccess?.(data);
    },
    onError: (error: B0ApiError) => {
      logger.error(error);
      callback?.onError?.(error);
    },
  });
}
