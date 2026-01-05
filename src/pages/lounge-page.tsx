import { useCurrentRoomStay } from "@/hooks/queries/use-current-room-stay";
import { useRoomMembers } from "@/hooks/queries/use-room-members";
import { useMyDMRooms } from "@/hooks/queries/use-dm";
import { useMe } from "@/hooks/queries/use-me";
import TravelerItem from "@/components/lounge/TravelerItem";
import GlobalLoader from "@/components/global-loader.tsx";
import { useLoungeSocket } from "@/hooks/use-lounge-socket";
import bgLounge from "@/assets/images/img_bg_lounge.webp";

export default function LoungePage() {
  // cityId param not used for logic, relying on currentRoomStay

  // 0. Socket Connection for Notifications
  useLoungeSocket();

  // 1. 데이터 Fetching
  const { data: me } = useMe();
  const { data: roomStay, isLoading: isLoadingStay } = useCurrentRoomStay();
  const { data: members, isLoading: isLoadingMembers } = useRoomMembers(roomStay?.room_id, {
    enabled: !!roomStay?.room_id,
  });
  const { data: dmRoomsResponse, isLoading: isLoadingDMRooms } = useMyDMRooms();

  // 2. 로딩 상태
  if (isLoadingStay || isLoadingMembers || isLoadingDMRooms || !me || !roomStay) {
    return <GlobalLoader />;
  }

  // 3. 필터링 (나 자신 제외)
  const otherTravelers = members?.filter((u) => u.user_id !== me.user_id) || [];
  const dmRooms = dmRoomsResponse?.list || [];

  return (
    <div className="relative h-full bg-cover bg-center" style={{ backgroundImage: `url(${bgLounge})` }}>
      <div className="absolute inset-0 bg-black/60" />

      {/* Content Wrapper */}
      <div className="relative z-10 flex h-full flex-col overflow-hidden">
        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-4">
            <p className="text-muted-foreground text-sm">
              같은 게스트하우스 여행자
              {otherTravelers.length > 0 && (
                <span className="text-primary ml-1 font-medium">{otherTravelers.length}명</span>
              )}
            </p>
          </div>

          {otherTravelers.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 text-4xl">😴</div>
              <p className="text-muted-foreground">아직 다른 여행자가 없어요</p>
            </div>
          ) : (
            /* Traveler List */
            <div className="space-y-1">
              {otherTravelers.map((user) => (
                <TravelerItem key={user.user_id} me={me} targetUser={user} dmRooms={dmRooms} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
