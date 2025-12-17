import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton.tsx";
import type { Airship } from "@/types.ts";

interface AirshipSelectorProps {
  airships: Airship[];
  selectedAirshipId: string | null;
  baseCostPoints: number;
  onSelectAirship: (airshipId: string) => void;
}

/**
 * 비행선 종류 선택 컴포넌트
 *
 * 비행선 목록에서 원하는 비행선을 선택
 */
export function AirshipSelector({
  airships,
  selectedAirshipId,
  baseCostPoints,
  onSelectAirship,
}: AirshipSelectorProps) {
  return (
    <div className="mb-6">
      <h3 className="mb-3 text-base font-semibold text-white">티켓 선택</h3>
      <div className="space-y-3">
        {airships.map((airship) => {
          const price = baseCostPoints * airship.cost_factor;
          const isSelected = selectedAirshipId === airship.airship_id;

          return (
            <button
              key={airship.airship_id}
              onClick={() => onSelectAirship(airship.airship_id)}
              className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                isSelected ? "border-b0-purple bg-b0-purple/10" : "border-border bg-b0-card-navy hover:border-zinc-600"
              }`}
            >
              <div
                className={`h-5 w-5 shrink-0 rounded-full border-2 transition-all ${
                  isSelected ? "border-b0-purple bg-b0-purple" : "border-zinc-600"
                }`}
              >
                {isSelected && (
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                )}
              </div>
              {airship.image_url ? (
                <ImageWithSkeleton
                  src={airship.image_url}
                  alt={airship.name}
                  className="h-12 w-12 shrink-0 rounded-lg"
                  fallback={<span className="text-2xl">🚀</span>}
                />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-zinc-700">
                  <span className="text-2xl">🚀</span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-white">{airship.name}</h3>
                {airship.description && <p className="text-sm text-zinc-400">{airship.description}</p>}
              </div>
              <div className="text-b0-light-purple font-semibold">{price}P</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
