import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyQuestionnaires } from "@/api/questionnaire";

export const QUESTIONNAIRES_QUERY_KEY = "questionnaires";

export function useMyQuestionnaires(currentStayOnly: boolean = false) {
  return useInfiniteQuery({
    queryKey: [QUESTIONNAIRES_QUERY_KEY, { currentStayOnly }],
    queryFn: ({ pageParam = 0 }) =>
      getMyQuestionnaires({
        offset: pageParam,
        limit: 20,
        current_stay_only: currentStayOnly,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      const nextOffset = pagination.offset + pagination.limit;
      return nextOffset < pagination.total ? nextOffset : undefined;
    },
  });
}
