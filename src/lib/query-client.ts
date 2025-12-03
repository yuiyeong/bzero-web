import { QueryClient } from "@tanstack/react-query";

export const queryKeys = {
  me: {
    all: ["user"],
    detail: ["user", "me"],
  },
} as const;

export const queryClient = new QueryClient();
