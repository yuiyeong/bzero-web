import type { AirshipType } from "@/lib/airship.ts";
import { AIRSHIP_OPTIONS } from "@/lib/airship.ts";

interface AirshipSelectorProps {
  selectedType: AirshipType;
  onSelectType: (type: AirshipType) => void;
}

/**
 * 비행선 종류 선택 컴포넌트
 *
 * 일반 비행선과 쾌속 비행선 중 선택
 */
export function AirshipSelector({ selectedType, onSelectType }: AirshipSelectorProps) {
  return (
    <div className="mb-6">
      <h3 className="mb-3 text-base font-semibold text-white">티켓 선택</h3>
      <div className="space-y-3">
        {AIRSHIP_OPTIONS.map((option) => (
          <button
            key={option.type}
            onClick={() => onSelectType(option.type)}
            className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-all ${
              selectedType === option.type
                ? "border-b0-purple bg-b0-purple/10"
                : "border-border bg-b0-card-navy hover:border-zinc-600"
            }`}
          >
            <div
              className={`h-5 w-5 rounded-full border-2 transition-all ${
                selectedType === option.type ? "border-b0-purple bg-b0-purple" : "border-zinc-600"
              }`}
            >
              {selectedType === option.type && (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">{option.name}</h3>
              <p className="text-sm text-zinc-400">{option.duration}</p>
            </div>
            <div className="text-b0-light-purple font-semibold">{option.price}P</div>
          </button>
        ))}
      </div>
    </div>
  );
}
