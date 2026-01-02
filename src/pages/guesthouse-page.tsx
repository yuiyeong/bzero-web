import { Button } from "@/components/ui/button.tsx";
import { CityBadge } from "@/components/guesthouse/city-badge.tsx";
import { SpaceList } from "@/components/guesthouse/space-list.tsx";
import GlobalLoader from "@/components/global-loader.tsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useCurrentRoomStay } from "@/hooks/queries/use-current-room-stay.ts";
import { useCity } from "@/hooks/queries/use-city.ts";
import { ROUTES } from "@/lib/routes.ts";

import { formatCheckoutTime } from "@/lib/date-utils.ts";
import ExtendStayModal from "@/components/ExtendStayModal";

import img_bg_city from "@/assets/images/img_bg_city.webp";

/**
 * 게스트하우스 거실 (체류 중) 화면
 *
 * - 현재 체류 중인 도시 정보 표시
 * - 게스트하우스 내 공간 선택 (사랑방, 라운지, 개인 숙소)
 * - 체류 연장 버튼 (MVP에서는 "준비 중" 표시)
 * - 체류 정보가 없으면 홈으로 리다이렉트
 */
export default function GuesthousePage() {
  const navigate = useNavigate();
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);

  // 현재 체류 정보 조회
  const { data: roomStay, isLoading: isRoomStayLoading, isError: isRoomStayError } = useCurrentRoomStay();

  // 도시 정보 조회 (체류 정보가 있을 때만)
  const { data: city, isLoading: isCityLoading } = useCity(roomStay?.city_id, {
    enabled: !!roomStay?.city_id,
  });

  // 체류 정보가 없으면 홈으로 리다이렉트
  useEffect(() => {
    // 에러가 발생했거나, 로딩이 끝났는데 데이터가 없는 경우 홈으로 이동
    if (isRoomStayError || (!isRoomStayLoading && !roomStay)) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isRoomStayError, isRoomStayLoading, roomStay, navigate]);

  // 연장하기 버튼 핸들러
  const handleExtendClick = () => {
    setIsExtendModalOpen(true);
  };

  // 로딩 중
  const isLoading = isRoomStayLoading || isCityLoading;
  if (isLoading) {
    return <GlobalLoader />;
  }

  // 데이터가 없는 경우 (리다이렉트 전까지 빈 화면)
  if (!roomStay || !city) {
    return null;
  }

  return (
    <div className="relative h-full w-full">
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src={img_bg_city}
        alt="게스트 하우스의 도시 배경 이미지"
      />
      <div className="absolute inset-0 bg-black/75" />

      <div className="absolute inset-0 flex flex-col pt-32 pb-16">
        {/* 메인 콘텐츠 */}
        <div className="flex flex-1 flex-col px-6">
          {/* 도시 배지 */}
          <div className="mb-16">
            <CityBadge city={city} />
          </div>

          {/* 환영 메시지 */}
          <p className="text-primary-300 text-center text-xl">Welcome!</p>
          <p className="text-primary-300 text-center text-xs">
            체크아웃: {formatCheckoutTime(roomStay.scheduled_check_out_at)}
          </p>

          {/* 공간 목록 */}
          <SpaceList />
        </div>

        {/* 하단 연장 버튼 */}
        <Button variant="link" onClick={handleExtendClick}>
          연장하기 300P
        </Button>
      </div>

      <ExtendStayModal
        open={isExtendModalOpen}
        onOpenChange={setIsExtendModalOpen}
        currentCheckOut={roomStay.scheduled_check_out_at}
      />
    </div>
  );
}
