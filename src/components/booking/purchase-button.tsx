import { cn } from "@/lib/utils.ts";

interface PurchaseButtonProps {
  hasEnoughPoints: boolean;
  isPending?: boolean;
  onPurchase: () => void;
}

/**
 * 비행선 구매 버튼 컴포넌트
 *
 * 포인트 부족 또는 요청 중일 때 비활성화
 */
export function PurchaseButton({ hasEnoughPoints, isPending = false, onPurchase }: PurchaseButtonProps) {
  const isDisabled = !hasEnoughPoints || isPending;

  return (
    <div className="mt-auto">
      {!hasEnoughPoints && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          포인트가 부족합니다. 일기를 쓰거나 대화에 참여해보세요.
        </div>
      )}
      <button
        disabled={isDisabled}
        onClick={onPurchase}
        className={cn(
          "w-full rounded-lg py-4 text-base font-semibold transition-colors",
          isDisabled
            ? "cursor-not-allowed bg-zinc-700 text-zinc-400"
            : "bg-b0-purple hover:bg-b0-light-purple text-white"
        )}
      >
        {isPending ? "처리 중..." : "🎫 비행선 탑승하기"}
      </button>
    </div>
  );
}
