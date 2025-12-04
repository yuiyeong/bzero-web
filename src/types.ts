/**
 * TanStack Query mutation 훅에서 사용하는 콜백 타입
 */
export type UseMutationCallback<TData = unknown, TError = Error> = {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
};

// ============================================================================
// API 응답 타입
// ============================================================================

/** 백엔드 API 성공 응답 래퍼 타입 */
export interface DataResponse<T> {
  data: T;
}

/** 백엔드 API 에러 객체 타입 */
export interface ApiError {
  code: string;
  message: string;
}

/** 백엔드 API 에러 응답 래퍼 타입 */
export interface ErrorResponse {
  error: ApiError;
}

/** 백엔드 API 페이지네이션 정보 */
export interface Pagination {
  total: number;
  offset: number;
  limit: number;
}

/** 백엔드 API 리스트 응답 래퍼 타입 */
export interface ListResponse<T> {
  list: T[];
  pagination: Pagination;
}

// ============================================================================
// 인증 관련 타입
// ============================================================================

/** Supabase 인증에 사용되는 자격 증명 */
export interface AuthCredentials {
  email: string;
  password: string;
}

// ============================================================================
// 사용자 관련 타입
// ============================================================================

/** 사용자 정보 (백엔드 User 모델과 동일) */
export interface User {
  user_id: string;
  email: string | null;
  nickname: string | null;
  profile_emoji: string | null;
  /** 현재 보유 포인트 */
  current_points: number;
  /** 프로필 완성 여부 (닉네임, 이모지 설정 완료 시 true) */
  is_profile_complete: boolean;
  created_at: string;
  updated_at: string;
}

/** 사용자 정보 업데이트 요청 본문 */
export interface UpdateUserRequestBody {
  nickname: string;
  profile_emoji: string;
}

// ============================================================================
// 도시 관련 타입
// ============================================================================

/** 도시 정보 (백엔드 City 모델과 동일) */
export interface City {
  city_id: string;
  name: string;
  theme: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}
