import { AxiosError } from "axios";
import type { ApiError } from "@/types.ts";

/**
 * 백엔드 API 에러 코드 상수
 *
 * 백엔드에서 반환하는 에러 코드와 동일하게 유지해야 함
 */
export const ErrorCode = {
  INTERNAL_SERVER_ERROR: "INTERNAL_ERROR",
  INVALID_PARAMETER: "INVALID_PARAMETER",
  INVALID_AMOUNT: "INVALID_AMOUNT",
  INVALID_EMAIL: "INVALID_EMAIL",
  INVALID_NICKNAME: "INVALID_NICKNAME",
  INVALID_PROFILE: "INVALID_PROFILE",
  INVALID_POINT_TRANSACTION_STATUS: "INVALID_POINT_TRANSACTION_STATUS",
  UNAUTHORIZED: "UNAUTHORIZED",
  NOT_FOUND_USER: "NOT_FOUND_USER",
  DUPLICATED_REWARD: "DUPLICATED_REWARD",
  DUPLICATED_USER: "DUPLICATED_USER",
  PROFILE_INCOMPLETE: "PROFILE_INCOMPLETE",
} as const;

/**
 * B0 백엔드 API 에러 클래스
 *
 * Axios 에러를 래핑하여 일관된 에러 처리를 지원
 */
export class B0ApiError extends Error {
  /** 백엔드에서 정의한 에러 코드 */
  code: string;
  /** HTTP 상태 코드 */
  statusCode: number;

  constructor(code: string, message: string, statusCode: number) {
    super(message);
    this.name = "B0ApiError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**
 * Axios 에러를 B0ApiError로 변환
 *
 * @param error - 원본 에러 객체
 * @returns B0ApiError 인스턴스
 */
export function parseApiError(error: unknown): B0ApiError {
  if (error instanceof AxiosError && error.response?.data?.error) {
    const apiError = error.response.data.error as ApiError;
    return new B0ApiError(apiError.code, apiError.message, error.response.status);
  }
  return new B0ApiError("UNKNOWN", "알 수 없는 오류가 발생했습니다.", 500);
}
