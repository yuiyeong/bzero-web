import type { City } from "@/types.ts";

interface CityInfoProps {
  city: City;
  gradient: string;
}

/**
 * 도시 정보 표시 컴포넌트
 *
 * 도시 아이콘, 이름, 테마, 설명을 표시
 */
export function CityInfo({ city, gradient }: CityInfoProps) {
  return (
    <div className="mb-6 text-center">
      {city.image_url ? (
        <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-[20px]">
          <img src={city.image_url} alt={`${city.name} 아이콘`} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div
          className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[20px] bg-gradient-to-br ${gradient}`}
        >
          <span className="text-[40px]">🏙️</span>
        </div>
      )}
      <h2 className="mb-1 text-2xl font-semibold text-white">{city.name}</h2>
      <p className="text-b0-light-purple mb-2 text-sm">{city.theme}</p>
      <p className="text-sm leading-relaxed text-zinc-400">
        {city.description || (
          <>
            노을빛 항구 마을에서
            <br />
            소중한 인연을 만나요
          </>
        )}
      </p>
    </div>
  );
}
