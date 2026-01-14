import { Navigate, Outlet, useLocation } from "react-router";
import { useCurrentRoomStay } from "@/hooks/queries/use-current-room-stay.ts";
import { useBoardingTicket } from "@/hooks/queries/use-boarding-ticket.ts";
import GlobalLoader from "@/components/global-loader.tsx";
import { buildPath, ROUTES } from "@/lib/routes.ts";

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
  const isOnTravelPage = location.pathname === ROUTES.BOARDING || location.pathname === ROUTES.CHECK_IN;

  if (isLoading) {
    // BOARDING이나 CHECK_IN 경로에 있으면 해당 페이지가 자체 로딩 UI를 처리
    if (isOnTravelPage) {
      return <Outlet />;
    }
    return <GlobalLoader />;
  }

  // 1. 체크인 중인 체류가 있으면 → 게스트하우스 페이지로 리다이렉트
  if (roomStay && !isRoomStayError) {
    const guesthousePath = buildPath.guesthouse(roomStay.guest_house_id);
    if (!location.pathname.startsWith(guesthousePath)) {
      return <Navigate to={guesthousePath} replace />;
    }
  }

  // 2. 탑승 상태 처리
  if (ticket && !isTicketError) {
    const arrivalTime = new Date(ticket.arrival_datetime).getTime();
    const isArrived = Date.now() >= arrivalTime;

    if (isArrived) {
      // 도착 시간 지남 → 체크인 페이지로
      if (location.pathname !== ROUTES.CHECK_IN) {
        return <Navigate to={ROUTES.CHECK_IN} state={{ cityName: ticket.city.name }} replace />;
      }
    } else {
      // 아직 비행 중 → 탑승 페이지로
      if (location.pathname !== ROUTES.BOARDING) {
        return <Navigate to={ROUTES.BOARDING} replace />;
      }
    }
  } else if (isOnTravelPage) {
    // 탑승 중이 아닌데 /boarding 또는 /check-in에 있으면 → 홈으로 리다이렉트
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // 3. 둘 다 아니면 → 자식 라우트 렌더링
  return <Outlet />;
}
