import { createBrowserRouter, Navigate } from "react-router";
import OnboardingPage from "@/pages/onboarding-page.tsx";
import SignInPage from "@/pages/sign-in-page.tsx";
import SignUpPage from "@/pages/sign-up-page.tsx";
import ProfileCompletionPage from "@/pages/profile-completion-page.tsx";
import IndexPage from "@/pages/index-page.tsx";
import TerminalPage from "@/pages/terminal-page.tsx";
import TicketBookingPage from "@/pages/ticket-booking-page.tsx";
import BoardingPage from "@/pages/boarding-page.tsx";
import GuesthousePage from "@/pages/guesthouse-page.tsx";
import MainLayout from "@/components/layout/main-layout.tsx";
import OnboardingGuard from "@/components/guards/onboarding-guard.tsx";
import GuestGuard from "@/components/guards/guest-guard.tsx";
import AuthGuard from "@/components/guards/auth-guard.tsx";
import TravelStatusGuard from "@/components/guards/travel-status-guard.tsx";
import AuthPage from "@/pages/auth-page.tsx";
import EmailVerificationPage from "@/pages/email-verification-page.tsx";
import EmailConfirmedPage from "@/pages/email-confirmed-page.tsx";
import { ROUTES } from "@/lib/routes.ts";
import LivingRoomPage from "@/pages/living-room-page.tsx";
import LoungePage from "@/pages/lounge-page.tsx";
import PrivateRoomPage from "@/pages/private-room-page.tsx";
import DiaryPage from "@/pages/diary-page.tsx";
import QuestionnairePage from "@/pages/questionnaire-page.tsx";
import DMRoomPage from "@/pages/dm-room-page.tsx";

export const router = createBrowserRouter([
  {
    path: ROUTES.ONBOARDING,
    element: <OnboardingPage />,
  },
  {
    element: <OnboardingGuard />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            element: <GuestGuard />,
            children: [
              {
                path: ROUTES.AUTH,
                element: <AuthPage />,
                handle: { title: "시작하기", isRoot: true },
              },
              {
                path: ROUTES.SIGN_IN,
                element: <SignInPage />,
                handle: { title: "로그인", isRoot: false },
              },
              {
                path: ROUTES.SIGN_UP,
                element: <SignUpPage />,
                handle: { title: "회원가입", isRoot: false },
              },
              {
                path: ROUTES.EMAIL_VERIFICATION,
                element: <EmailVerificationPage />,
                handle: { title: "이메일 확인", isRoot: true },
              },
            ],
          },
          {
            path: ROUTES.EMAIL_CONFIRMED,
            element: <EmailConfirmedPage />,
            handle: { title: "인증 완료", isRoot: true },
          },
          {
            element: <AuthGuard />,
            children: [
              // TravelStatusGuard 밖: 프로필 설정
              {
                path: ROUTES.PROFILE_COMPLETION,
                element: <ProfileCompletionPage />,
                handle: { title: "프로필 설정", isRoot: false },
              },
              // TravelStatusGuard 안: 여행 상태에 따라 리다이렉트
              {
                element: <TravelStatusGuard />,
                children: [
                  {
                    path: ROUTES.HOME,
                    element: <IndexPage />,
                    handle: { title: "홈", isRoot: true },
                  },
                  {
                    path: ROUTES.TERMINAL,
                    element: <TerminalPage />,
                    handle: { title: "B0 터미널", isRoot: true },
                  },
                  {
                    path: ROUTES.TICKET_BOOKING,
                    element: <TicketBookingPage />,
                    handle: { title: "비행선 예매", isRoot: false },
                  },
                  {
                    path: ROUTES.BOARDING,
                    element: <BoardingPage />,
                    handle: { title: "탑승중", isRoot: true },
                  },
                  {
                    path: ROUTES.LIVING_ROOM,
                    element: <LivingRoomPage />,
                    handle: { title: "사랑방", isRoot: false },
                  },
                  {
                    path: ROUTES.LOUNGE,
                    element: <LoungePage />,
                    handle: { title: "라운지", isRoot: false },
                  },
                  {
                    path: ROUTES.PRIVATE_ROOM,
                    element: <PrivateRoomPage />,
                    handle: { title: "개인 숙소", isRoot: false },
                  },
                  {
                    path: ROUTES.DIARY,
                    element: <DiaryPage />,
                    handle: { title: "일기장", isRoot: false },
                  },
                  {
                    path: ROUTES.QUESTIONNAIRE,
                    element: <QuestionnairePage />,
                    handle: { title: "문답지", isRoot: false },
                  },
                  {
                    path: ROUTES.GUESTHOUSE,
                    element: <GuesthousePage />,
                    handle: { title: "", isRoot: true },
                  },
                  {
                    path: "*",
                    element: <Navigate to={ROUTES.HOME} />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: ROUTES.CHAT,
        element: <DMRoomPage />,
        handle: { title: "1:1 대화", isRoot: false },
      },
    ],
  },
]);
