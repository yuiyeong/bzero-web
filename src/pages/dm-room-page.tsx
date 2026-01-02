import { useNavigate, useParams } from "react-router";
import { useDMMessages, useMyDMRooms } from "@/hooks/queries/use-dm";
import { useMe } from "@/hooks/queries/use-me";
import { useDMSocket } from "@/hooks/use-dm-socket";
import { MessageInput } from "@/components/chat/message-input";
import MessageBubble from "@/components/lounge/MessageBubble";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
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

  // Flatten messages
  const messages = messagesData?.pages.flatMap((p) => p.messages) || [];

  // Scroll to bottom
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageId = messages.at(-1)?.dm_id;

  useEffect(() => {
    // Only scroll if near bottom or initial load?
    // For now simple auto scroll on new message (lastMessageId change)
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lastMessageId]); // Trigger only when newest message changes

  // Observer for Infinite Scroll would go here (fetchNextPage when scrolling up)

  if (isLoadingMessages || !me) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-300" />
      </div>
    );
  }

  return (
    <div className="relative flex h-screen flex-col bg-cover bg-center" style={{ backgroundImage: `url(${bgDM})` }}>
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
            messages.map((msg) => (
              <MessageBubble
                key={msg.dm_id}
                message={msg}
                isMe={msg.from_user_id === me.user_id}
                // We don't have sender object in `DirectMessage` from API yet?
                // `api/dm.ts` -> `DirectMessage` interface only has IDs.
                // MessageBubble will try to show logic but might fail if sender undefined.
                // Backend needs to join sender.
              />
            ))
          )}
        </div>

        {/* Input */}
        <div className="flex-none">
          <MessageInput onSend={sendMessage} disabled={!isConnected} />
        </div>
      </div>
    </div>
  );
}
