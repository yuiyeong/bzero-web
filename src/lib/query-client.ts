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
} as const;

export const queryClient = new QueryClient();
