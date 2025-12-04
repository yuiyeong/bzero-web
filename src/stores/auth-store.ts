import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";
import { type Session } from "@supabase/supabase-js";

/**
 * 인증 상태 인터페이스
 */
interface AuthState {
  /** Supabase 세션 로드 완료 여부 */
  isLoaded: boolean;
  /** Supabase 인증 세션 (null이면 비로그인 상태) */
  session: Session | null;
}

interface AuthActions {
  actions: {
    setSession: (session: Session | null) => void;
  };
}

const initialState: AuthState = {
  isLoaded: false,
  session: null,
};

/**
 * Zustand 기반 인증 상태 스토어
 *
 * Supabase 세션을 전역으로 관리하며, 앱 전체에서 인증 상태에 접근할 수 있도록 함
 * - isLoaded: 초기 세션 로드가 완료되었는지 확인 (로딩 상태 표시용)
 * - session: Supabase 세션 객체 (access_token, user 정보 포함)
 */
export const useAuthStore = create(
  devtools(
    combine(initialState, (set) => {
      const authActions: AuthActions = {
        actions: {
          setSession: (session: Session | null): void => {
            set({ isLoaded: true, session });
          },
        },
      };
      return authActions;
    }),
    {
      name: "authStore",
      enabled: import.meta.env.DEV,
    }
  )
);

/** 현재 Supabase 세션을 반환하는 훅 */
export const useAuthSession = () => {
  return useAuthStore((store) => store.session);
};

/** 세션 로드 완료 여부를 반환하는 훅 */
export const useAuthIsLoaded = () => {
  return useAuthStore((store) => store.isLoaded);
};

/** 세션을 설정하는 액션을 반환하는 훅 */
export const useSetAuthSession = () => {
  return useAuthStore((store) => store.actions.setSession);
};
