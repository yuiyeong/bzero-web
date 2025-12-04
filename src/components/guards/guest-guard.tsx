import { Navigate, Outlet } from "react-router";
import { useAuthSession } from "@/stores/auth-store.ts";
import { ROUTES } from "@/lib/routes.ts";

/**
 * 비인증 사용자(게스트)만 접근할 수 있는 라우트를 보호하는 가드 컴포넌트
 *
 * 이미 로그인된 사용자가 로그인/회원가입 페이지에 접근하면 홈으로 리다이렉트
 */
export default function GuestGuard() {
  const session = useAuthSession();

  // 이미 인증된 사용자는 홈으로 리다이렉트
  if (session) return <Navigate to={ROUTES.HOME} replace />;

  return <Outlet />;
}
