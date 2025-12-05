/**
 * B0 터미널 타이틀 컴포넌트
 *
 * "Departure Terminal" 헤딩과 안내 문구 표시
 */
export function TerminalTitle() {
  return (
    <div className="pt-16 pb-4 text-center">
      <h1 className="mb-1 text-sm tracking-[2px] text-zinc-400 uppercase">Departure Terminal</h1>
      <h2 className="text-[22px] font-semibold text-white">어디로 떠나볼까요?</h2>
    </div>
  );
}
