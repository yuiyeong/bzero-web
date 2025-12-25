import img_bg_lounge from "@/assets/images/img_bg_lounge.webp";

export default function LoungePage() {
  return (
    <div className="relative flex h-full flex-col items-center justify-center">
      <img className="absolute inset-0 h-full w-full object-cover" src={img_bg_lounge} alt="라운지 배경" />
      <div className="absolute inset-0 bg-black/75" />
      <div className="absolute inset-0 z-10">라운지</div>
    </div>
  );
}
