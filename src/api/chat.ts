/**
 * 채팅 관련 REST API 함수
 */
import type {
  ChatMessage,
  ChatMessagePage,
  ChatMessageSender,
  ConversationCard,
  ListResponse,
  MessageStatus,
  User,
} from "@/types.ts";
import apiClient from "@/lib/api-client.ts";
import type { InfiniteData } from "@tanstack/react-query";

// ============================================================================
// API 함수
// ============================================================================

/**
 * 룸 메시지 히스토리 조회 (커서 기반 페이지네이션)
 *
 * @param roomId - 룸 ID
 * @param cursor - 커서 (message_id). 해당 ID 이후의 메시지를 조회. 없으면 최신 메시지부터
 * @param limit - 조회할 메시지 수 (기본 50)
 * @returns 메시지 목록 및 페이지네이션 정보
 *
 * @example
 * ```typescript
 * // 최신 50개 메시지 조회
 * const { list, pagination } = await getRoomMessages(roomId);
 *
 * // 이전 메시지 조회 (마지막 메시지 ID를 커서로 사용)
 * const lastMessageId = list[list.length - 1].message_id;
 * const older = await getRoomMessages(roomId, lastMessageId);
 * ```
 */
export async function getRoomMessages(roomId: string, cursor?: string, limit = 50): Promise<ListResponse<ChatMessage>> {
  const params: Record<string, string | number> = { limit };
  if (cursor) {
    params.cursor = cursor;
  }
  const { data } = await apiClient.get<ListResponse<ChatMessage>>(`/rooms/${roomId}/messages`, {
    params,
  });
  return data;
}

/**
 * 룸 멤버 목록 조회
 *
 * 실제 API 응답은 UserResponse (User 타입)를 반환합니다.
 *
 * @param roomId - 룸 ID
 * @returns 현재 룸에 체류 중인 멤버 목록
 */
export async function getRoomMembers(roomId: string): Promise<ListResponse<User>> {
  const { data } = await apiClient.get<ListResponse<User>>(`/rooms/${roomId}/members`);
  return data;
}

/**
 * 도시별 랜덤 대화 카드 조회
 *
 * @param cityId - 도시 ID
 * @returns 랜덤 대화 카드
 *
 * @example
 * ```typescript
 * const card = await getRandomConversationCard(cityId);
 * console.log(card.question); // "오늘 가장 감사한 일은?"
 * ```
 */
export async function getRandomConversationCard(cityId: string): Promise<ConversationCard> {
  const { data } = await apiClient.get<ConversationCard>(`/chat/cities/${cityId}/conversation-cards/random`);
  return data;
}

// ============================================================================
// 유틸리티 함수
// ============================================================================

/**
 * 멤버 목록에서 sender 정보를 찾아 메시지에 조인
 *
 * @param messages - 원본 메시지 목록
 * @param members - 룸 멤버 목록
 * @returns sender 정보가 조인된 메시지 목록
 */
export function joinSenderToMessages(messages: ChatMessage[], members: User[]): ChatMessage[] {
  const memberMap = new Map<string, ChatMessageSender>(
    members.map((m) => [
      m.user_id,
      {
        user_id: m.user_id,
        nickname: m.nickname,
        profile_emoji: m.profile_emoji,
      },
    ])
  );

  return messages.map((msg) => {
    if (msg.user_id && !msg.sender) {
      const sender = memberMap.get(msg.user_id);
      if (sender) {
        return { ...msg, sender };
      }
    }
    return msg;
  });
}

/**
 * InfiniteQuery 캐시에 새 메시지 추가
 *
 * 첫 번째 페이지의 마지막에 새 메시지를 추가합니다.
 * (메시지는 오래된 순으로 정렬되어 있으므로 마지막이 최신)
 *
 * @param oldData - 기존 캐시 데이터
 * @param newMessage - 추가할 새 메시지
 * @returns 업데이트된 캐시 데이터
 */
