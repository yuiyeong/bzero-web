/**
 * 백엔드 비행선 API 함수 모음
 */
import type { Airship, ListResponse } from "@/types.ts";
import apiClient from "@/lib/api-client.ts";

/**
 * 비행선 목록 조회
 *
 * @returns 비행선 목록 및 페이지네이션 정보
 */
export async function getAirships(): Promise<ListResponse<Airship>> {
  const { data } = await apiClient.get<ListResponse<Airship>>("/airships");
  return data;
}
