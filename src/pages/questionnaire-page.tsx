import {
  createQuestionnaire,
  getCityQuestions,
  getMyQuestionnaires,
  updateQuestionnaire,
} from "@/api/questionnaire.ts";
import img_bg_private_room from "@/assets/images/img_bg_private_room.webp";
import GlobalLoader from "@/components/global-loader.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useCurrentRoomStay } from "@/hooks/queries/use-current-room-stay.ts";
import { trackEvent } from "@/lib/analytics.ts";
import type { B0ApiError } from "@/lib/api-errors.ts";
import { queryKeys } from "@/lib/query-client.ts";
import { buildPath } from "@/lib/routes.ts";
import type { CreateQuestionnaireRequest, UpdateQuestionnaireRequest } from "@/types.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

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
    queryFn: () => getMyQuestionnaires({ offset: 0, limit: 100, current_stay_only: true }),
    enabled: !!cityId,
  });

  // 답변 제출 뮤테이션
  const { mutate: submitAnswer, isPending: isSubmitting } = useMutation({
    mutationFn: ({
      questionnaireId,
      body,
    }: {
      questionnaireId?: string;
      body: CreateQuestionnaireRequest | UpdateQuestionnaireRequest;
    }) => {
      if (questionnaireId) {
        return updateQuestionnaire(questionnaireId, body as UpdateQuestionnaireRequest);
      }
      return createQuestionnaire(body as CreateQuestionnaireRequest);
    },
    onSuccess: (_, variables) => {
      if (variables.questionnaireId) {
        trackEvent("questionnaire_update_success");
        toast.success("답변이 수정되었습니다.");
        setIsEditMode(false);
      } else {
        trackEvent("questionnaire_answer_success");
        toast.success("답변이 저장되었습니다. +5 포인트!");
        handleNext();
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.questionnaires.list });
    },
    onError: (error: B0ApiError) => {
      toast.error(error.message || "답변 저장 실패");
    },
  });

  // Wizard State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const isLoading = isRoomStayLoading || isQuestionsLoading || isAnswersLoading;

  // 이미 답변한 질문인지 확인 (현재 질문)
  const currentQuestion = questions?.[currentStepIndex];
  const existingAnswer = myAnswers?.list.find((a) => a.city_question_id === currentQuestion?.city_question_id);
  const isAnswered = !!existingAnswer;

  // 다음 단계로 이동
  const handleNext = () => {
    setAnswerText(""); // 입력창 초기화
    setIsEditMode(false);
    if (questions && currentStepIndex < questions.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      toast.info("모든 질문에 답변하셨습니다!");
      handleBackClick();
    }
  };

  const handleSubmit = () => {
    if (!cityId || !currentQuestion) return;
    if (!answerText.trim()) return;

    // 수정 모드이거나 이미 답변이 있는 경우 (수정 로직)
    if (isEditMode && existingAnswer) {
      submitAnswer({
        questionnaireId: existingAnswer.questionnaire_id,
        body: { answer: answerText },
      });
    } else {
      // 신규 작성
      submitAnswer({
        body: {
          city_question_id: currentQuestion.city_question_id,
          answer: answerText,
        },
      });
    }
  };

  const handleBackClick = () => {
    if (!guesthouseId) return;
    navigate(buildPath.privateRoom(guesthouseId));
  };

  // 질문 변경 시 상태 초기화 및 기존 답변 로드
  useEffect(() => {
    if (existingAnswer) {
      // 이미 답변한 경우, 수정 모드가 아니면 텍스트를 비워둠 (초기화)
      // 하지만 수정 버튼을 누르면 그때 setAnswerText를 함
      // 여기서는 그냥 isEditMode가 false가 되도록
      setIsEditMode(false);
    } else {
      // 답변이 없는 경우 텍스트 초기화
      setAnswerText("");
      setIsEditMode(false);
    }
  }, [currentStepIndex, existingAnswer]);

  // 수정 모드 진입 핸들러
  const handleEditClick = () => {
    if (existingAnswer) {
      setAnswerText(existingAnswer.answer);
      setIsEditMode(true);
    }
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
        // 모두 답변함 -> 마지막 질문으로
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
        <div />
        <div className="font-bold text-white">세렌시아 문답지</div>
        <div className="flex items-center gap-3">
          {isAnswered && !isEditMode && (
            <Button
              variant="ghost"
              className="h-auto p-0 font-bold text-zinc-400 hover:text-white"
              onClick={handleEditClick}
            >
              수정
            </Button>
          )}
          <div className="text-sm text-zinc-400">
            {currentStepIndex + 1}/{questions.length}
          </div>
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
        {isAnswered && !isEditMode ? (
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
          {/* 수정 모드일 때는 취소 버튼 표시 */}
          {isEditMode ? (
            <Button
              variant="ghost"
              className="flex-1 border border-white/10 text-zinc-300 hover:text-white"
              onClick={() => setIsEditMode(false)}
            >
              취소
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="flex-1 border border-white/10 text-zinc-300 hover:text-white"
              disabled={currentStepIndex === 0}
              onClick={() => setCurrentStepIndex((prev) => prev - 1)}
            >
              이전
            </Button>
          )}

          {isAnswered && !isEditMode ? (
            <Button
              className="flex-1 bg-indigo-500 hover:bg-indigo-600"
              onClick={() => {
                if (currentStepIndex < questions.length - 1) {
                  setCurrentStepIndex((prev) => prev + 1);
                  setAnswerText("");
                } else {
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
              {isSubmitting ? "저장 중..." : isEditMode ? "수정완료" : "다음"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
