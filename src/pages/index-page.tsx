import { useNavigate } from "react-router";
import { ROUTES } from "@/lib/routes.ts";

export default function IndexPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold text-white">B0에 오신 것을 환영합니다</h1>
        <p className="text-zinc-400">지하 0층에서 출발하는 비행선 터미널</p>
      </div>
      <button
        onClick={() => navigate(ROUTES.TERMINAL)}
        className="bg-b0-purple hover:bg-b0-light-purple rounded-lg px-6 py-3 font-semibold text-white transition-colors"
      >
        🎈 터미널로 이동
      </button>
    </div>
  );
}
