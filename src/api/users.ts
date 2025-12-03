/**
 * 백엔드 사용자 API 함수 모음
 */
import type { DataResponse, UpdateUserRequestBody, User } from "@/types.ts";
import apiClient from "@/lib/api-client.ts";

/**
 * 현재 로그인한 사용자 정보 조회
 *
 * @throws {B0ApiError} NOT_FOUND_USER - 백엔드에 사용자가 존재하지 않는 경우
 */
export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<DataResponse<User>>("/users/me");
  return data.data;
}

/**
 * 현재 로그인한 사용자 정보 업데이트 (닉네임, 프로필 이모지)
 */
export async function updateMe(body: UpdateUserRequestBody): Promise<User> {
  const { data } = await apiClient.patch<DataResponse<User>>("/users/me", body);
  return data.data;
}

/**
 * 백엔드에 새 사용자 생성
 *
 * Supabase 회원가입 후 최초 로그인 시 AuthGuard에서 자동 호출됨
 */
export async function createMe(): Promise<User> {
  const { data } = await apiClient.post<DataResponse<User>>("/users/me");
  return data.data;
}
