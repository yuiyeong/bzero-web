import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createSocket, type TypedSocket } from "@/lib/socket";
import { queryKeys } from "@/lib/query-client";
import { useCurrentRoomStay } from "@/hooks/queries/use-current-room-stay";
import { logger } from "@/lib/logger";

/**
 * Lounge Page Socket Hook
 *
 * Listens for DM-related notifications (`dm_request_notification`, `dm_status_changed`)
 * and invalidates relevant queries to update the UI in real-time.
 */
export function useLoungeSocket() {
  const { data: roomStay } = useCurrentRoomStay();
  const queryClient = useQueryClient();
  const socketRef = useRef<TypedSocket | null>(null);

  useEffect(() => {
    if (!roomStay?.room_id) return;

    // Cleanup previous socket
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const socket = createSocket(roomStay.room_id);
    socketRef.current = socket;

    // Connect
    socket.on("connect", () => {
      logger.log("[LoungeSocket] Connected");
    });
    socket.on("error", (err: unknown) => {
      console.error("Socket error:", err);
    });

    // Listen for DM Request
    socket.on("dm_request_notification", (data: unknown) => {
      logger.log("[LoungeSocket] DM Request Received", data);
      // My DM List needs update (Status: pending)
      queryClient.invalidateQueries({ queryKey: queryKeys.dm.list("pending") });
      queryClient.invalidateQueries({ queryKey: queryKeys.dm.list("active") }); // Just in case
      queryClient.invalidateQueries({ queryKey: queryKeys.dm.list() });
    });

    // Listen for DM Status Change (Accept/Reject)
    socket.on("dm_status_changed", (data: unknown) => {
      logger.log("[LoungeSocket] DM Status Changed", data);
      // My DM List needs update
      queryClient.invalidateQueries({ queryKey: queryKeys.dm.list() });
      // Probably update Specific DM Room cache if needed, but list is most important for TravelerItem
    });

    socket.connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [roomStay?.room_id, queryClient]);
}
