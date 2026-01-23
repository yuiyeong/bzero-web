import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Clock, Info, Megaphone, MessageCircle } from "lucide-react";
import type { Notification } from "@/types";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
    notification: Notification;
    onRead: () => void;
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
    const getIcon = () => {
        switch (notification.type) {
            case "CHECKOUT_REMINDER":
                return <Clock className="h-5 w-5 text-orange-400" />;
            case "DM_REQUEST":
                return <MessageCircle className="h-5 w-5 text-blue-400" />;
            case "ANNOUNCEMENT":
                return <Megaphone className="h-5 w-5 text-purple-400" />;
            case "SYSTEM":
                return <Info className="h-5 w-5 text-zinc-400" />;
            default:
                return <Info className="h-5 w-5 text-zinc-400" />;
        }
    };

    return (
        <div
            className={cn(
                "cursor-pointer rounded-lg border p-4 transition-colors hover:bg-zinc-900/50",
                notification.is_read ? "border-zinc-800 bg-transparent" : "border-indigo-500/50 bg-indigo-500/5"
            )}
            onClick={() => !notification.is_read && onRead()}
        >
            <div className="flex gap-3">
                <div className="mt-1">{getIcon()}</div>
                <div className="flex-1">
                    <h4 className={cn("text-sm font-semibold", notification.is_read ? "text-zinc-400" : "text-white")}>
                        {notification.title}
                    </h4>
                    <p className="mt-1 text-sm text-zinc-400">{notification.message}</p>
                    <span className="mt-2 block text-xs text-zinc-500">
                        {formatDistanceToNow(new Date(notification.created_at), {
                            addSuffix: true,
                            locale: ko,
                        })}
                    </span>
                </div>
            </div>
        </div>
    );
}
