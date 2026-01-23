import { useQuery } from "@tanstack/react-query";
import { getMyNotifications, getUnreadCount } from "@/api/notifications";
import { queryKeys } from "@/lib/query-client";

/**
 * 내 알림 목록 조회 훅
 */
export function useNotifications(offset = 0, limit = 20) {
    return useQuery({
        queryKey: queryKeys.notifications.list(offset, limit),
        queryFn: () => getMyNotifications({ offset, limit }),
    });
}

/**
 * 읽지 않은 알림 개수 조회 훅
 *
 * 30초마다 자동으로 갱신됩니다.
 */
export function useUnreadCount() {
    return useQuery({
        queryKey: queryKeys.notifications.unreadCount,
        queryFn: getUnreadCount,
        refetchInterval: 30000, // 30초마다 자동 갱신
    });
}
