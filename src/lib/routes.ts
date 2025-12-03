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
  /** 프로필 완성 페이지 (닉네임, 이모지 설정) */
  PROFILE_COMPLETION: "/profile-completion",
} as const;
