interface PaymentSummaryProps {
  currentPoints: number;
  ticketPrice: number;
  remainingPoints: number;
  hasEnoughPoints: boolean;
}

/**
 * 결제 정보 요약 컴포넌트
 *
 * 보유 포인트, 티켓 가격, 결제 후 잔액 표시
 */
export function PaymentSummary({ currentPoints, ticketPrice, remainingPoints, hasEnoughPoints }: PaymentSummaryProps) {
  return (
    <div className="border-border bg-b0-card-navy mb-6 rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-zinc-400">보유 포인트</span>
        <span className="text-sm font-medium text-zinc-200">{currentPoints}P</span>
      </div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-zinc-400">티켓 가격</span>
        <span className="text-sm font-medium text-red-400">-{ticketPrice}P</span>
      </div>
      <div className="border-border flex items-center justify-between border-t pt-3">
        <span className="text-sm text-zinc-400">결제 후 잔액</span>
        <span className={`text-base font-semibold ${hasEnoughPoints ? "text-b0-light-purple" : "text-red-400"}`}>
          {remainingPoints}P
        </span>
      </div>
    </div>
  );
}
