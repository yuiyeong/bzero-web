import { createQuestionnaire, getCityQuestions, getMyQuestionnaires } from "@/api/questionnaire.ts";
import img_bg_private_room from "@/assets/images/img_bg_private_room.webp";
import GlobalLoader from "@/components/global-loader.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useCurrentRoomStay } from "@/hooks/queries/use-current-room-stay.ts";
import type { B0ApiError } from "@/lib/api-errors.ts";
import { buildPath } from "@/lib/routes.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-client.ts";

export default function QuestionnairePage() {
  const navigate = useNavigate();
  const { guesthouseId } = useParams<{ guesthouseId: string }>();
  const queryClient = useQueryClient();

  // 1. 체류 정보 조회 (City ID 필요)
  const { data: roomStay, isLoading: isRoomStayLoading } = useCurrentRoomStay();

  const cityId = roomStay?.city_id;

  // 2. 질문 목록 조회 (Display Order 순)
  const { data: questions, isLoading: isQuestionsLoading } = useQuery({
    queryKey: queryKeys.questionnaires.cityQuestions(cityId || ""),
    queryFn: () => getCityQuestions(cityId!),
    enabled: !!cityId,
  });

  // 3. 내 답변 내역 조회 (중복 답변 방지 및 진행률 확인)
  const { data: myAnswers, isLoading: isAnswersLoading } = useQuery({
    queryKey: queryKeys.questionnaires.list,
    queryFn: () => getMyQuestionnaires({ page: 1, size: 100 }),
    enabled: !!cityId,
  });

  // 답변 제출 뮤테이션
  const { mutate: submitAnswer, isPending: isSubmitting } = useMutation({
    mutationFn: createQuestionnaire,
    onSuccess: () => {
      toast.success("답변이 저장되었습니다. +5 포인트!");
      queryClient.invalidateQueries({ queryKey: queryKeys.questionnaires.list });
      handleNext();
    },
    onError: (error: B0ApiError) => {
      toast.error(error.message || "답변 저장 실패");
    },
  });

  // Wizard State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");

  const isLoading = isRoomStayLoading || isQuestionsLoading || isAnswersLoading;

  // 이미 답변한 질문인지 확인 (현재 질문)
  const currentQuestion = questions?.[currentStepIndex];
  const existingAnswer = myAnswers?.list.find((a) => a.city_question_id === currentQuestion?.city_question_id);
  const isAnswered = !!existingAnswer;

  // 다음 단계로 이동
  const handleNext = () => {
    setAnswerText(""); // 입력창 초기화
    if (questions && currentStepIndex < questions.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      toast.info("모든 질문에 답변하셨습니다!");
      // TODO: 완료 페이지 또는 목록으로 이동
    }
  };

  const handleSubmit = () => {
    if (!cityId || !currentQuestion) return;
    if (!answerText.trim()) return;

    submitAnswer({
      city_question_id: currentQuestion.city_question_id,
      answer: answerText,
    });
  };

  const handleBackClick = () => {
    if (!guesthouseId) return;
    navigate(buildPath.privateRoom(guesthouseId));
  };

  // 초기 로딩 시, 아직 답변 안 한 첫 번째 질문으로 이동
  useEffect(() => {
    if (questions && myAnswers) {
      const firstUnansweredIndex = questions.findIndex(
        (q) => !myAnswers.list.find((a) => a.city_question_id === q.city_question_id)
      );
      if (firstUnansweredIndex > 0) {
        setCurrentStepIndex(firstUnansweredIndex);
      } else if (firstUnansweredIndex === -1 && questions.length > 0) {
        // 모두 답변함 -> 마지막 질문 또는 완료 화면?
        setCurrentStepIndex(questions.length - 1);
      }
    }
  }, [questions, myAnswers]);

  if (isLoading) return <GlobalLoader />;
  if (!questions || questions.length === 0) return <div className="text-white">질문이 없습니다.</div>;

  return (
    <div className="relative flex h-full w-full flex-col">
      <img className="absolute inset-0 h-full w-full object-cover" src={img_bg_private_room} alt="배경" />
      <div className="absolute inset-0 bg-black/60" />

      {/* 헤더 */}
      <div className="relative z-10 flex h-14 items-center justify-between px-4">
        <Button variant="ghost" className="text-white hover:bg-white/10" onClick={handleBackClick}>
          ←
        </Button>
        <div className="font-bold text-white">세렌시아 문답지</div>
        <div className="text-sm text-zinc-400">
          {currentStepIndex + 1}/{questions.length}
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-6 pb-24 text-white">
        {/* 질문 카드 (중앙 문구) */}
        <div className="flex flex-col items-center justify-center py-10">
          <h2 className="text-center text-2xl leading-relaxed font-bold whitespace-pre-line">
            {currentQuestion?.question}
          </h2>
        </div>

        {/* 답변 영역 */}
        {isAnswered ? (
          <div className="glass flex-1 rounded-2xl p-6">
            <p className="text-lg leading-relaxed whitespace-pre-wrap text-zinc-300">{existingAnswer.answer}</p>
            <div className="mt-4 text-right text-xs text-zinc-500">
              작성일: {new Date(existingAnswer.created_at).toLocaleDateString()}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-2">
            <Textarea
              placeholder="답변을 입력해주세요"
              className="flex-1 resize-none border-white/10 bg-white/5 text-lg text-white placeholder:text-zinc-500 focus:border-white/30"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
            />
            <div className="text-right text-xs text-zinc-500">{answerText.length}/200자</div>
          </div>
        )}
      </div>

      {/* 하단 고정 버튼 영역 */}
      <div className="absolute right-0 bottom-0 left-0 z-20 border-t border-white/10 bg-black/80 px-6 py-4 backdrop-blur-md">
        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="flex-1 border border-white/10 text-zinc-300 hover:text-white"
            disabled={currentStepIndex === 0}
            onClick={() => setCurrentStepIndex((prev) => prev - 1)}
          >
            이전
          </Button>
          {isAnswered ? (
            <Button
              className="flex-1 bg-indigo-500 hover:bg-indigo-600"
              onClick={() => {
                if (currentStepIndex < questions.length - 1) {
                  setCurrentStepIndex((prev) => prev + 1);
                  setAnswerText("");
                } else {
                  // 마지막이고 이미 답변했으면 그냥 돌아가기 or 완료 처리
                  handleBackClick();
                }
              }}
            >
              {currentStepIndex === questions.length - 1 ? "완료" : "다음"}
            </Button>
          ) : (
            <Button
              className="flex-1 bg-indigo-500 hover:bg-indigo-600"
              onClick={handleSubmit}
              disabled={isSubmitting || !answerText.trim()}
            >
              {isSubmitting ? "저장 중..." : currentStepIndex === questions.length - 1 ? "완료" : "다음"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
