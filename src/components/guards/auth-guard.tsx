import { useEffect, useRef } from "react";
import { useAuthSession } from "@/stores/auth-store.ts";
import { Navigate, Outlet, useLocation } from "react-router";
import { useMe } from "@/hooks/queries/use-me.ts";
import { useCreateMe } from "@/hooks/mutations/use-create-me.ts";
import GlobalLoader from "@/components/global-loader.tsx";
import { ErrorCode } from "@/lib/api-errors.ts";
import { ROUTES } from "@/lib/routes.ts";

/**
 * 인증된 사용자만 접근할 수 있는 라우트를 보호하는 가드 컴포넌트
 *
 * 처리 흐름:
 * 1. Supabase 세션이 없으면 → 로그인 페이지로 리다이렉트
 * 2. 세션은 있지만 백엔드 User가 없으면 → 자동으로 User 생성 (최초 로그인 시)
 * 3. 프로필이 미완성이면 → 프로필 완성 페이지로 리다이렉트
 * 4. 모든 조건 통과 시 → 자식 라우트 렌더링
 */
export default function AuthGuard() {
  const authSession = useAuthSession();
  const location = useLocation();
  const { data: user, isLoading, error: errorOfGettingMe } = useMe();
  const { mutate: createMe, isPending: isCreating } = useCreateMe();

  // User 생성 중복 호출 방지를 위한 ref
  const hasTriedCreateMe = useRef(false);

  // Supabase 인증은 완료했지만 백엔드 User가 없는 경우 자동 생성
  // useEffect로 감싸서 렌더링 중 상태 변경을 방지
  useEffect(() => {
    if (errorOfGettingMe?.code === ErrorCode.NOT_FOUND_USER && !hasTriedCreateMe.current) {
      hasTriedCreateMe.current = true;
      createMe();
    }
  }, [errorOfGettingMe, createMe]);

  // 1. 세션 없음 → 로그인 페이지
  if (!authSession) return <Navigate to={ROUTES.AUTH} replace />;

  // 2. 사용자 정보 로딩 중 또는 User 생성 중
  if (isLoading || isCreating) return <GlobalLoader />;

  // 3. User 생성 요청 대기 중 (에러 상태이지만 곧 생성될 예정)
  if (errorOfGettingMe?.code === ErrorCode.NOT_FOUND_USER) {
    return <GlobalLoader />;
  }

  // 4. 프로필 미완성 → 프로필 완성 페이지로 리다이렉트 (무한 루프 방지)
  if (user && !user.is_profile_complete && location.pathname !== ROUTES.PROFILE_COMPLETION) {
    return <Navigate to={ROUTES.PROFILE_COMPLETION} />;
  }

  return <Outlet />;
}
