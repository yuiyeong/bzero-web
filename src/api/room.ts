import apiClient from "@/lib/api-client";
import type { ListResponse, User } from "@/types";

const BASE_URL = "/rooms";

/** 룸 멤버(여행자) 목록 조회 */
export async function getRoomMembers(
  roomId: string,
  params?: {
    limit?: number;
    offset?: number;
  }
): Promise<ListResponse<User>> {
  const response = await apiClient.get<ListResponse<User>>(`${BASE_URL}/${roomId}/members`, {
    params,
  });
  return response.data;
}
