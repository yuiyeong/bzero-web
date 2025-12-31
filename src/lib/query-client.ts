import { QueryClient } from "@tanstack/react-query";

export const queryKeys = {
  me: {
    all: ["user"],
    detail: ["user", "me"],
  },
  cities: {
    all: ["cities"],
    active: ["cities", "active"],
    detail: (cityId: string) => ["cities", cityId],
  },
  airships: {
    all: ["airships"],
  },
  tickets: {
    all: ["tickets"],
    boarding: ["tickets", "boarding"],
  },
  roomStays: {
    all: ["roomStays"],
    current: ["roomStays", "current"],
  },
  diaries: {
    all: ["diaries"],
    list: ["diaries", "list"],
    detail: (id: string) => ["diaries", "detail", id],
  },
  questionnaires: {
    all: ["questionnaires"],
    cityQuestions: (cityId: string) => ["questionnaires", "cityQuestions", cityId],
    list: ["questionnaires", "list"],
  },
  chat: {
    all: ["chat"],
    messages: (roomId: string) => ["chat", "messages", roomId],
    members: (roomId: string) => ["chat", "members", roomId],
    card: (cityId: string) => ["chat", "card", cityId],
  },
} as const;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 탭 전환 시 자동 재요청 방지 (소켓 연결 유지 위함)
      staleTime: 1000 * 60, // 1분간 데이터 유효 (불필요한 로딩 상태 방지)
      retry: false,
    },
  },
});
