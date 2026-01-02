import apiClient from "@/lib/api-client";
import type { ListResponse, DirectMessage, DirectMessageRoom } from "@/types";

const BASE_URL = "/dm";

// ============================================================================
// Command (Action)
// ============================================================================

/** 1:1 대화 신청 */
export async function requestDM(toUserId: string): Promise<DirectMessageRoom> {
  const response = await apiClient.post<DirectMessageRoom>(`${BASE_URL}/requests`, {
    to_user_id: toUserId,
  });
  return response.data;
}

/** 1:1 대화 수락 */
export async function acceptDM(dmRoomId: string): Promise<DirectMessageRoom> {
  const response = await apiClient.post<DirectMessageRoom>(`${BASE_URL}/requests/${dmRoomId}/accept`);
  return response.data;
}

/** 1:1 대화 거절 */
export async function rejectDM(dmRoomId: string): Promise<DirectMessageRoom> {
  const response = await apiClient.post<DirectMessageRoom>(`${BASE_URL}/requests/${dmRoomId}/reject`);
  return response.data;
}

// ============================================================================
// Query (Fetch)
// ============================================================================

/** 내 대화방 목록 조회 */
export async function getMyDMRooms(params?: {
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<ListResponse<DirectMessageRoom>> {
  const response = await apiClient.get<ListResponse<DirectMessageRoom>>(`${BASE_URL}/rooms`, {
    params,
  });
  return response.data;
}

/** 대화 메시지 조회 (Infinite Scroll) */
export async function getDMMessages(
  dmRoomId: string,
  params?: {
    cursor?: string; // last_dm_id
    limit?: number;
  }
): Promise<ListResponse<DirectMessage>> {
  const response = await apiClient.get<ListResponse<DirectMessage>>(`${BASE_URL}/rooms/${dmRoomId}/messages`, {
    params,
  });
  return response.data;
}
