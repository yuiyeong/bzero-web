/**
 * 백엔드 체류(RoomStay) API 함수 모음
 */
import type { DataResponse, RoomStay } from "@/types.ts";
import apiClient from "@/lib/api-client.ts";

/**
 * 현재 체크인 중인 체류 정보 조회
 *
 * @returns 현재 체류 정보
 * @throws {B0ApiError} NOT_FOUND - 체크인 중인 체류가 없는 경우
 */
export async function getCurrentRoomStay(): Promise<RoomStay> {
  const { data } = await apiClient.get<DataResponse<RoomStay>>("/room-stays/current");
  return data.data;
}

/**
 * 현재 체류를 체크아웃합니다.
 */
export async function checkoutCurrentStay(): Promise<RoomStay> {
  const { data } = await apiClient.post<DataResponse<RoomStay>>("/room-stays/current/checkout");
  return data.data;
}

/**
 * 현재 체류를 연장합니다. (300포인트 차감, 24시간 연장)
 */
export async function extendCurrentStay(): Promise<RoomStay> {
  const { data } = await apiClient.post<DataResponse<RoomStay>>("/room-stays/current/extend");
  return data.data;
}
