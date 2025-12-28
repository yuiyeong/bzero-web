import { createDiary, getMyDiaries } from "@/api/diary.ts";
import { useCurrentRoomStay } from "@/hooks/queries/use-current-room-stay.ts";
import img_bg_private_room from "@/assets/images/img_bg_private_room.webp";
import GlobalLoader from "@/components/global-loader.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { buildPath } from "@/lib/routes.ts";
import type { B0ApiError } from "@/lib/api-errors.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-client.ts";

const MOODS = [
  { emoji: "😊", value: "happy", label: "행복" },
  { emoji: "😐", value: "peaceful", label: "평온" },
  { emoji: "😢", value: "sad", label: "슬픔" },
  { emoji: "😡", value: "anxious", label: "불안" }, // anxious로 매핑 (화남->불안/걱정 유사 맥락으로 처리하거나 API 스펙 확인 필요, 일단 anxious)
  { emoji: "😴", value: "tired", label: "피곤" },
];

export default function DiaryPage() {
  const navigate = useNavigate();
  const { guesthouseId } = useParams<{ guesthouseId: string }>();
  const queryClient = useQueryClient();
  const [isWriteMode, setIsWriteMode] = useState(false);

  // 현재 체류 정보 조회 (city_id 획득용)
  const { data: _roomStay, isLoading: isRoomStayLoading } = useCurrentRoomStay();

  // 오늘 작성한 일기 조회
  const { data: diaryList, isLoading } = useQuery({
    queryKey: queryKeys.diaries.list,
    queryFn: () => getMyDiaries({ page: 1, size: 1 }),
  });

  const todayDiary = diaryList?.items[0];

  // 일기 작성 뮤테이션
  const { mutate: submitDiary, isPending: isSubmitting } = useMutation({
    mutationFn: createDiary,
    onSuccess: () => {
      toast.success("일기가 저장되었습니다. +5 포인트 획득!");
      queryClient.invalidateQueries({ queryKey: queryKeys.diaries.list });
      setIsWriteMode(false);
    },
    onError: (error: B0ApiError) => {
      toast.error(error.message || "일기 저장 실패");
    },
  });

  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<{ title?: string; mood?: string; content?: string }>({});

  const validate = () => {
    const newErrors: { title?: string; mood?: string; content?: string } = {};
    if (!title.trim()) newErrors.title = "제목을 입력해주세요";
    if (!mood) newErrors.mood = "기분을 선택해주세요";
    if (content.length < 10) newErrors.content = "10자 이상 작성해주세요";
    if (content.length > 500) newErrors.content = "500자 이내로 작성해주세요";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (!guesthouseId) return;

    submitDiary({
      title,
      mood,
      content,
    });
  };

  // RoomStay 조회 추가
  // (실제 코드에서는 상위에서 props로 받거나 여기서 조회)
  // ...

  const handleBackClick = () => {
    if (!guesthouseId) return;
    navigate(buildPath.privateRoom(guesthouseId));
  };

  if (isLoading || isRoomStayLoading) return <GlobalLoader />;

  return (
    <div className="relative flex h-full w-full flex-col">
      <img className="absolute inset-0 h-full w-full object-cover" src={img_bg_private_room} alt="배경" />
      <div className="absolute inset-0 bg-black/60" />

      {/* 헤더 */}
      <div className="relative z-10 flex h-14 items-center justify-between px-4">
        <Button variant="ghost" className="text-white hover:bg-white/10" onClick={handleBackClick}>
          ←
        </Button>
        {/* 작성 모드일 때만 저장 버튼 표시 */}
        {!todayDiary || isWriteMode ? (
          <Button
            variant="ghost"
            className="font-bold text-indigo-400 hover:text-indigo-300"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "저장 중..." : "저장"}
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
          <div className="flex flex-1 flex-col">
            {/* 날짜 표시 */}
            <p className="mb-6 text-base text-zinc-400">
              {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
            </p>

            <div className="flex flex-1 flex-col gap-6">
              {/* 제목 입력 */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-400">제목</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="오늘의 제목"
                  className="w-full border-b border-white/10 bg-transparent py-2 text-xl font-bold text-white placeholder:text-zinc-600 focus:border-white/50 focus:outline-none"
                />
                {errors.title && <p className="text-xs text-red-400">{errors.title}</p>}
              </div>

              {/* 내용 작성 */}
              <div className="flex flex-1 flex-col gap-2">
                <label className="text-sm font-medium text-zinc-400">오늘의 기록</label>
                <div className="flex flex-1 flex-col gap-1">
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="오늘 하루는 어떠셨나요?"
                    className="flex-1 resize-none border-white/10 bg-white/5 text-base text-white placeholder:text-zinc-600 focus:border-white/30"
                  />
                  <div className="flex justify-between text-xs text-zinc-500">
                    {errors.content && <span className="text-red-400">{errors.content}</span>}
                    <span className="ml-auto">{content.length}/500자</span>
                  </div>
                </div>
              </div>

              {/* 기분 선택 */}
              <div className="flex flex-col gap-2 pb-6">
                <label className="text-sm font-medium text-zinc-400">오늘의 기분</label>
                <div className="flex justify-between gap-1">
                  {MOODS.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setMood(m.value)}
                      className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl transition-all ${
                        mood === m.value
                          ? "scale-110 bg-white/20 ring-2 ring-indigo-400"
                          : "bg-white/5 grayscale filter hover:bg-white/10 hover:grayscale-0"
                      }`}
                      title={m.label}
                    >
                      {m.emoji}
                    </button>
                  ))}
                </div>
                {errors.mood && <p className="text-xs text-red-400">{errors.mood}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
