/**
 * 백엔드 문답지(Questionnaire) API 함수 모음
 */
import type { CityQuestion, CreateQuestionnaireRequest, DataResponse, ListResponse, Questionnaire } from "@/types.ts";
import apiClient from "@/lib/api-client.ts";

/**
 * 도시별 질문 목록 조회
 *
 * @param cityId - 조회할 도시 ID
 * @returns 질문 목록 (display_order 정렬됨)
 */
export async function getCityQuestions(cityId: string): Promise<CityQuestion[]> {
  const { data } = await apiClient.get<ListResponse<CityQuestion>>("/city-questions", {
    params: { city_id: cityId },
  });
  return data.list;
}

/**
 * 내 답변 목록 조회
 *
 * @param params - 페이지네이션 파라미터 (offset, limit)
 */
export async function getMyQuestionnaires(params: {
  offset: number;
  limit: number;
  current_stay_only?: boolean;
}): Promise<ListResponse<Questionnaire>> {
  const { data } = await apiClient.get<ListResponse<Questionnaire>>("/questionnaires", { params });
  return data;
}

/**
 * 답변 작성
 *
 * @param body - 답변 작성 요청 본문
 * @returns 작성된 답변 정보
 */
export async function createQuestionnaire(body: CreateQuestionnaireRequest): Promise<Questionnaire> {
  const { data } = await apiClient.post<DataResponse<Questionnaire>>("/questionnaires", body);
  return data.data;
}
