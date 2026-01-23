/**
 * 알림 API 함수 모음
 */
import apiClient from "@/lib/api-client";
import type { DataResponse, Notification, NotificationListResponse } from "@/types";

/**
 * 내 알림 목록 조회
 *
 * @param params.offset - 목록 시작 위치
 * @param params.limit - 조회할 개수
 * @param params.is_read - 읽음 여부 필터 (true: 읽음, false: 안읽음, undefined: 전체)
 */
export async function getMyNotifications(params: {
    offset: number;
    limit: number;
    is_read?: boolean;
}): Promise<NotificationListResponse> {
    const { data } = await apiClient.get<NotificationListResponse>("/notifications", { params });
    return data;
}

/**
 * 읽지 않은 알림 개수 조회
 */
export async function getUnreadCount(): Promise<number> {
    const { data } = await apiClient.get<DataResponse<number>>("/notifications/unread-count");
    return data.data;
}

/**
 * 알림 읽음 처리
 *
 * @param notificationId - 읽음 처리할 알림 ID
 */
export async function markNotificationAsRead(notificationId: string): Promise<Notification> {
    const { data } = await apiClient.patch<DataResponse<Notification>>(`/notifications/${notificationId}/read`);
    return data.data;
}

/**
 * 모든 알림 읽음 처리
 */
export async function markAllNotificationsAsRead(): Promise<void> {
    await apiClient.post("/notifications/read-all");
}
