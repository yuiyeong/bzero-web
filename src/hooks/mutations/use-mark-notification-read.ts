import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllNotificationsAsRead, markNotificationAsRead } from "@/api/notifications";
import { queryKeys } from "@/lib/query-client";
import { toast } from "sonner";

/**
 * 단일 알림 읽음 처리 훅
 */
export function useMarkNotificationAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markNotificationAsRead,
        onSuccess: () => {
            // 목록 갱신
            queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
        },
        onError: (error) => {
            console.error("Failed to mark notification as read:", error);
            toast.error("알림 읽음 처리에 실패했습니다.");
        },
    });
}

/**
 * 모든 알림 읽음 처리 훅
 */
export function useMarkAllAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markAllNotificationsAsRead,
        onSuccess: () => {
            toast.success("모든 알림을 읽음 처리했습니다.");
            queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
        },
        onError: (error) => {
            console.error("Failed to mark all notifications as read:", error);
            toast.error("알림 전체 읽음 처리에 실패했습니다.");
        },
    });
}
