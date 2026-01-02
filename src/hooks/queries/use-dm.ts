import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { acceptDM, getDMMessages, getMyDMRooms, rejectDM, requestDM } from "@/api/dm";
import { queryKeys } from "@/lib/query-client";
import type { B0ApiError } from "@/lib/api-errors";
import { toast } from "sonner";
import type { DirectMessagePage } from "@/types";

// ============================================================================
// Queries
// ============================================================================

export function useMyDMRooms(status?: string) {
  return useQuery({
    queryKey: queryKeys.dm.list(status),
    queryFn: () => getMyDMRooms({ status }),
    staleTime: 1000 * 60, // 1분
  });
}

export function useDMMessages(dmRoomId: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.dm.messages(dmRoomId),
    queryFn: async ({ pageParam }) => {
      const response = await getDMMessages(dmRoomId, {
        cursor: pageParam,
        limit: 50,
      });
      return {
        messages: response.list,
        nextCursor: response.list.length === 50 ? response.list[response.list.length - 1].dm_id : undefined,
      };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: DirectMessagePage) => lastPage.nextCursor,
    select: (data: InfiniteData<DirectMessagePage>) => ({
      pages: [...data.pages].reverse(), // 메시지 역순 정렬 (과거 -> 최신)
      pageParams: [...data.pageParams].reverse(),
    }),
  });
}

// ============================================================================
// Mutations
// ============================================================================

export function useRequestDM() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestDM,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dm.all });
      toast.success("대화 신청을 보냈습니다.");
    },
    onError: (error: B0ApiError) => {
      if (error.code === "DUPLICATED_DM_REQUEST") {
        toast.error("이미 대화 신청을 보냈거나 수신했습니다.");
      } else if (error.code === "NOT_IN_SAME_ROOM") {
        toast.error("같은 곳에 있는 여행자에게만 신청할 수 있습니다.");
      } else {
        toast.error(error.message || "대화 신청 실패");
      }
    },
  });
}

export function useAcceptDM() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptDM,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dm.all });
      toast.success("대화 신청을 수락했습니다.");
      return data;
    },
    onError: (error: B0ApiError) => {
      toast.error(error.message || "수락 실패");
    },
  });
}

export function useRejectDM() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectDM,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dm.all });
      toast.success("대화 신청을 거절했습니다.");
    },
    onError: (error: B0ApiError) => {
      toast.error(error.message || "거절 실패");
    },
  });
}
