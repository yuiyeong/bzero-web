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
} as const;

export const queryClient = new QueryClient();
