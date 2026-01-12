import type { InfiniteData } from "@tanstack/react-query";
import apiClient from "@/lib/api-client.ts";
import type { DirectMessage, DirectMessagePage, DirectMessageRoom, ListResponse, MessageStatus } from "@/types.ts";

const BASE_URL = "/dm";

// ============================================================================
// Command (Action)
// ============================================================================

/** 1:1 대화 신청 */
export async function requestDM(toUserId: string): Promise<DirectMessageRoom> {
  const response = await apiClient.post<DirectMessageRoom>(`${BASE_URL}/requests`, {
    to_user_id: toUserId,
  });
  return response.data;
}

/** 1:1 대화 수락 */
export async function acceptDM(dmRoomId: string): Promise<DirectMessageRoom> {
  const response = await apiClient.post<DirectMessageRoom>(`${BASE_URL}/requests/${dmRoomId}/accept`);
  return response.data;
}

// ============================================================================
// Query (Fetch)
// ============================================================================

/** 내 대화방 목록 조회 */
export async function getMyDMRooms(params?: {
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<ListResponse<DirectMessageRoom>> {
  const response = await apiClient.get<ListResponse<DirectMessageRoom>>(`${BASE_URL}/rooms`, {
    params,
  });
  return response.data;
}

/** 대화 메시지 조회 (Infinite Scroll) */
export async function getDMMessages(
  dmRoomId: string,
  params?: {
    cursor?: string; // last_dm_id
    limit?: number;
  }
): Promise<ListResponse<DirectMessage>> {
  const response = await apiClient.get<ListResponse<DirectMessage>>(`${BASE_URL}/rooms/${dmRoomId}/messages`, {
    params,
  });
  return response.data;
}

// ============================================================================
// 캐시 유틸리티 함수 (Optimistic UI)
// ============================================================================

/**
 * DM 메시지를 InfiniteData 캐시에 추가
 *
 * @param oldData - 기존 캐시 데이터
 * @param newMessage - 추가할 새 메시지
 * @returns 업데이트된 캐시 데이터
 */
export function addDMMessageToInfiniteData(
  oldData: InfiniteData<DirectMessagePage> | undefined,
  newMessage: DirectMessage
): InfiniteData<DirectMessagePage> {
  if (!oldData) {
    return {
      pages: [{ messages: [newMessage], nextCursor: undefined }],
      pageParams: [undefined],
    };
  }

  // 중복 체크
  const allMessages = oldData.pages.flatMap((page) => page.messages);
  if (allMessages.some((msg) => msg.dm_id === newMessage.dm_id)) {
    return oldData;
  }

  // 첫 번째 페이지의 마지막에 새 메시지 추가
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
 * 임시 DM 메시지를 실제 메시지로 교체
 *
 * @param oldData - 기존 캐시 데이터
 * @param tempId - 교체할 임시 메시지의 tempId
 * @param realMessage - 서버에서 받은 실제 메시지
 * @returns 업데이트된 캐시 데이터
 */
export function replaceTempDMMessageInInfiniteData(
  oldData: InfiniteData<DirectMessagePage> | undefined,
  tempId: string,
  realMessage: DirectMessage
): InfiniteData<DirectMessagePage> | undefined {
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
 * DM 메시지 상태 업데이트 (tempId 기반)
 *
 * @param oldData - 기존 캐시 데이터
 * @param tempId - 업데이트할 메시지의 tempId
 * @param status - 새로운 상태
 * @returns 업데이트된 캐시 데이터
 */
export function updateDMMessageStatusInInfiniteData(
  oldData: InfiniteData<DirectMessagePage> | undefined,
  tempId: string,
  status: MessageStatus
): InfiniteData<DirectMessagePage> | undefined {
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
 * tempId로 DM 메시지를 캐시에서 삭제
 *
 * 재시도 시 기존 실패 메시지를 삭제할 때 사용
 *
 * @param oldData - 기존 캐시 데이터
 * @param tempId - 삭제할 메시지의 tempId
 * @returns 업데이트된 캐시 데이터
 */
export function removeDMMessageFromInfiniteData(
  oldData: InfiniteData<DirectMessagePage> | undefined,
  tempId: string
): InfiniteData<DirectMessagePage> | undefined {
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
 * sending 상태의 DM 메시지 중 content가 일치하는 것 찾기
 *
 * @param oldData - 캐시 데이터
 * @param userId - 현재 사용자 ID
 * @param content - 메시지 내용
 * @returns 찾은 메시지의 tempId 또는 undefined
 */
export function findSendingDMMessageTempId(
  oldData: InfiniteData<DirectMessagePage> | undefined,
  userId: string,
  content: string
): string | undefined {
  if (!oldData) return undefined;

  for (const page of oldData.pages) {
    for (const msg of page.messages) {
      if (msg.status === "sending" && msg.from_user_id === userId && msg.content === content && msg.tempId) {
        return msg.tempId;
      }
    }
  }
  return undefined;
}
