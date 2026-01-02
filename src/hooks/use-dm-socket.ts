import { useEffect, useRef, useCallback, useState } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { createDMSocket, type TypedSocket } from "@/lib/socket";
import { queryKeys } from "@/lib/query-client";
import type { DirectMessage, DirectMessagePage } from "@/types";
import { toast } from "sonner";

interface UseDMSocketOptions {
  dmRoomId: string;
  enabled?: boolean;
}

interface UseDMSocketReturn {
  sendMessage: (content: string) => void;
  isConnected: boolean;
}

export function useDMSocket({ dmRoomId, enabled = true }: UseDMSocketOptions): UseDMSocketReturn {
  const socketRef = useRef<TypedSocket | null>(null);
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!enabled || !dmRoomId) return;

    // Cleanup previous
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    let socket: TypedSocket | null = null;
    let isActive = true;

    try {
      socket = createDMSocket(dmRoomId);

      socketRef.current = socket;

      socket.on("connect", () => {
        if (!isActive) return;
        setIsConnected(true);
        socket?.emit("join_dm_room", { dm_room_id: dmRoomId });
      });

      socket.on("disconnect", () => {
        if (!isActive) return;
        setIsConnected(false);
      });

      socket.on("error", (err: unknown) => {
        console.error("Socket error:", err);
      });

      // Listen for new messages
      socket.on("new_dm_message", (data: { message: DirectMessage }) => {
        if (!isActive) return;

        // Update Query Cache
        queryClient.setQueryData(
          queryKeys.dm.messages(dmRoomId),
          (oldData: InfiniteData<DirectMessagePage> | undefined) => {
            if (!oldData) {
              return {
                pages: [{ messages: [data.message], nextCursor: undefined }],
                pageParams: [undefined],
              };
            }

            // Check duplicate
            const allMessages = oldData.pages.flatMap((p) => p.messages);
            if (allMessages.some((m) => m.dm_id === data.message.dm_id)) return oldData;

            // Add to END of the first page (assuming Ascending order inside page, and Page 0 is Latest)
            // API returns [Older, ..., Newest].
            // We add Newest to the end.
            const newPages = [...oldData.pages];
            if (newPages.length > 0) {
              newPages[0] = {
                ...newPages[0],
                messages: [...newPages[0].messages, data.message],
              };
            }

            return {
              ...oldData,
              pages: newPages,
            };
          }
        );

        // Ensure consistency
        queryClient.invalidateQueries({ queryKey: queryKeys.dm.messages(dmRoomId) });
      });

      socket.connect();
    } catch (err) {
      console.error("Socket init error", err);
    }

    return () => {
      isActive = false;
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
      }
    };
  }, [dmRoomId, enabled, queryClient]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!socketRef.current?.connected) {
        toast.error("연결되지 않았습니다.");
        return;
      }
      socketRef.current.emit("send_dm_message", { dm_room_id: dmRoomId, content });
    },
    [dmRoomId]
  );

  return { sendMessage, isConnected };
}
