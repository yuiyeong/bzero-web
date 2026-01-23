import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signOut } from "@/api/auth";
import { useNavigate } from "react-router";
import { ROUTES } from "@/lib/routes";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

/**
 * 로그아웃 mutation 훅
 *
 * 성공 시:
 * 1. Supabase 세션 종료
 * 2. 캐시 데이터 초기화 (queryClient.clear)
 * 3. 로그인 페이지로 리다이렉트
 */
export function useSignOut() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      // 1. 이벤트 트래킹
      trackEvent("user_sign_out");

      // 2. 모든 캐시 데이터 초기화 (보안 강화)
      queryClient.clear();

      // 3. 사용자 피드백
      toast.success("로그아웃되었습니다.");

      // 4. 페이지 이동 (뒤로가기 방지)
      navigate(ROUTES.AUTH, { replace: true });
    },
    onError: (error: Error) => {
      console.error("Sign out error:", error);
      toast.error("로그아웃에 실패했습니다. 다시 시도해주세요.");
    },
  });
}
