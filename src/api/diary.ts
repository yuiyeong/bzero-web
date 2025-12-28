/**
 * 백엔드 일기(Diary) API 함수 모음
 */
import type { CreateDiaryRequest, DataResponse, Diary, DiaryListResponse, UpdateDiaryRequest } from "@/types.ts";
import apiClient from "@/lib/api-client.ts";

/**
 * 내 일기 목록 조회
 *
 * @param params - 페이지네이션 파라미터 (page, size)
 * @returns 일기 목록 및 페이지네이션 정보
 */
export async function getMyDiaries(params: { page: number; size: number }): Promise<DiaryListResponse> {
  const { data } = await apiClient.get<DiaryListResponse>("/diaries", { params });
  return data;
}

/**
 * 일기 상세 조회
 *
 * @param diaryId - 조회할 일기 ID
 * @returns 일기 상세 정보
 */
export async function getDiaryDetail(diaryId: string): Promise<Diary> {
  const { data } = await apiClient.get<DataResponse<Diary>>(`/diaries/${diaryId}`);
  return data.data;
}

/**
 * 일기 작성
 *
 * @param body - 일기 작성 요청 본문
 * @returns 작성된 일기 정보
 */
export async function createDiary(body: CreateDiaryRequest): Promise<Diary> {
  const { data } = await apiClient.post<DataResponse<Diary>>("/diaries", body);
  return data.data;
}

/**
 * 일기 수정
 *
 * @param diaryId - 수정할 일기 ID
 * @param body - 일기 수정 요청 본문
 * @returns 수정된 일기 정보
 */
export async function updateDiary(diaryId: string, body: UpdateDiaryRequest): Promise<Diary> {
  const { data } = await apiClient.patch<DataResponse<Diary>>(`/diaries/${diaryId}`, body);
  return data.data;
}
