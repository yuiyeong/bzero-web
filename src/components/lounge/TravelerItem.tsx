import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAcceptDM, useRequestDM } from "@/hooks/queries/use-dm";
import type { DirectMessageRoom, User } from "@/types";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";

interface TravelerItemProps {
  me: User;
  targetUser: User;
  dmRooms: DirectMessageRoom[];
}

export default function TravelerItem({ me, targetUser, dmRooms }: TravelerItemProps) {
  const navigate = useNavigate();
  const { mutate: requestDM, isPending: isRequesting } = useRequestDM();
  const { mutate: acceptDM, isPending: isAccepting } = useAcceptDM();

  // 1. 나와 이 사람 사이의 DM 방 찾기
  const myRoom = dmRooms.find(
    (r) =>
      (r.requester_id === me.user_id && r.receiver_id === targetUser.user_id) ||
      (r.requester_id === targetUser.user_id && r.receiver_id === me.user_id)
  );

  // 2. 상태에 따른 UI 렌더링
  const renderAction = () => {
    if (!myRoom) {
      // 대화 없음 -> 신청 가능
      return (
        <Button
          size="sm"
          variant="secondary"
          className="h-8 px-4 text-xs font-medium"
          onClick={() => requestDM(targetUser.user_id)}
          disabled={isRequesting}
        >
          {isRequesting ? "신청 중..." : "대화 신청"}
        </Button>
      );
    }

    if (myRoom.status === "pending") {
      // 대기 중
      const iAmSender = myRoom.requester_id === me.user_id;

      if (iAmSender) {
        // 내가 보냄 -> 대기 중 표시 (+ 취소?)
        return (
          <div className="flex flex-col items-end">
            <span className="text-primary mb-1 text-xs font-medium">응답을 기다리는 중...</span>
            {/* 취소 기능은 API가 있다면 추가. 현재는 표시만 */}
          </div>
        );
      } else {
        // 내가 받음 -> 수락만 가능 (거절 삭제)
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 px-3 text-xs"
              onClick={() => {
                acceptDM(myRoom.dm_room_id, {
                  onSuccess: () => {
                    navigate(`/chat/${myRoom.dm_room_id}`);
                  },
                });
              }}
              disabled={isAccepting}
            >
              수락
            </Button>
          </div>
        );
      }
    }

    if (myRoom.status === "accepted" || myRoom.status === "active") {
      // 대화 가능
      return (
        <Button
          size="sm"
          className="bg-foreground text-background hover:bg-foreground/90 h-8 px-4 text-xs"
          onClick={() => navigate(`/chat/${myRoom.dm_room_id}`)}
        >
          대화하기
        </Button>
      );
    }

    if (myRoom.status === "rejected") {
      // 거절됨 (재신청 불가 기간 등의 로직이 있을 수 있음)
      // Note: 거절 기능 제거로 인해 이 상태에 도달할 일은 없으나,
      // 기존 데이터가 있을 수 있으므로 표시 로직은 유지하거나 제거.
      return <span className="text-muted-foreground text-xs">거절됨</span>;
    }

    return null;
  };

  return (
    <div
      className={cn(
        "border-border flex items-center justify-between border-b p-4 last:border-0",
        // 대기 중(내가 보낸 것)일 때 보더 색상 강조 (Wireframe 3.11 참고)
        myRoom?.status === "pending" &&
          myRoom.requester_id === me.user_id &&
          "border-primary/20 bg-primary/5 mb-2 rounded-lg border"
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="border-border h-10 w-10 border">
          <AvatarImage src={`/avatars/${targetUser.profile_emoji}.png`} /> {/* 이미지 경로는 예시 */}
          <AvatarFallback className="bg-muted text-muted-foreground text-lg">{targetUser.profile_emoji}</AvatarFallback>
        </Avatar>
        <div>
          <div className="text-foreground text-sm font-medium">{targetUser.nickname}</div>
          {/* 상태 메시지 등이 있다면 여기에 추가 */}
        </div>
      </div>

      {renderAction()}
    </div>
  );
}
