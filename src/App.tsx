import { router } from "@/root-route.tsx";
import { RouterProvider } from "react-router";
import AuthSessionProvider from "@/providers/auth-session-provider.tsx";
import { useEffect } from "react";
import { trackAppLaunch } from "@/lib/analytics.ts";
import { getDisplayMode, getPlatform } from "@/lib/display-mode.ts";
import ServiceTerminationPage from "@/pages/service-termination-page.tsx";


export default function App() {
  useEffect(() => {
    // 앱 실행 시 Display Mode 및 Platform 추적
    const mode = getDisplayMode();
    const platform = getPlatform();
    trackAppLaunch(mode, platform);
  }, []);

  // 서비스 종료 날짜: 2026년 2월 14일 00:00 KST
  const TERMINATION_DATE = new Date("2026-02-14T00:00:00+09:00");
  const now = new Date();

  if (now >= TERMINATION_DATE) {
    return <ServiceTerminationPage />;
  }

  return (
    <AuthSessionProvider>
      <RouterProvider router={router} />
    </AuthSessionProvider>
  );
}

