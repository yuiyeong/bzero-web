import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useMarkAllAsRead, useMarkNotificationAsRead } from "@/hooks/mutations/use-mark-notification-read";
import { useNotifications } from "@/hooks/queries/use-notifications";
import { NotificationItem } from "./notification-item";

interface NotificationSheetProps {
    open: boolean;
    onClose: (open: boolean) => void;
}

export function NotificationSheet({ open, onClose }: NotificationSheetProps) {
    const { data, isLoading } = useNotifications();
    const { mutate: markAsRead } = useMarkNotificationAsRead();
    const { mutate: markAllAsRead } = useMarkAllAsRead();

    const notifications = data?.list ?? [];
    const hasUnread = notifications.some((n) => !n.is_read);

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="right" className="w-full border-l border-zinc-800 bg-black p-0 sm:max-w-md">
                <SheetHeader className="border-b border-zinc-800 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-lg font-bold text-white">알림</SheetTitle>
                        {hasUnread && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto px-2 text-xs text-zinc-400 hover:text-white"
                                onClick={() => markAllAsRead()}
                            >
                                모두 읽음
                            </Button>
                        )}
                    </div>
                </SheetHeader>

                <div className="flex h-full flex-col overflow-y-auto px-6 py-4 pb-20">
                    {isLoading && <div className="py-8 text-center text-sm text-zinc-500">로딩 중...</div>}

                    {!isLoading && notifications.length === 0 && (
                        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center text-zinc-500">
                            <p>새로운 알림이 없습니다.</p>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        {notifications.map((notification) => (
                            <NotificationItem
                                key={notification.notification_id}
                                notification={notification}
                                onRead={() => markAsRead(notification.notification_id)}
                            />
                        ))}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
