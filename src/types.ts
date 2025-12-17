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
  /** 기본 비용 (포인트) */
  base_cost_points: number;
  /** 기본 소요 시간 (시간) */
  base_duration_hours: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// 비행선 관련 타입
// ============================================================================

/** 비행선 정보 */
export interface Airship {
  airship_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  /** 비용 계수 (티켓 가격 = city.base_cost_points × cost_factor) */
  cost_factor: number;
  /** 시간 계수 (소요 시간 = city.base_duration_hours / duration_factor) */
  duration_factor: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// 티켓 관련 타입
// ============================================================================

/** 티켓 상태 */
export type TicketStatus = "boarding" | "completed" | "cancelled";

/** 도시 스냅샷 (티켓 구매 시점의 도시 정보) */
export interface CitySnapshot {
  city_id: string;
  name: string;
  theme: string;
  image_url: string | null;
  description: string | null;
}

/** 비행선 스냅샷 (티켓 구매 시점의 비행선 정보) */
export interface AirshipSnapshot {
  airship_id: string;
  name: string;
  image_url: string | null;
  description: string;
}

/** 티켓 정보 (백엔드 Ticket 모델과 동일) */
export interface Ticket {
  ticket_id: string;
  /** 티켓 번호 (예: B0-2025-1234567890123) */
  ticket_number: string;
  /** 도시 스냅샷 */
  city: CitySnapshot;
  /** 비행선 스냅샷 */
  airship: AirshipSnapshot;
  /** 티켓 비용 (포인트) */
  cost_points: number;
  /** 티켓 상태 */
  status: TicketStatus;
  /** 출발 일시 */
  departure_datetime: string;
  /** 도착 일시 */
  arrival_datetime: string;
  created_at: string;
  updated_at: string;
}

/** 티켓 구매 요청 본문 */
export interface PurchaseTicketRequestBody {
  city_id: string;
  airship_id: string;
}
