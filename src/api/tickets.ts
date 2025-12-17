/**
 * 백엔드 티켓 API 함수 모음
 */
import type { DataResponse, PurchaseTicketRequestBody, Ticket } from "@/types.ts";
import apiClient from "@/lib/api-client.ts";

/**
 * 비행선 티켓 구매
 *
 * @param body - 티켓 구매 요청 본문 (city_id, airship_id)
 * @returns 구매된 티켓 정보
 * @throws {B0ApiError} 포인트 부족, 유효하지 않은 도시/비행선 등
 */
export async function purchaseTicket(body: PurchaseTicketRequestBody): Promise<Ticket> {
  const { data } = await apiClient.post<DataResponse<Ticket>>("/tickets", body);
  return data.data;
}
