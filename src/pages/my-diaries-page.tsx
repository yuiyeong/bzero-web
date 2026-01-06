import { useMyDiaries } from "@/hooks/queries/use-diaries";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Loader2 } from "lucide-react";

export default function MyDiariesPage() {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useMyDiaries(false);

  const diaries = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="bg-b0-deep-navy flex h-full flex-col pt-4 text-white">
      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          </div>
        ) : diaries.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 text-7xl">📝</div>
            <p className="mb-2 text-base text-zinc-400">아직 작성한 일기가 없어요</p>
            <p className="text-sm text-zinc-600">
              여행 중 개인 숙소에서
              <br />
              일기를 작성해보세요
            </p>
          </div>
        ) : (
          // Diary List
          <div className="space-y-4">
            <p className="mb-4 text-center text-sm text-zinc-500">📝 내가 작성한 일기들</p>

            {diaries.map((diary) => (
              <div key={diary.diary_id} className="bg-b0-card-navy/80 rounded-xl border border-white/5 p-4">
                <div className="mb-1 text-xs text-zinc-500">
                  {format(new Date(diary.created_at), "yyyy.MM.dd", { locale: ko })}
                </div>
                {diary.title && <h3 className="mb-2 font-semibold text-white">{diary.title}</h3>}
                <p className="line-clamp-2 text-sm leading-relaxed text-zinc-300">{diary.content}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                  <span className="text-b0-light-purple">{diary.mood}</span>
                </div>
              </div>
            ))}

            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="w-full py-4 text-sm text-zinc-400 hover:text-white disabled:opacity-50"
              >
                {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
