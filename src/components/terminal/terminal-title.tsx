/**
 * B0 터미널 타이틀 컴포넌트
 *
 * "Departure Terminal" 헤딩과 안내 문구 표시
 */
export function TerminalTitle() {
  return (
    <div className="relative z-[1] px-4 pt-[100px] pb-4 text-center">
      <h1 className="mb-1 text-[14px] font-normal tracking-[2px] text-zinc-500 uppercase">Departure Terminal</h1>
      <h2 className="text-[22px] font-semibold text-white">어디로 떠나볼까요?</h2>
    </div>
  );
}
