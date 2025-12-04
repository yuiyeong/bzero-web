/**
 * 백엔드 도시 API 함수 모음
 */
import type { City, DataResponse, ListResponse } from "@/types.ts";
import apiClient from "@/lib/api-client.ts";

/**
 * 활성화된 도시 목록 조회
 *
 * @param offset - 조회 시작 위치 (기본값: 0)
 * @param limit - 조회할 최대 개수 (기본값: 20)
 * @returns 활성화된 도시 목록 및 페이지네이션 정보
 */
export async function getActiveCities(offset = 0, limit = 20): Promise<ListResponse<City>> {
  const { data } = await apiClient.get<ListResponse<City>>("/cities", {
    params: { offset, limit },
  });
  return data;
}

/**
 * 도시 상세 정보 조회
 *
 * @param cityId - 도시 ID (UUID hex 문자열)
 * @returns 도시 상세 정보
 * @throws {B0ApiError} NOT_FOUND - 도시를 찾을 수 없는 경우
 */
export async function getCityById(cityId: string): Promise<City> {
  const { data } = await apiClient.get<DataResponse<City>>(`/cities/${cityId}`);
  return data.data;
}
