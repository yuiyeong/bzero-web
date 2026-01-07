import { useEffect, useRef } from "react";
import { Outlet } from "react-router";
import { toast } from "sonner";
import { useClaimDailyLoginReward } from "@/hooks/mutations/use-claim-daily-login-reward.ts";
import type { DailyLoginReward } from "@/types.ts";

/**
 * 일일 로그인 보상을 자동으로 확인하고 지급하는 가드 컴포넌트
 *
 * AuthGuard 내부에 배치되어 인증된 사용자가 앱에 진입할 때
 * 자동으로 일일 보상을 확인하고, 새로운 보상이 있으면 토스트로 알림
 */
export default function DailyRewardGuard() {
  const hasClaimedRef = useRef(false);
  const { mutate: claimDailyLoginReward } = useClaimDailyLoginReward({
    onSuccess: (data: DailyLoginReward) => {
      if (data.claimed) {
        toast.success(`${data.amount}P 출석 보상을 받았어요!`);
      }
    },
  });

  useEffect(() => {
    if (!hasClaimedRef.current) {
      hasClaimedRef.current = true;
      claimDailyLoginReward();
    }
  }, [claimDailyLoginReward]);

  return <Outlet />;
}
