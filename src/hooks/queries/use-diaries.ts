import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyDiaries } from "@/api/diary";

export const DIARIES_QUERY_KEY = "diaries";

export function useMyDiaries(currentStayOnly: boolean = false) {
  return useInfiniteQuery({
    queryKey: [DIARIES_QUERY_KEY, { currentStayOnly }],
    queryFn: ({ pageParam = 0 }) =>
      getMyDiaries({
        offset: pageParam,
        limit: 20,
        current_stay_only: currentStayOnly,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.limit;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
  });
}
