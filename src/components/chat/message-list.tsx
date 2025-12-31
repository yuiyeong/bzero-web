/**
 * 메시지 목록 컴포넌트 (무한 스크롤 지원)
 */
import { useRef, useEffect, useCallback, useMemo } from "react";
import { useChatConnectionStatus } from "@/stores/chat-store.ts";
import { useRoomMessages } from "@/hooks/queries/use-room-messages.ts";
import { useRoomMembers } from "@/hooks/queries/use-room-members.ts";
import { useMe } from "@/hooks/queries/use-me.ts";
import { joinSenderToMessages } from "@/api/chat.ts";
import { MessageBubble } from "@/components/chat/message-bubble.tsx";
import { SystemMessage } from "@/components/chat/system-message.tsx";
import { CardMessage } from "@/components/chat/card-message.tsx";
import type { ChatMessage } from "@/types.ts";

interface MessageListProps {
  /** 룸 ID */
  roomId: string;
}

/**
 * 메시지 목록 컴포넌트
 *
 * - 무한 스크롤로 이전 메시지 로드
 * - 새 메시지 수신 시 하단에 있으면 자동 스크롤
 */
export function MessageList({ roomId }: MessageListProps) {
  const connectionStatus = useChatConnectionStatus();
  const { data: me } = useMe();

  // TanStack Query
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useRoomMessages(roomId, {
    enabled: connectionStatus === "connected",
  });
  const { data: members } = useRoomMembers(roomId, {
    enabled: connectionStatus === "connected",
  });

  // 모든 페이지의 메시지를 평탄화하고 sender 조인
  const messages = useMemo(() => {
    if (!data?.pages) return [];
    // 페이지는 역순으로 쌓이므로 (이전 메시지가 뒤에), reverse 후 flatMap
    const flatMessages = [...data.pages].reverse().flatMap((page) => page.messages);
    // members가 로드되면 sender 정보 조인
    if (members && members.length > 0) {
      return joinSenderToMessages(flatMessages, members);
    }
    return flatMessages;
  }, [data?.pages, members]);

  const containerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const prevMessagesLengthRef = useRef(0);

  // --------------------------------------------------------
  // 하단으로 스크롤 (iOS Safari 호환)
  // --------------------------------------------------------
  const scrollToBottom = useCallback(() => {
    // 렌더링 완료 후 스크롤 (iOS 호환성)
    requestAnimationFrame(() => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      container.scrollTop = container.scrollHeight;
    });
  }, []);

  // --------------------------------------------------------
  // 스크롤 위치 추적
  // --------------------------------------------------------
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    // 상단 도달 시 이전 메시지 로드
    if (scrollTop < 100 && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }

    // 하단 근접 여부 체크 (100px 이내)
    isAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 100;
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // --------------------------------------------------------
  // 새 메시지 수신 시 자동 스크롤
  // --------------------------------------------------------
  useEffect(() => {
    // 메시지가 추가되었을 때만 처리
    if (messages.length > prevMessagesLengthRef.current) {
      // 하단에 있을 때만 자동 스크롤
      if (isAtBottomRef.current) {
        scrollToBottom();
      }
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages.length, scrollToBottom]);

  // --------------------------------------------------------
  // 연결 완료 시 하단으로 스크롤 (초기 로드)
  // --------------------------------------------------------
  useEffect(() => {
    if (connectionStatus === "connected" && messages.length > 0) {
      // 약간의 딜레이 후 스크롤 (메시지 렌더링 대기)
      setTimeout(() => {
        scrollToBottom();
        // 스크롤 후 하단에 있음을 명시적으로 설정
        isAtBottomRef.current = true;
      }, 150);
    }
  }, [connectionStatus, messages.length, scrollToBottom]);

  // --------------------------------------------------------
  // 메시지 렌더링
  // --------------------------------------------------------
  const renderMessage = (message: ChatMessage) => {
    // 시스템 메시지
    if (message.is_system || message.message_type === "system") {
      return <SystemMessage key={message.message_id} message={message} />;
    }

    // 카드 공유 메시지
    if (message.message_type === "card_shared") {
      return <CardMessage key={message.message_id} message={message} isOwn={message.user_id === me?.user_id} />;
    }

    // 일반 텍스트 메시지
    return <MessageBubble key={message.message_id} message={message} isOwn={message.user_id === me?.user_id} />;
  };

  return (
    <div ref={containerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-4 py-3">
      {/* 이전 메시지 로딩 인디케이터 */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-3">
          <span className="text-sm text-zinc-400">이전 메시지 불러오는 중...</span>
        </div>
      )}

      {/* 메시지 목록 */}
      <div className="space-y-3">{messages.map(renderMessage)}</div>

      {/* 메시지가 없을 때 */}
      {messages.length === 0 && connectionStatus === "connected" && (
        <div className="flex h-full items-center justify-center">
          <p className="text-center text-sm text-zinc-500">
            아직 대화가 없습니다.
            <br />첫 메시지를 보내보세요!
          </p>
        </div>
      )}
    </div>
  );
}
