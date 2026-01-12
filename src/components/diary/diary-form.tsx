import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MOODS } from "@/constants/diary";
import type { CreateDiaryRequest, UpdateDiaryRequest } from "@/types";
import { useEffect, useState } from "react";

interface DiaryFormProps {
  initialData?: {
    title: string;
    content: string;
    mood: string;
  };
  onSubmit: (data: CreateDiaryRequest | UpdateDiaryRequest) => void;
  isSubmitting: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}

export default function DiaryForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel = "저장",
  onCancel,
}: DiaryFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [mood, setMood] = useState(initialData?.mood || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [errors, setErrors] = useState<{ title?: string; mood?: string; content?: string }>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setMood(initialData.mood);
      setContent(initialData.content);
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: { title?: string; mood?: string; content?: string } = {};
    if (!title.trim()) newErrors.title = "제목을 입력해주세요";
    if (!mood) newErrors.mood = "기분을 선택해주세요";
    if (content.length < 10) newErrors.content = "10자 이상 작성해주세요";
    if (content.length > 500) newErrors.content = "500자 이내로 작성해주세요";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title,
      mood,
      content,
    });
  };

  return (
    <div className="flex flex-1 flex-col pb-6 text-white">
      {/* 날짜 표시 - 오늘 날짜 또는 수정 시에는 숨김? 일단 오늘 날짜 표시 */}
      {!initialData && (
        <p className="mb-6 text-base text-zinc-400">
          {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-6">
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
              className="min-h-[200px] flex-1 resize-none border-white/10 bg-white/5 text-base text-white placeholder:text-zinc-600 focus:border-white/30"
            />
            <div className="flex justify-between text-xs text-zinc-500">
              {errors.content && <span className="text-red-400">{errors.content}</span>}
              <span className="ml-auto">{content.length}/500자</span>
            </div>
          </div>
        </div>

        {/* 기분 선택 */}
        <div className="flex flex-col gap-2">
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

        {/* 버튼 영역 - 모달에서 사용 시 하단 고정 등 스타일 조정 필요할 수 있음 */}
        <div className="mt-auto flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="text-zinc-400 hover:bg-white/5 hover:text-white"
            >
              취소
            </Button>
          )}
          <Button type="submit" className="bg-indigo-500 font-bold hover:bg-indigo-600" disabled={isSubmitting}>
            {isSubmitting ? "저장 중..." : submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
