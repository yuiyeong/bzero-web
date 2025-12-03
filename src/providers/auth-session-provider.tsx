import { type ReactNode, useEffect } from "react";
import { useAuthIsLoaded, useSetAuthSession } from "@/stores/auth-store.ts";
import supabase from "@/lib/supabase.ts";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import GlobalLoader from "@/components/global-loader.tsx";

/**
 * Supabase 인증 세션을 관리하는 Provider 컴포넌트
 *
 * 앱 최상단에서 Supabase 인증 상태 변화를 구독하고,
 * 세션 정보를 Zustand 스토어에 동기화함
 *
 * 초기 세션 로드가 완료될 때까지 로딩 화면을 표시
 */
export default function AuthSessionProvider({ children }: { children: ReactNode }) {
  const setAuthSession = useSetAuthSession();
  const isSessionLoaded = useAuthIsLoaded();

  // Supabase 인증 상태 변화 구독
  // 로그인, 로그아웃, 토큰 갱신 등의 이벤트 처리
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_: AuthChangeEvent, session: Session | null): void => {
      setAuthSession(session);
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      subscription?.unsubscribe();
    };
  }, [setAuthSession]);

  // 초기 세션 로드 완료 전까지 로딩 표시
  if (!isSessionLoaded) return <GlobalLoader />;

  return children;
}
