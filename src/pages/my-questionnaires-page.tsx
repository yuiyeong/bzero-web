import { useMyQuestionnaires } from "@/hooks/queries/use-questionnaires";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Loader2 } from "lucide-react";

export default function MyQuestionnairesPage() {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useMyQuestionnaires(false);

  const questionnaires = data?.pages.flatMap((page) => page.list) ?? [];

  return (
    <div className="bg-b0-deep-navy flex h-full flex-col pt-4 text-white">
      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          </div>
        ) : questionnaires.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 text-7xl">📋</div>
            <p className="mb-2 text-base text-zinc-400">아직 작성한 문답지가 없어요</p>
            <p className="text-sm text-zinc-600">
              여행 중 개인 숙소에서
              <br />
              문답지를 작성해보세요
            </p>
          </div>
        ) : (
          // Questionnaire List
          <div className="space-y-4">
            <p className="mb-4 text-center text-sm text-zinc-500">📋 내가 작성한 문답지들</p>

            {questionnaires.map((q) => (
              <div key={q.questionnaire_id} className="bg-b0-card-navy/80 rounded-xl border border-white/5 p-4">
                <div className="mb-2 text-xs text-zinc-500">
                  {format(new Date(q.created_at), "yyyy.MM.dd", { locale: ko })}
                </div>
                <div className="mb-3 rounded-lg bg-black/30 p-3">
                  <p className="text-sm font-medium text-white/90">"{q.city_question}"</p>
                </div>
                <p className="line-clamp-2 text-sm leading-relaxed text-zinc-300">{q.answer}</p>
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
