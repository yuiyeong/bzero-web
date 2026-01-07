/**
 * 백엔드 보상 API 함수 모음
 */
import type { DailyLoginReward, DataResponse } from "@/types.ts";
import apiClient from "@/lib/api-client.ts";

/**
 * 일일 로그인 보상을 수령합니다
 *
 * 한국 시간 기준 자정마다 초기화되며, 하루에 한 번만 보상을 받을 수 있습니다.
 * - 첫 요청 (같은 날): 100P 지급, claimed=true
 * - 이후 요청 (같은 날): 기존 기록 반환, claimed=false
 */
export async function claimDailyLoginReward(): Promise<DailyLoginReward> {
  const { data } = await apiClient.post<DataResponse<DailyLoginReward>>("/rewards/daily-login/claim");
  return data.data;
}
