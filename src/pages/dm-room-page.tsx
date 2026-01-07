import { useNavigate, useParams } from "react-router";
import { useDMMessages, useMyDMRooms } from "@/hooks/queries/use-dm.ts";
import { useMe } from "@/hooks/queries/use-me.ts";
import { useDMSocket } from "@/hooks/use-dm-socket.ts";
import { useKeyboardDismiss } from "@/hooks/use-keyboard-dismiss.ts";
import { MessageInput } from "@/components/chat/message-input.tsx";
import MessageBubble from "@/components/lounge/MessageBubble.tsx";
import GlobalLoader from "@/components/global-loader.tsx";
import { useEffect, useRef, useMemo } from "react";
import bgDM from "@/assets/images/img_bg_dm.webp";
import { trackPageView } from "@/lib/analytics.ts";

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
  const { sendMessage, isConnected } = useDMSocket({
    dmRoomId: dmRoomId!,
    enabled: !!dmRoomId && !!me,
  });

  // Find Room & Partner
  // Note: dmRoomsResponse might not contain this room if we navigated directly via URL and list wasn't fetched/cached
  // But strictly `useMyDMRooms` fetches list.
  // We need partner info
  const myRoom = dmRoomsResponse?.list?.find((r) => r.dm_room_id === dmRoomId);
  let partnerNickname = "Unknown";
  let partnerProfile: string | null = null;

  if (myRoom && me) {
    if (myRoom.requester_id === me.user_id) {
      partnerNickname = myRoom.receiver_nickname || "Unknown";
      partnerProfile = myRoom.receiver_profile_image;
    } else {
      partnerNickname = myRoom.requester_nickname || "Unknown";
      partnerProfile = myRoom.requester_profile_image;
    }
  }

  // Flatten messages (useMemo로 감싸서 매 렌더링마다 새 배열 생성 방지)
  const messages = useMemo(() => messagesData?.pages.flatMap((p) => p.messages) ?? [], [messagesData?.pages]);

  // Scroll to bottom
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageId = messages.at(-1)?.dm_id;

  // 모바일 키보드 처리
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

  useEffect(() => {
    // Only scroll if near bottom or initial load?
    // For now simple auto scroll on new message (lastMessageId change)
    if (scrollRef.current) {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    }
  }, [lastMessageId]); // Trigger only when newest message changes

  // 새 내 메시지 감지 시 키보드 dismiss 처리 (모바일)
  useEffect(() => {
    if (lastOwnMessage && lastOwnMessage.dm_id !== prevLastOwnMessageIdRef.current) {
      prevLastOwnMessageIdRef.current = lastOwnMessage.dm_id;
      dismissKeyboardIfScheduled(lastOwnMessageRef.current);
    }
  }, [lastOwnMessage, dismissKeyboardIfScheduled]);

  // Observer for Infinite Scroll would go here (fetchNextPage when scrolling up)

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

        {/* Messages */}
        <div ref={scrollRef} className="chrome-scrollbar-hidden flex-1 overflow-y-auto p-4">
          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full py-2 text-center text-xs text-zinc-400"
            >
              {isFetchingNextPage ? "Loading..." : "Load Older Messages"}
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
                />
              );
            })
          )}
        </div>

        {/* Input */}
        <div className="flex-none">
          <MessageInput onSend={sendMessage} onMessageSent={scheduleKeyboardDismiss} disabled={!isConnected} />
        </div>
      </div>
    </div>
  );
}
