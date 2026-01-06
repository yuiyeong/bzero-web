import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics.ts";

interface InsufficientPointsModalProps {
  /** 모달 열림 상태 */
  open: boolean;
  /** 모달 닫기 콜백 */
  onOpenChange: (open: boolean) => void;
  /** 현재 사용자 보유 포인트 */
  currentBalance: number;
  /** 모달이 호출된 컨텍스트 (GA 이벤트용) */
  source: "ticket_booking" | "extend_stay";
}

/**
 * 포인트 부족 시 표시되는 모달 컴포넌트
 *
 * - 현재 보유 포인트 표시
 * - 포인트 획득 방법 안내
 * - '포인트 무료 충전 요청' 버튼 (Fake Door Test)
 */
export function InsufficientPointsModal({ open, onOpenChange, currentBalance, source }: InsufficientPointsModalProps) {
  const handleRequestFreeCharge = () => {
    // GA4 이벤트 전송
    trackEvent("demand_verification_click", {
      feature_name: "free_point_charge",
      current_balance: currentBalance,
      source,
    });

    // Toast 메시지 표시
    toast.info("포인트 무료 충전 기능을 준비 중입니다. 조금만 기다려주세요!");

    // 모달 닫기
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-b0-deep-navy border-zinc-800 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">포인트가 부족해요</DialogTitle>
          <DialogDescription className="text-zinc-400">
            일기를 쓰거나 대화에 참여하면 포인트를 얻을 수 있어요.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* 현재 포인트 표시 */}
          <div className="mb-4 rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">현재 보유 포인트</span>
              <span className="text-lg font-bold text-white">{currentBalance}P</span>
            </div>
          </div>

          {/* 포인트 획득 방법 안내 */}
          <div className="space-y-2 text-sm text-zinc-400">
            <p>일기 작성: 50P</p>
            <p>문답지 작성: 50P</p>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-3 sm:flex-col">
          {/* 포인트 무료 충전 요청 버튼 (Fake Door) */}
          <Button onClick={handleRequestFreeCharge} className="bg-b0-purple hover:bg-b0-light-purple w-full">
            포인트 무료 충전 요청
          </Button>

          {/* 닫기 버튼 */}
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full border-zinc-700">
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
