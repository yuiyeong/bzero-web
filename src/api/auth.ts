/**
 * Supabase 인증 API 함수 모음
 */
import supabase from "@/lib/supabase.ts";
import type { AuthResponse } from "@supabase/supabase-js";
import type { AuthCredentials } from "@/types.ts";

/**
 * 이메일/비밀번호로 회원가입
 *
 * 회원가입 후 이메일 인증이 필요함
 */
/**
 * 이메일/비밀번호로 회원가입
 *
 * 회원가입 후 이메일 인증이 필요함
 * 이메일 인증 완료 후 emailRedirectTo로 리다이렉트됨
 */
export async function signUp({ email, password }: AuthCredentials): Promise<AuthResponse["data"]> {
  // 이메일 인증 완료 후 리다이렉트할 URL
  const emailRedirectTo = `${window.location.origin}/auth/email-confirmed`;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
    },
  });

  if (error) throw error;

  return data;
}

/**
 * 이메일/비밀번호로 로그인
 *
 * 이메일 인증이 완료되지 않은 경우 email_not_confirmed 에러 발생
 */
export async function signInWithPassword({ email, password }: AuthCredentials): Promise<AuthResponse["data"]> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw error;

  return data;
}
