import { useMutation } from "@tanstack/react-query";
import { signUp } from "@/api/auth.ts";
import type { UseMutationCallback } from "@/types.ts";
import type { AuthError, AuthResponse } from "@supabase/supabase-js";

/**
 * 이메일/비밀번호 회원가입 mutation 훅
 *
 * 성공 시 이메일 인증 페이지로 이동해야 함
 */
export function useSignUp(callbacks?: UseMutationCallback<AuthResponse["data"], AuthError>) {
  return useMutation({
    mutationFn: signUp,
    onSuccess: (data: AuthResponse["data"]) => callbacks?.onSuccess?.(data),
    onError: (error: AuthError) => {
      console.error(error);
      callbacks?.onError?.(error);
    },
  });
}
