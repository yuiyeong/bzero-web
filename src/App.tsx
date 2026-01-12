import { router } from "@/root-route.tsx";
import { RouterProvider } from "react-router";
import AuthSessionProvider from "@/providers/auth-session-provider.tsx";
import { useEffect } from "react";
import { trackAppLaunch } from "@/lib/analytics.ts";
import { getDisplayMode, getPlatform } from "@/lib/display-mode.ts";

export default function App() {
  useEffect(() => {
    // 앱 실행 시 Display Mode 및 Platform 추적
    const mode = getDisplayMode();
    const platform = getPlatform();
    trackAppLaunch(mode, platform);
  }, []);

  return (
    <AuthSessionProvider>
      <RouterProvider router={router} />
    </AuthSessionProvider>
  );
}
