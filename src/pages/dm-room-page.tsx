import { MessageInput } from "@/components/chat/message-input.tsx";
import GlobalLoader from "@/components/global-loader.tsx";
import MessageBubble from "@/components/lounge/MessageBubble.tsx";
import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { useDMMessages, useMyDMRooms } from "@/hooks/queries/use-dm.ts";
import { useMe } from "@/hooks/queries/use-me.ts";
import { useDMSocket } from "@/hooks/use-dm-socket.ts";
import { useKeyboardDismiss } from "@/hooks/use-keyboard-dismiss.ts";
import { trackPageView } from "@/lib/analytics.ts";
import bgDM from "@/assets/images/img_bg_dm.webp";

export default function DMRoomPage() {
  const navigate = useNavigate();
  const { dmRoomId } = useParams<{ dmRoomId: string }>();

  // Data Fetching
  const { data: me } = useMe();
  const { data: dmRoomsResponse } = useMyDMRooms(); // to find partner info
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDMMessages(dmRoomId!);

  // Socket
  const { sendMessage, isConnected, retryMessage } = useDMSocket({
    dmRoomId: dmRoomId!,
    enabled: !!dmRoomId && !!me,
  });

  // 대화 상대방 정보 추출
  const myRoom = dmRoomsResponse?.list?.find((r) => r.dm_room_id === dmRoomId);
  const isRequester = myRoom?.requester_id === me?.user_id;
  const partnerNickname = myRoom
    ? (isRequester ? myRoom.receiver_nickname : myRoom.requester_nickname) || "Unknown"
    : "Unknown";
  const partnerProfile = myRoom ? (isRequester ? myRoom.receiver_profile_image : myRoom.requester_profile_image) : null;

  // 메시지 목록 평탄화
  const messages = useMemo(() => messagesData?.pages.flatMap((p) => p.messages) ?? [], [messagesData?.pages]);

  // 스크롤 관련 refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageId = messages.at(-1)?.dm_id;

  // iOS Safari 키보드 처리
  const { scheduleKeyboardDismiss, dismissKeyboardIfScheduled } = useKeyboardDismiss();
  const lastOwnMessageRef = useRef<HTMLDivElement | null>(null);
  const prevLastOwnMessageIdRef = useRef<string | null>(null);

  // 마지막 내 메시지 찾기
  const lastOwnMessage = useMemo(() => {
    if (!me) return null;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].from_user_id === me.user_id) {
        return messages[i];
      }
    }
    return null;
  }, [messages, me]);

  useEffect(() => {
    trackPageView("1:1 대화", `/dm/${dmRoomId}`);
  }, [dmRoomId]);

  // 새 메시지 수신 시 하단으로 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    }
  }, [lastMessageId]);

  // 새 내 메시지 감지 시 키보드 dismiss 처리 (iOS Safari)
  useEffect(() => {
    if (lastOwnMessage && lastOwnMessage.dm_id !== prevLastOwnMessageIdRef.current) {
      prevLastOwnMessageIdRef.current = lastOwnMessage.dm_id;
      dismissKeyboardIfScheduled(lastOwnMessageRef.current);
    }
  }, [lastOwnMessage, dismissKeyboardIfScheduled]);

  if (isLoadingMessages || !me) {
    return <GlobalLoader />;
  }

  return (
    <div className="relative flex h-full flex-col bg-cover bg-center" style={{ backgroundImage: `url(${bgDM})` }}>
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <header className="bg-b0-deep-navy/90 z-20 flex h-14 flex-none items-center border-b border-zinc-800/50 px-4 text-white backdrop-blur-sm">
          <button onClick={() => navigate(-1)} className="-ml-2 p-2 text-zinc-400 transition-colors hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <div className="ml-2 flex items-center gap-2 font-medium">
            {partnerProfile && <span className="text-lg">{partnerProfile}</span>}
            {partnerNickname}
          </div>
          <div className="ml-auto">
            {/* Status Indicator? */}
            {isConnected && <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />}
          </div>
        </header>

        {/* 메시지 목록 */}
        <div ref={scrollRef} className="chrome-scrollbar-hidden flex-1 overflow-y-auto p-4">
          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full py-2 text-center text-xs text-zinc-400"
            >
              {isFetchingNextPage ? "불러오는 중..." : "이전 메시지 불러오기"}
            </button>
          )}

          {messages.length === 0 ? (
            <div className="mt-20 text-center text-sm text-zinc-400">대화를 시작해보세요!</div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.from_user_id === me.user_id;
              const isLastOwnMessage = lastOwnMessage?.dm_id === msg.dm_id;

              return (
                <MessageBubble
                  key={msg.dm_id}
                  ref={isLastOwnMessage ? lastOwnMessageRef : undefined}
                  message={msg}
                  isMe={isMe}
                  onRetry={retryMessage}
                />
              );
            })
          )}
        </div>

        {/* 입력 영역 */}
        <div className="flex-none">
          <MessageInput onSend={sendMessage} onMessageSent={scheduleKeyboardDismiss} disabled={!isConnected} />
        </div>
      </div>
    </div>
  );
}
