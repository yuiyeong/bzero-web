/**
 * 사랑방 페이지 - 단체 채팅
 */
import img_bg_living_room from "@/assets/images/img_bg_living_room.webp";
import { ChatRoom } from "@/components/chat/chat-room.tsx";
import { useCurrentRoomStay } from "@/hooks/queries/use-current-room-stay.ts";
import GlobalLoader from "@/components/global-loader.tsx";

export default function LivingRoomPage() {
  const { data: roomStay, isLoading, isError } = useCurrentRoomStay();

  // --------------------------------------------------------
  // 로딩 상태
  // --------------------------------------------------------
  if (isLoading) {
    return <GlobalLoader />;
  }

  // --------------------------------------------------------
  // 에러 상태
  // --------------------------------------------------------
  if (isError || !roomStay) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center">
        <p className="text-red-400">
          체류 정보를 불러올 수 없습니다.
          <br />
          게스트하우스로 돌아가 주세요.
        </p>
      </div>
    );
  }

  // --------------------------------------------------------
  // 채팅방 렌더링
  // --------------------------------------------------------
  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* 배경 이미지 */}
      <img className="absolute inset-0 h-full w-full object-cover" src={img_bg_living_room} alt="사랑방 배경" />
      <div className="absolute inset-0 bg-black/75" />

      {/* 채팅방 */}
      <div className="relative z-10 flex h-full min-h-0 flex-col">
        <ChatRoom roomId={roomStay.room_id} cityId={roomStay.city_id} />
      </div>
    </div>
  );
}
