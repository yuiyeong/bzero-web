import { cn } from "@/lib/utils.ts";

interface PurchaseButtonProps {
  hasEnoughPoints: boolean;
  isPending?: boolean;
  onPurchase: () => void;
  /** 포인트 부족 시 호출되는 콜백 (모달 열기 용도) */
  onInsufficientPoints?: () => void;
}

/**
 * 비행선 구매 버튼 컴포넌트
 *
 * 포인트 부족 시 클릭하면 모달을 열고, 충분하면 구매 진행
 */
export function PurchaseButton({
  hasEnoughPoints,
  isPending = false,
  onPurchase,
  onInsufficientPoints,
}: PurchaseButtonProps) {
  const handleClick = () => {
    if (!hasEnoughPoints) {
      onInsufficientPoints?.();
      return;
    }
    onPurchase();
  };

  return (
    <div className="mt-auto">
      <button
        disabled={isPending}
        onClick={handleClick}
        className={cn(
          "w-full rounded-lg py-4 text-base font-semibold transition-colors",
          !hasEnoughPoints
            ? "border border-red-500/30 bg-red-500/20 text-red-300"
            : isPending
              ? "cursor-not-allowed bg-zinc-700 text-zinc-400"
              : "bg-b0-purple hover:bg-b0-light-purple text-white"
        )}
      >
        {isPending ? "처리 중..." : !hasEnoughPoints ? "포인트 부족" : "비행선 탑승하기"}
      </button>
    </div>
  );
}
