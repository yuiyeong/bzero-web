import { createBrowserRouter, Navigate } from "react-router";
import OnboardingPage from "@/pages/onboarding-page.tsx";
import SignInPage from "@/pages/sign-in-page.tsx";
import SignUpPage from "@/pages/sign-up-page.tsx";
import ProfilePage from "@/pages/profile-page.tsx";
import IndexPage from "@/pages/index-page.tsx";
import MainLayout from "@/components/layout/main-layout.tsx";
import OnboardingGuard from "@/components/guards/onboarding-guard.tsx";

export const router = createBrowserRouter([
  {
    path: "/onboarding",
    element: <OnboardingPage />,
  },
  {
    element: <OnboardingGuard />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/sign-in",
            element: <SignInPage />,
            handle: { title: "로그인" },
          },
          {
            path: "/sign-up",
            element: <SignUpPage />,
            handle: { title: "회원가입" },
          },
          {
            path: "/profile",
            element: <ProfilePage />,
            handle: { title: "프로필" },
          },
          {
            path: "/",
            element: <IndexPage />,
            handle: { title: "홈" },
          },
          {
            path: "*",
            element: <Navigate to="/" />,
          },
        ],
      },
    ],
  },
]);
