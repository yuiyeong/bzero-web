import { useOnboardingIsCompleted } from "@/stores/onboarding-store.ts";
import { Navigate, Outlet } from "react-router";

export default function OnboardingGuard() {
  const isOnboardingCompleted = useOnboardingIsCompleted();

  if (!isOnboardingCompleted) return <Navigate to="/onboarding" replace />;

  return <Outlet />;
}
