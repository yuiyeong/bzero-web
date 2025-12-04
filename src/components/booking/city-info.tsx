import type { City } from "@/types.ts";

interface CityInfoProps {
  city: City;
  icon: string;
  gradient: string;
}

/**
 * 도시 정보 표시 컴포넌트
 *
 * 도시 아이콘, 이름, 테마, 설명을 표시
 */
export function CityInfo({ city, icon, gradient }: CityInfoProps) {
  return (
    <div className="mb-6 text-center">
      <div
        className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[20px] bg-gradient-to-br text-[40px] ${gradient}`}
      >
        {icon}
      </div>
      <h2 className="mb-1 text-2xl font-semibold text-white">{city.name}</h2>
      <p className="text-b0-light-purple mb-2 text-sm">{city.theme}</p>
      <p className="text-sm leading-relaxed text-zinc-400">
        {city.description || "노을빛 항구 마을에서\\n소중한 인연을 만나요"}
      </p>
    </div>
  );
}
