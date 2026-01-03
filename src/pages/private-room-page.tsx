import img_bg_private_room from "@/assets/images/img_bg_private_room.webp";
import { Button } from "@/components/ui/button.tsx";
import { ROUTES, buildPath } from "@/lib/routes.ts";
import { useNavigate, useParams } from "react-router";
import { useCurrentRoomStay } from "@/hooks/queries/use-current-room-stay.ts";
import { checkoutCurrentStay } from "@/api/room-stays.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client.ts";
import type { B0ApiError } from "@/lib/api-errors";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx";
import { useCallback, useEffect, useState } from "react";
import ExtendStayModal from "@/components/ExtendStayModal";

export default function PrivateRoomPage() {
  const navigate = useNavigate();
  const { guesthouseId } = useParams<{ guesthouseId: string }>();
  const queryClient = useQueryClient();
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);

  // 현재 체류 정보 조회
  const { data: roomStay, isLoading } = useCurrentRoomStay();

  // 체크아웃 뮤테이션
  const {
    mutate: checkout,
    isPending: isCheckingOut,
    isSuccess: isCheckoutSuccess,
  } = useMutation({
    mutationFn: checkoutCurrentStay,
    onSuccess: () => {
      toast.success("체크아웃 되었습니다.");
      // 성공 상태(isCheckoutSuccess)로 useEffect 리다이렉트가 차단되므로,
      // 안전하게 캐시를 초기화하고 터미널로 이동합니다.
      queryClient.setQueryData(queryKeys.roomStays.current, null);
      navigate(ROUTES.TERMINAL, { replace: true });
    },
    onError: (error: B0ApiError) => {
      toast.error(error.message || "체크아웃 실패");
    },
  });

  const handleDiaryClick = () => {
    if (!guesthouseId) return;
    navigate(buildPath.diary(guesthouseId));
  };

  const handleQuestionnaireClick = () => {
    if (!guesthouseId) return;
    navigate(buildPath.questionnaire(guesthouseId));
  };

  const handleBackClick = useCallback(() => {
    if (!guesthouseId) return;
    navigate(buildPath.guesthouse(guesthouseId));
  }, [guesthouseId, navigate]);

  const handleCheckout = () => {
    checkout();
  };

  // 실시간 현재 시간 (1초마다 갱신)
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ... (중략) ...

  // 자동 리다이렉트 및 만료 감지
  useEffect(() => {
    // 로딩 중이거나, 수동 체크아웃이 진행 중이거나 성공했을 때는 자동 리다이렉트 하지 않음
    if (isLoading || isCheckingOut || isCheckoutSuccess) return;

    // 체류 정보가 없으면 로비로 이동
    if (!roomStay) {
      handleBackClick();
      return;
    }

    // 만료 시간 체크
    const checkOutTime = new Date(roomStay.scheduled_check_out_at).getTime();
    if (now > checkOutTime) {
      toast.warning("퇴실 시간이 되어 자동 체크아웃 되었습니다.");
      handleBackClick();
    }
  }, [roomStay, isLoading, now, handleBackClick, isCheckingOut, isCheckoutSuccess]);

  // 남은 시간 계산 (1시간 미만 경고용)
  const getTimeRemaining = () => {
    if (!roomStay) return null;
    const end = new Date(roomStay.scheduled_check_out_at).getTime();
    const diff = end - now;
    return diff > 0 ? diff : 0;
  };

  const remainingMs = getTimeRemaining();
  // 1시간 미만이고, 만료되지 않았을 때만 임박 표시
  const isImminent = remainingMs !== null && remainingMs < 60 * 60 * 1000 && remainingMs > 0;

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* 배경 이미지 */}
      <img className="absolute inset-0 h-full w-full object-cover" src={img_bg_private_room} alt="개인 숙소 배경" />
      <div className="absolute inset-0 bg-black/60" />

      {/* 헤더 */}
      <div className="relative z-10 flex h-14 items-center justify-end px-4">
        <div className="flex items-center gap-2">
          {/* 연장하기 버튼 (상시 노출) */}
          <Button
            variant="ghost"
            className="text-indigo-300 hover:bg-white/10 hover:text-indigo-200"
            onClick={() => setIsExtendModalOpen(true)}
          >
            연장하기
          </Button>

          {/* 체크아웃 버튼 (AlertDialog) */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                className="text-red-400 hover:bg-white/10 hover:text-red-300"
                disabled={isCheckingOut}
              >
                {isCheckingOut ? "처리 중..." : "체크아웃"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>체크아웃 하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>현재 방에서 퇴실하며, 남은 시간은 저장되지 않습니다.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCheckout}
                  className="bg-red-500 hover:bg-red-600"
                  disabled={isCheckingOut}
                >
                  체크아웃
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* 임박 알림 배너 */}
      {isImminent && (
        <div className="relative z-20 mx-4 mt-2 flex items-center justify-between rounded-lg bg-red-500/80 px-4 py-2 text-white backdrop-blur-sm">
          <span className="text-sm font-medium">체크아웃까지 {Math.ceil(remainingMs! / 1000 / 60)}분 남았습니다!</span>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 bg-white text-xs text-red-500 hover:bg-white/90"
            onClick={() => setIsExtendModalOpen(true)}
          >
            연장하기
          </Button>
        </div>
      )}

      {/* 메인 컨텐츠 (대시보드) */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-6 pb-20">
        <h1 className="text-3xl font-bold text-white drop-shadow-lg">나만의 공간</h1>
        <p className="text-center text-zinc-300">
          이곳에서는 여행을 기록하고
          <br />
          자신을 돌아볼 수 있습니다.
        </p>

        <div className="grid w-full max-w-sm grid-cols-2 gap-4">
          <DashboardCard title="일기장" description="오늘 하루 기록하기" icon="📝" onClick={handleDiaryClick} />
          <DashboardCard title="문답지" description="나를 찾아가는 질문" icon="💭" onClick={handleQuestionnaireClick} />
        </div>
      </div>

      <ExtendStayModal
        open={isExtendModalOpen}
        onOpenChange={setIsExtendModalOpen}
        currentCheckOut={roomStay?.scheduled_check_out_at}
      />
    </div>
  );
}

function DashboardCard({
  title,
  description,
  icon,
  onClick,
}: {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="glass group flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl p-4 transition-all hover:bg-white/10 active:scale-95"
    >
      <span className="text-4xl transition-transform group-hover:scale-110">{icon}</span>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-xs text-zinc-400">{description}</p>
      </div>
    </button>
  );
}
