import { useMutation } from "@tanstack/react-query";
import { signInWithPassword } from "@/api/auth.ts";
import type { UseMutationCallback } from "@/types.ts";
import type { AuthError, AuthResponse } from "@supabase/supabase-js";

/**
 * 이메일/비밀번호 로그인 mutation 훅
 *
 * - 성공 시 홈으로 이동
 * - email_not_confirmed 에러 시 이메일 인증 페이지로 이동
 */
export function useSignInWithPassword(callbacks?: UseMutationCallback<AuthResponse["data"], AuthError>) {
  return useMutation({
    mutationFn: signInWithPassword,
    onSuccess: (data: AuthResponse["data"]) => callbacks?.onSuccess?.(data),
    onError: (error: AuthError) => {
      console.error(error);
      callbacks?.onError?.(error);
    },
  });
}
