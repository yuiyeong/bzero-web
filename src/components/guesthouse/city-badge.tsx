import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton.tsx";
import type { City } from "@/types.ts";

interface CityBadgeProps {
  /** 도시 정보 */
  city: City;
}

/**
 * 게스트하우스 거실에서 현재 체류 중인 도시 정보를 표시하는 배지 컴포넌트
 *
 * - 도시 이미지 (city.image_url)
 * - 도시명
 * - 체크아웃 예정 시간
 */
export function CityBadge({ city }: CityBadgeProps) {
  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-3">
      {/* 도시 이미지 */}
      <ImageWithSkeleton
        src={city.image_url || ""}
        alt={city.name}
        className="h-16 w-16 rounded-full"
        fallback={<span className="text-xl">🏙️</span>}
      />
      <h3 className="text-xl font-semibold">{city.name}</h3>
      <p className="text-center text-sm">{city.description}</p>
    </div>
  );
}
