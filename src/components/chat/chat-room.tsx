/**
 * 채팅방 메인 컨테이너 컴포넌트
 */
import { useState } from "react";
import { ChatHeader } from "@/components/chat/chat-header.tsx";
import { MessageList } from "@/components/chat/message-list.tsx";
import { MessageInput } from "@/components/chat/message-input.tsx";
import { CardModal } from "@/components/chat/card-modal.tsx";
import { useSocket } from "@/hooks/use-socket.ts";
import { useChatConnectionStatus, useChatError } from "@/stores/chat-store.ts";
import { Button } from "@/components/ui/button.tsx";
import { Loader2, RefreshCw } from "lucide-react";

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
 */
export function ChatRoom({ roomId, cityId }: ChatRoomProps) {
  const { sendMessage, shareCard, reconnect } = useSocket({ roomId });
  const connectionStatus = useChatConnectionStatus();
  const error = useChatError();
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

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
      <MessageList roomId={roomId} />

      {/* 입력 영역 */}
      <MessageInput
        onSend={sendMessage}
        onCardClick={() => setIsCardModalOpen(true)}
        disabled={connectionStatus !== "connected"}
      />

      {/* 카드 모달 */}
      <CardModal open={isCardModalOpen} onOpenChange={setIsCardModalOpen} cityId={cityId} onShare={shareCard} />
    </div>
  );
}
