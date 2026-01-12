import { updateDiary } from "@/api/diary.ts";
import DiaryForm from "@/components/diary/diary-form.tsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { MOODS } from "@/constants/diary.ts";
import { useMyDiaries } from "@/hooks/queries/use-diaries";
import { trackEvent } from "@/lib/analytics.ts";
import type { B0ApiError } from "@/lib/api-errors.ts";
import { queryKeys } from "@/lib/query-client.ts";
import type { CreateDiaryRequest, Diary, UpdateDiaryRequest } from "@/types.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Loader2, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function MyDiariesPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useMyDiaries(false);
  const [editingDiary, setEditingDiary] = useState<Diary | null>(null);

  const diaries = data?.pages.flatMap((page) => page.items) ?? [];

  // 일기 수정 뮤테이션
  const { mutate: submitUpdate, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateDiaryRequest }) => updateDiary(id, body),
    onSuccess: () => {
      trackEvent("diary_update_success");
      toast.success("일기가 수정되었습니다.");
      queryClient.invalidateQueries({ queryKey: queryKeys.diaries.list });
      setEditingDiary(null);
    },
    onError: (error: B0ApiError) => {
      toast.error(error.message || "일기 수정 실패");
    },
  });

  const handleEditClick = (diary: Diary) => {
    setEditingDiary(diary);
  };

  const handleUpdate = (data: CreateDiaryRequest | UpdateDiaryRequest) => {
    if (!editingDiary) return;
    submitUpdate({
      id: editingDiary.diary_id,
      body: data,
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
                <div className="mb-2 flex items-start justify-between">
                  <div className="text-xs text-zinc-500">
                    {format(new Date(diary.created_at), "yyyy.MM.dd", { locale: ko })}
                  </div>
                  <button
                    onClick={() => handleEditClick(diary)}
                    className="rounded-full p-1 text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>

                {diary.title && <h3 className="mb-2 font-semibold text-white">{diary.title}</h3>}
                <p className="line-clamp-2 text-sm leading-relaxed text-zinc-300">{diary.content}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                  <span className="text-lg">{MOODS.find((m) => m.value === diary.mood)?.emoji}</span>
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

      {/* Edit Modal */}
      <Dialog open={!!editingDiary} onOpenChange={(open) => !open && setEditingDiary(null)}>
        <DialogContent className="border-white/10 bg-[#1a1b26] text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>일기 수정</DialogTitle>
          </DialogHeader>
          {editingDiary && (
            <DiaryForm
              initialData={{
                title: editingDiary.title,
                content: editingDiary.content,
                mood: editingDiary.mood,
              }}
              onSubmit={handleUpdate}
              isSubmitting={isUpdating}
              submitLabel="수정완료"
              onCancel={() => setEditingDiary(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
