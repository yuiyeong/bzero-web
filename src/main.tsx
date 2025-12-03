import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client.ts";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "@/App.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {import.meta.env.DEV ? <ReactQueryDevtools /> : null}
      <App />
      <Toaster position="top-center" />
    </QueryClientProvider>
  </StrictMode>
);
