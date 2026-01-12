import { createDiary, getMyDiaries, updateDiary } from "@/api/diary.ts";
import img_bg_private_room from "@/assets/images/img_bg_private_room.webp";
import DiaryForm from "@/components/diary/diary-form.tsx";
import GlobalLoader from "@/components/global-loader.tsx";
import { Button } from "@/components/ui/button.tsx";
import { MOODS } from "@/constants/diary.ts";
import { useCurrentRoomStay } from "@/hooks/queries/use-current-room-stay.ts";
import { trackEvent } from "@/lib/analytics.ts";
import type { B0ApiError } from "@/lib/api-errors.ts";
import { queryKeys } from "@/lib/query-client.ts";
import type { CreateDiaryRequest, UpdateDiaryRequest } from "@/types.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function DiaryPage() {
  const queryClient = useQueryClient();
  const [isWriteMode, setIsWriteMode] = useState(false);

  // 현재 체류 정보 조회 (city_id 획득용)
  const { data: _roomStay, isLoading: isRoomStayLoading } = useCurrentRoomStay();

  // 오늘 작성한 일기 조회
  const { data: diaryList, isLoading } = useQuery({
    queryKey: queryKeys.diaries.list,
    queryFn: () => getMyDiaries({ offset: 0, limit: 1, current_stay_only: true }),
  });

  const todayDiary = diaryList?.items[0];

  // 일기 작성/수정 뮤테이션
  const { mutate: submitDiary, isPending: isSubmitting } = useMutation({
    mutationFn: (data: CreateDiaryRequest | UpdateDiaryRequest) => {
      if (todayDiary) {
        return updateDiary(todayDiary.diary_id, data);
      }
      return createDiary(data as CreateDiaryRequest);
    },
    onSuccess: () => {
      if (todayDiary) {
        trackEvent("diary_update_success");
        toast.success("일기가 수정되었습니다.");
      } else {
        trackEvent("diary_save_success");
        toast.success("일기가 저장되었습니다. +5 포인트 획득!");
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.diaries.list });
      setIsWriteMode(false);
    },
    onError: (error: B0ApiError) => {
      toast.error(error.message || "일기 저장 실패");
    },
  });

  if (isLoading || isRoomStayLoading) return <GlobalLoader />;

  return (
    <div className="relative flex h-full w-full flex-col">
      <img className="absolute inset-0 h-full w-full object-cover" src={img_bg_private_room} alt="배경" />
      <div className="absolute inset-0 bg-black/60" />

      {/* 헤더 */}
      <div className="relative z-10 flex h-14 items-center justify-between px-4">
        <div />
        {/* 오늘 일기가 있고, 쓰기 모드가 아닐 때 '수정' 버튼 표시 */}
        {todayDiary && !isWriteMode ? (
          <Button
            variant="ghost"
            className="font-bold text-zinc-400 hover:text-white"
            onClick={() => setIsWriteMode(true)}
          >
            수정
          </Button>
        ) : (
          <div />
        )}
      </div>

      <div className="relative z-10 flex flex-1 flex-col overflow-y-auto px-6 pb-6 text-white">
        {todayDiary && !isWriteMode ? (
          <div className="glass flex flex-1 flex-col rounded-2xl p-6">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-4xl">{MOODS.find((m) => m.value === todayDiary.mood)?.emoji || todayDiary.mood}</div>
              <div className="text-lg font-bold text-white">{todayDiary.title}</div>
            </div>
            <p className="text-lg leading-relaxed whitespace-pre-wrap text-zinc-100">{todayDiary.content}</p>
            <div className="mt-auto pt-4 text-right text-sm text-zinc-400">
              {new Date(todayDiary.created_at).toLocaleString()}
            </div>
          </div>
        ) : (
          // 작성 또는 수정 모드
          <DiaryForm
            initialData={
              todayDiary
                ? {
                  title: todayDiary.title,
                  content: todayDiary.content,
                  mood: todayDiary.mood,
                }
                : undefined
            }
            onSubmit={submitDiary}
            isSubmitting={isSubmitting}
            // 수정 모드일 때 취소 버튼 활성화
            onCancel={todayDiary ? () => setIsWriteMode(false) : undefined}
            submitLabel={todayDiary ? "수정완료" : "저장"}
          />
        )}
      </div>
    </div>
  );
}
