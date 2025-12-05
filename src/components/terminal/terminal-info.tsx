/**
 * B0 터미널 안내 메시지 컴포넌트
 *
 * 비행선 이용 안내 메시지 표시
 */
export function TerminalInfo() {
  return (
    <div className="border-b0-purple/30 bg-b0-purple/10 mb-4 flex items-start gap-3 rounded-xl border p-3">
      <div className="text-xl">🛫</div>
      <div className="text-[13px] leading-relaxed text-zinc-300">
        비행선을 타고 원하는 도시로 떠나보세요.
        <br />각 도시에서 새로운 여행자들을 만날 수 있어요.
      </div>
    </div>
  );
}
