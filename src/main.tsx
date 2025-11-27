import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client.ts";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { router } from "@/root-route.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {import.meta.env.DEV ? <ReactQueryDevtools /> : null}
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
