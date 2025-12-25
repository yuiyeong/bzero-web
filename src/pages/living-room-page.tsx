import img_bg_living_room from "@/assets/images/img_bg_living_room.webp";

export default function LivingRoomPage() {
  return (
    <div className="relative flex h-full flex-col items-center justify-center">
      <img className="absolute inset-0 h-full w-full object-cover" src={img_bg_living_room} alt="사랑방 배경" />
      <div className="absolute inset-0 bg-black/75" />
      <div className="absolute inset-0 z-10">사랑방</div>
    </div>
  );
}
