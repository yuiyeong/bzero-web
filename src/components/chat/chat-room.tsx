/**
 * 채팅방 메인 컨테이너 컴포넌트
 */
import { Button } from "@/components/ui/button.tsx";
import { CardModal } from "@/components/chat/card-modal.tsx";
import { ChatHeader } from "@/components/chat/chat-header.tsx";
import { MessageInput } from "@/components/chat/message-input.tsx";
import { MessageList } from "@/components/chat/message-list.tsx";
import { useCallback, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { useKeyboardDismiss } from "@/hooks/use-keyboard-dismiss.ts";
import { useSocket } from "@/hooks/use-socket.ts";
import { useChatConnectionStatus, useChatError } from "@/stores/chat-store.ts";

interface ChatRoomProps {
  /** 룸 ID */
  roomId: string;
  /** 도시 ID (카드 모달에서 사용) */
  cityId: string;
}

/**
 * 채팅방 메인 컨테이너 컴포넌트
 *
 * Socket.IO 연결 및 모든 채팅 UI를 관리
 * iOS Safari 키보드 처리: 메시지 전송 후 새 메시지에 focus하여 키보드 내림
 */
export function ChatRoom({ roomId, cityId }: ChatRoomProps) {
  const { sendMessage, shareCard, reconnect, retryMessage } = useSocket({ roomId });
  const connectionStatus = useChatConnectionStatus();
  const error = useChatError();
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  // 모바일 키보드 처리
  const { scheduleKeyboardDismiss, dismissKeyboardIfScheduled } = useKeyboardDismiss();

  // 새 내 메시지 ref가 업데이트되면 키보드 dismiss 처리
  const handleLastOwnMessageRef = useCallback(
    (ref: HTMLDivElement | null) => {
      dismissKeyboardIfScheduled(ref);
    },
    [dismissKeyboardIfScheduled]
  );

  // --------------------------------------------------------
  // 연결 중 로딩
  // --------------------------------------------------------
  if (connectionStatus === "connecting") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <Loader2 className="text-b0-purple h-8 w-8 animate-spin" />
        <p className="text-sm text-zinc-400">채팅방에 연결하는 중...</p>
      </div>
    );
  }

  // --------------------------------------------------------
  // 연결 에러
  // --------------------------------------------------------
  if (connectionStatus === "error" && error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="rounded-full bg-red-500/10 p-4">
          <RefreshCw className="h-8 w-8 text-red-400" />
        </div>
        <div>
          <p className="mb-1 font-medium text-white">연결에 실패했습니다</p>
          <p className="text-sm text-zinc-400">{error.message}</p>
        </div>
        <Button onClick={reconnect} className="bg-b0-purple hover:bg-b0-purple/80">
          <RefreshCw className="mr-2 h-4 w-4" />
          다시 연결
        </Button>
      </div>
    );
  }

  // --------------------------------------------------------
  // 채팅방 UI
  // --------------------------------------------------------
  return (
    <div className="flex h-full flex-col">
      {/* 헤더 */}
      <ChatHeader roomId={roomId} connectionStatus={connectionStatus} />

      {/* 메시지 목록 */}
      <MessageList roomId={roomId} onLastOwnMessageRef={handleLastOwnMessageRef} onRetryMessage={retryMessage} />

      {/* 입력 영역 */}
      <MessageInput
        onSend={sendMessage}
        onMessageSent={scheduleKeyboardDismiss}
        onCardClick={() => setIsCardModalOpen(true)}
        disabled={connectionStatus !== "connected"}
      />

      {/* 카드 모달 */}
      <CardModal open={isCardModalOpen} onOpenChange={setIsCardModalOpen} cityId={cityId} onShare={shareCard} />
    </div>
  );
}
