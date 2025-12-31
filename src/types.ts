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

// ============================================================================
// 공간 관련 type
// ============================================================================

export type SpaceType = "living_room" | "lounge" | "private_room";

// ============================================================================
// 체류(RoomStay) 관련 타입
// ============================================================================

/** 체류 상태 */
export type RoomStayStatus = "checked_in" | "checked_out" | "extended";

/** 체류 정보 (백엔드 RoomStay 모델과 동일) */
export interface RoomStay {
  room_stay_id: string;
  user_id: string;
  city_id: string;
  guest_house_id: string;
  room_id: string;
  ticket_id: string;
  status: RoomStayStatus;
  check_in_at: string;
  scheduled_check_out_at: string;
  actual_check_out_at: string | null;
  extension_count: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// 일기(Diary) 관련 타입
// ============================================================================

/** 일기 정보 (백엔드 DiaryResponse와 동일) */
export interface Diary {
  diary_id: string;
  user_id: string;
  room_stay_id: string;
  city_id: string;
  guest_house_id: string;
  title: string;
  mood: string;
  content: string;
  created_at: string;
  updated_at: string;
}

/** 일기 목록 응답 (백엔드 DiaryListResponse와 동일 - Flat structure) */
export interface DiaryListResponse {
  items: Diary[];
  total: number;
  offset: number;
  limit: number;
}

/** 일기 작성 요청 본문 */
export interface CreateDiaryRequest {
  title: string;
  mood: string;
  content: string;
}

/** 일기 수정 요청 본문 */
export interface UpdateDiaryRequest {
  title?: string;
  mood?: string;
  content?: string;
}

// ============================================================================
// 문답지(Questionnaire) 관련 타입
// ============================================================================

/** 문답지 질문 (백엔드 CityQuestionResponse와 동일) */
export interface CityQuestion {
  city_question_id: string;
  city_id: string;
  question: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/** 문답지 답변 (백엔드 QuestionnaireResponse와 동일) */
export interface Questionnaire {
  questionnaire_id: string;
  user_id: string;
  room_stay_id: string;
  city_question_id: string;
  city_question: string; // 질문 내용 스냅샷
  answer: string;
  city_id: string;
  guest_house_id: string;
  created_at: string;
  updated_at: string;
}

/** 문답지 답변 작성 요청 본문 */
export interface CreateQuestionnaireRequest {
  city_question_id: string;
  answer: string;
}

/** 채팅 메시지 타입 */
export type ChatMessageType = "text" | "card_shared" | "system";

/** 채팅 메시지 (백엔드 ChatMessageResponse와 동일) */
export interface ChatMessage {
  /** 메시지 고유 ID */
  message_id: string;
  /** 룸 ID */
  room_id: string;
  /** 발신자 ID (시스템 메시지는 null) */
  user_id: string | null;
  /** 메시지 내용 */
  content: string;
  /** 카드 공유 시 카드 ID */
  card_id: string | null;
  /** 메시지 타입 */
  message_type: ChatMessageType;
  /** 시스템 메시지 여부 */
  is_system: boolean;
  /** 생성 시간 */
  created_at: string;
  /** 발신자 정보 (프론트엔드에서 조인) */
  sender?: ChatMessageSender;
}

/** 메시지 발신자 정보 (User에서 필요한 필드만 추출) */
export interface ChatMessageSender {
  user_id: string;
  nickname: string | null;
  profile_emoji: string | null;
}

/**
 * 룸 멤버 정보
 *
 * 실제 API 응답은 UserResponse (User 타입)를 반환하므로,
 * 멤버 목록에는 User 타입을 재사용합니다.
 * 이 타입은 sender 조인 시 필요한 필드를 명시하기 위해 별도로 정의합니다.
 */
export type RoomMember = Pick<User, "user_id" | "nickname" | "profile_emoji">;

/** 대화 카드 */
export interface ConversationCard {
  card_id: string;
  city_id: string | null;
  question: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/** Socket.IO 연결 상태 */
export type SocketConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

/** Socket.IO 에러 */
export interface SocketError {
  code: string;
  message: string;
}

// ============================================================================
// 채팅 페이지네이션 타입
// ============================================================================

/** useInfiniteQuery 페이지 데이터 */
export interface ChatMessagePage {
  messages: ChatMessage[];
  nextCursor: string | undefined;
}
