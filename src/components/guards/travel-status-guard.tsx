import { Navigate, Outlet, useLocation } from "react-router";
import { useCurrentRoomStay } from "@/hooks/queries/use-current-room-stay.ts";
import { useBoardingTicket } from "@/hooks/queries/use-boarding-ticket.ts";
import GlobalLoader from "@/components/global-loader.tsx";
import { ROUTES } from "@/lib/routes.ts";

/**
 * 사용자의 여행 상태에 따라 적절한 페이지로 라우팅하는 가드 컴포넌트
 *
 * 처리 흐름:
 * 1. 체크인 중인 체류가 있으면 → 게스트하우스 페이지로 리다이렉트
 * 2. 탑승 중인 티켓이 있으면 → 탑승 화면으로 리다이렉트
 * 3. 둘 다 아니면 → 자식 라우트 렌더링 (홈/터미널)
 */
export default function TravelStatusGuard() {
  const location = useLocation();

  const { data: roomStay, isLoading: isRoomStayLoading, isError: isRoomStayError } = useCurrentRoomStay();

  const { data: ticket, isLoading: isTicketLoading, isError: isTicketError } = useBoardingTicket();

  // 로딩 중
  const isLoading = isRoomStayLoading || isTicketLoading;
  if (isLoading) return <GlobalLoader />;

  // 1. 체크인 중인 체류가 있으면 → 게스트하우스 페이지로 리다이렉트
  if (roomStay && !isRoomStayError) {
    const guesthousePath = ROUTES.GUESTHOUSE.replace(":guesthouseId", roomStay.guest_house_id);
    if (location.pathname !== guesthousePath) {
      return <Navigate to={guesthousePath} replace />;
    }
  }

  // 2. 탑승 상태 처리
  if (ticket && !isTicketError) {
    // 탑승 중인데 /boarding이 아니면 → 탑승 화면으로 리다이렉트
    if (location.pathname !== ROUTES.BOARDING) {
      return <Navigate to={ROUTES.BOARDING} replace />;
    }
  } else {
    // 탑승 중이 아닌데 /boarding에 있으면 → 홈으로 리다이렉트
    if (location.pathname === ROUTES.BOARDING) {
      return <Navigate to={ROUTES.HOME} replace />;
    }
  }

  // 3. 둘 다 아니면 → 자식 라우트 렌더링
  return <Outlet />;
}