export function addMessageToInfiniteData(
  oldData: InfiniteData<ChatMessagePage> | undefined,
  newMessage: ChatMessage
): InfiniteData<ChatMessagePage> {
  if (!oldData) {
    return {
      pages: [{ messages: [newMessage], nextCursor: undefined }],
      pageParams: [undefined],
    };
  }

  // 중복 체크
  const allMessages = oldData.pages.flatMap((page) => page.messages);
  if (allMessages.some((msg) => msg.message_id === newMessage.message_id)) {
    return oldData;
  }

  // 첫 번째 페이지의 마지막에 새 메시지 추가 (최신 메시지는 첫 페이지에)
  const updatedPages = oldData.pages.map((page, index) => {
    if (index === 0) {
      return {
        ...page,
        messages: [...page.messages, newMessage],
      };
    }
    return page;
  });

  return {
    ...oldData,
    pages: updatedPages,
  };
}

/**
 * 임시 메시지를 실제 메시지로 교체
 *
 * Optimistic UI에서 서버 응답 수신 시 임시 메시지를 실제 메시지로 교체
 *
 * @param oldData - 기존 캐시 데이터
 * @param tempId - 교체할 임시 메시지의 tempId
 * @param realMessage - 서버에서 받은 실제 메시지
 * @returns 업데이트된 캐시 데이터
 */
export function replaceTempMessageInInfiniteData(
  oldData: InfiniteData<ChatMessagePage> | undefined,
  tempId: string,
  realMessage: ChatMessage
): InfiniteData<ChatMessagePage> | undefined {
  if (!oldData) return oldData;

  const updatedPages = oldData.pages.map((page) => ({
    ...page,
    messages: page.messages.map((msg) => (msg.tempId === tempId ? { ...realMessage, status: "sent" as const } : msg)),
  }));

  return {
    ...oldData,
    pages: updatedPages,
  };
}

/**
 * 메시지 상태 업데이트 (tempId 기반)
 *
 * Optimistic UI에서 타임아웃 시 failed 상태로 변경할 때 사용
 *
 * @param oldData - 기존 캐시 데이터
 * @param tempId - 업데이트할 메시지의 tempId
 * @param status - 새로운 상태
 * @returns 업데이트된 캐시 데이터
 */
export function updateMessageStatusInInfiniteData(
  oldData: InfiniteData<ChatMessagePage> | undefined,
  tempId: string,
  status: MessageStatus
): InfiniteData<ChatMessagePage> | undefined {
  if (!oldData) return oldData;

  const updatedPages = oldData.pages.map((page) => ({
    ...page,
    messages: page.messages.map((msg) => (msg.tempId === tempId ? { ...msg, status } : msg)),
  }));

  return {
    ...oldData,
    pages: updatedPages,
  };
}

/**
 * tempId로 메시지를 캐시에서 삭제
 *
 * 재시도 시 기존 실패 메시지를 삭제할 때 사용
 *
 * @param oldData - 기존 캐시 데이터
 * @param tempId - 삭제할 메시지의 tempId
 * @returns 업데이트된 캐시 데이터
 */
export function removeMessageFromInfiniteData(
  oldData: InfiniteData<ChatMessagePage> | undefined,
  tempId: string
): InfiniteData<ChatMessagePage> | undefined {
  if (!oldData) return oldData;

  const updatedPages = oldData.pages.map((page) => ({
    ...page,
    messages: page.messages.filter((msg) => msg.tempId !== tempId),
  }));

  return {
    ...oldData,
    pages: updatedPages,
  };
}

/**
 * sending 상태의 메시지 중 content가 일치하는 것 찾기
 *
 * new_message 수신 시 자신이 보낸 임시 메시지를 찾을 때 사용
 *
 * @param oldData - 캐시 데이터
 * @param userId - 현재 사용자 ID
 * @param content - 메시지 내용
 * @returns 찾은 메시지의 tempId 또는 undefined
 */
export function findSendingMessageTempId(
  oldData: InfiniteData<ChatMessagePage> | undefined,
  userId: string,
  content: string
): string | undefined {
  if (!oldData) return undefined;

  for (const page of oldData.pages) {
    for (const msg of page.messages) {
      if (msg.status === "sending" && msg.user_id === userId && msg.content === content && msg.tempId) {
        return msg.tempId;
      }
    }
  }
  return undefined;
}
