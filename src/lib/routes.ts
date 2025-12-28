/**
 * 애플리케이션 라우트 경로 상수
 *
 * 모든 라우트 경로를 한 곳에서 관리하여 타이핑 실수를 방지하고 유지보수성을 높임
 */
export const ROUTES = {
  /** 홈 (메인 페이지) */
  HOME: "/",
  /** 온보딩 페이지 */
  ONBOARDING: "/onboarding",
  /** 인증 시작 페이지 (로그인/회원가입 선택) */
  AUTH: "/auth",
  /** 로그인 페이지 */
  SIGN_IN: "/auth/sign-in",
  /** 회원가입 페이지 */
  SIGN_UP: "/auth/sign-up",
  /** 이메일 인증 안내 페이지 */
  EMAIL_VERIFICATION: "/auth/email-verification",
  /** 이메일 인증 완료 페이지 */
  EMAIL_CONFIRMED: "/auth/email-confirmed",
  /** 프로필 완성 페이지 (닉네임, 이모지 설정) */
  PROFILE_COMPLETION: "/profile-completion",
  /** B0 비행선 터미널 홈 */
  TERMINAL: "/terminal",
  /** 비행선 티켓 예매 */
  TICKET_BOOKING: "/terminal/city/:cityId/booking",
  /** 비행선 탑승 중 (이동 화면) */
  BOARDING: "/boarding",
  /** 게스트하우스 */
  GUESTHOUSE: "/guesthouses/:guesthouseId",
  /** 사랑방 */
  LIVING_ROOM: "/guesthouses/:guesthouseId/living-room",
  /** 라운지 */
  LOUNGE: "/guesthouses/:guesthouseId/lounge",
  /** 개인 숙소 */
  PRIVATE_ROOM: "/guesthouses/:guesthouseId/private-room",
  /** 일기장 */
  DIARY: "/guesthouses/:guesthouseId/private-room/diary",
  /** 문답지 */
  QUESTIONNAIRE: "/guesthouses/:guesthouseId/private-room/questionnaire",
} as const;

/**
 * 파라미터가 있는 라우트 경로 빌더
 *
 * ROUTES 상수의 동적 파라미터를 실제 값으로 대체하여 경로를 생성
 */
export const buildPath = {
  /** 비행선 티켓 예매 경로 */
  ticketBooking: (cityId: string) => ROUTES.TICKET_BOOKING.replace(":cityId", cityId),
  /** 게스트하우스 경로 */
  guesthouse: (guesthouseId: string) => ROUTES.GUESTHOUSE.replace(":guesthouseId", guesthouseId),
  /** 사랑방 경로 */
  livingRoom: (guesthouseId: string) => ROUTES.LIVING_ROOM.replace(":guesthouseId", guesthouseId),
  /** 라운지 경로 */
  lounge: (guesthouseId: string) => ROUTES.LOUNGE.replace(":guesthouseId", guesthouseId),
  /** 개인 숙소 경로 */
  privateRoom: (guesthouseId: string) => ROUTES.PRIVATE_ROOM.replace(":guesthouseId", guesthouseId),
  /** 일기장 경로 */
  diary: (guesthouseId: string) => ROUTES.DIARY.replace(":guesthouseId", guesthouseId),
  /** 문답지 경로 */
  questionnaire: (guesthouseId: string) => ROUTES.QUESTIONNAIRE.replace(":guesthouseId", guesthouseId),
} as const;
