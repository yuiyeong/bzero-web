import { updateQuestionnaire } from "@/api/questionnaire.ts";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useMyQuestionnaires } from "@/hooks/queries/use-questionnaires";
import { trackEvent } from "@/lib/analytics.ts";
import type { B0ApiError } from "@/lib/api-errors.ts";
import { queryKeys } from "@/lib/query-client.ts";
import type { Questionnaire, UpdateQuestionnaireRequest } from "@/types.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Loader2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function MyQuestionnairesPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useMyQuestionnaires(false);
  const [editingQuestionnaire, setEditingQuestionnaire] = useState<Questionnaire | null>(null);
  const [answer, setAnswer] = useState("");

  const questionnaires = data?.pages.flatMap((page) => page.list) ?? [];

  useEffect(() => {
    if (editingQuestionnaire) {
      setAnswer(editingQuestionnaire.answer);
    }
  }, [editingQuestionnaire]);

  // 문답 수정 뮤테이션
  const { mutate: submitUpdate, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateQuestionnaireRequest }) => updateQuestionnaire(id, body),
    onSuccess: () => {
      trackEvent("questionnaire_update_success");
      toast.success("답변이 수정되었습니다.");
      queryClient.invalidateQueries({ queryKey: queryKeys.questionnaires.list });
      setEditingQuestionnaire(null);
    },
    onError: (error: B0ApiError) => {
      toast.error(error.message || "답변 수정 실패");
    },
  });

  const handleUpdate = () => {
    if (!editingQuestionnaire) return;
    if (!answer.trim()) return;

    submitUpdate({
      id: editingQuestionnaire.questionnaire_id,
      body: { answer },
    });
  };

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
                <div className="mb-2 flex items-start justify-between">
                  <div className="text-xs text-zinc-500">
                    {format(new Date(q.created_at), "yyyy.MM.dd", { locale: ko })}
                  </div>
                  <button
                    onClick={() => setEditingQuestionnaire(q)}
                    className="rounded-full p-1 text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
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

      {/* Edit Modal */}
      <Dialog open={!!editingQuestionnaire} onOpenChange={(open) => !open && setEditingQuestionnaire(null)}>
        <DialogContent className="border-white/10 bg-[#1a1b26] text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>답변 수정</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="rounded-lg bg-black/30 p-3">
              <p className="text-sm font-medium text-white/90">"{editingQuestionnaire?.city_question}"</p>
            </div>
            <div className="flex flex-col gap-1">
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="답변을 입력해주세요"
                className="min-h-[150px] resize-none border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus:border-white/30"
              />
              <div className="text-right text-xs text-zinc-500">{answer.length}/200자</div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setEditingQuestionnaire(null)}
              className="text-zinc-400 hover:bg-white/5 hover:text-white"
            >
              취소
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isUpdating || !answer.trim()}
              className="bg-indigo-500 font-bold hover:bg-indigo-600"
            >
              {isUpdating ? "수정 중..." : "수정완료"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
