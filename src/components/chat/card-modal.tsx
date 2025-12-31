/**
 * 대화 카드 모달 컴포넌트
 */
import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { getRandomConversationCard } from "@/api/chat.ts";
import type { ConversationCard } from "@/types.ts";
import { Loader2, RefreshCw, Share2 } from "lucide-react";
import { logger } from "@/lib/logger.ts";

interface CardModalProps {
  /** 모달 열림 상태 */
  open: boolean;
  /** 모달 닫기 콜백 */
  onOpenChange: (open: boolean) => void;
  /** 도시 ID */
  cityId: string;
  /** 카드 공유 콜백 */
  onShare: (cardId: string) => void;
}

/**
 * 대화 카드 모달 컴포넌트
 *
 * - 랜덤 카드 뽑기
 * - 다시 뽑기
 * - 카드 공유
 */
export function CardModal({ open, onOpenChange, cityId, onShare }: CardModalProps) {
  const [card, setCard] = useState<ConversationCard | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --------------------------------------------------------
  // 카드 뽑기
  // --------------------------------------------------------
  const drawCard = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getRandomConversationCard(cityId);
      setCard(response.data);
    } catch (err) {
      logger.error("카드 뽑기 실패:", err);
      setError("카드를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [cityId]);

  // --------------------------------------------------------
  // 모달 열릴 때 자동으로 카드 뽑기
  // --------------------------------------------------------
  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (isOpen && !card) {
        drawCard();
      }
      if (!isOpen) {
        // 모달 닫을 때 상태 초기화
        setCard(null);
        setError(null);
      }
      onOpenChange(isOpen);
    },
    [card, drawCard, onOpenChange]
  );

  // --------------------------------------------------------
  // 카드 공유
  // --------------------------------------------------------
  const handleShare = useCallback(async () => {
    if (!card) return;

    setIsSharing(true);
    try {
      onShare(card.card_id);
      onOpenChange(false);
    } finally {
      setIsSharing(false);
    }
  }, [card, onShare, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-b0-deep-navy border-zinc-800 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <span className="text-xl">🎴</span>
            대화 카드
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {/* 로딩 상태 */}
          {isLoading && (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="text-b0-purple h-8 w-8 animate-spin" />
            </div>
          )}

          {/* 에러 상태 */}
          {error && (
            <div className="flex h-40 flex-col items-center justify-center gap-3">
              <p className="text-sm text-red-400">{error}</p>
              <Button variant="outline" size="sm" onClick={drawCard} className="border-zinc-700">
                다시 시도
              </Button>
            </div>
          )}

          {/* 카드 표시 */}
          {!isLoading && !error && card && (
            <div className="space-y-6">
              {/* 카드 내용 */}
              <div className="border-b0-purple/30 from-b0-purple/10 rounded-xl border bg-gradient-to-br to-transparent p-6">
                <p className="text-center text-lg leading-relaxed font-medium text-white">{card.question}</p>
              </div>

              {/* 버튼 그룹 */}
              <div className="flex gap-3">
                {/* 다시 뽑기 */}
                <Button
                  variant="outline"
                  onClick={drawCard}
                  disabled={isLoading}
                  className="flex-1 border-zinc-700 hover:bg-zinc-800"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  다시 뽑기
                </Button>

                {/* 카드 공유 */}
                <Button
                  onClick={handleShare}
                  disabled={isSharing}
                  className="bg-b0-purple hover:bg-b0-purple/80 flex-1"
                >
                  {isSharing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Share2 className="mr-2 h-4 w-4" />}
                  공유하기
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
