import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton.tsx";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AirshipSnapshot, CitySnapshot } from "@/types.ts";

interface TicketCardProps {
  /** 티켓 번호 */
  ticketNumber: string;
  /** 도착 도시 정보 */
  city: CitySnapshot;
  /** 비행선 정보 */
  airship: AirshipSnapshot;
  /** 도착 일시 (ISO 8601) */
  arrivalDatetime: string;
  /** 도착 시 호출되는 콜백 */
  onArrival?: () => void;
}

/**
 * 탑승 중인 티켓 정보를 표시하는 카드 컴포넌트
 *
 * 와이어프레임 3.8 기반 디자인:
 * - 비행선 아이콘, 티켓 번호
 * - 경로 (B0 → 도시명)
 * - 도착까지 카운트다운
 */
export function TicketCard({ ticketNumber, city, airship, arrivalDatetime, onArrival }: TicketCardProps) {
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const hasArrivedRef = useRef(false);

  // 도착 처리 함수 (중복 호출 방지)
  const handleArrival = useCallback(() => {
    if (hasArrivedRef.current) return;
    hasArrivedRef.current = true;
    onArrival?.();
  }, [onArrival]);

  // 카운트다운 타이머
  useEffect(() => {
    const arrivalTime = new Date(arrivalDatetime).getTime();

    // 도착 시간 체크 함수
    const checkArrival = () => {
      const now = Date.now();
      const remaining = Math.max(0, arrivalTime - now);
      setRemainingTime(remaining);

      if (remaining <= 0) {
        handleArrival();
        return true;
      }
      return false;
    };

    // 초기 체크 - 이미 도착 시간이 지났으면 즉시 콜백 호출
    if (checkArrival()) {
      return;
    }

    // 1초마다 타이머 업데이트
    const timer = setInterval(() => {
      if (checkArrival()) {
        clearInterval(timer);
      }
    }, 1000);

    // 백그라운드에서 돌아왔을 때 도착 시간 체크
    // iOS Safari에서 긴 백그라운드 후 setInterval이 frozen될 수 있으므로 필요
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkArrival();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [arrivalDatetime, handleArrival]);

  const formattedTime = formatTime(remainingTime);

  return (
    <div className="glass mx-4 rounded-2xl p-6 text-center">
      {/* 비행선 이미지 */}
      <div className="mx-auto mb-2 flex h-32 w-32 items-center justify-center">
        {airship.image_url ? (
          <ImageWithSkeleton
            src={airship.image_url}
            alt={airship.name}
            className="h-32 w-32 rounded-xl object-contain"
            fallback={<span className="text-7xl">✈️</span>}
          />
        ) : (
          <span className="text-7xl">✈️</span>
        )}
      </div>

      {/* 티켓 번호 (앞 7자리만 표시) */}
      <p className="text-sm text-zinc-400">{ticketNumber.slice(0, 7)}</p>

      {/* 점선 구분선 */}
      <div className="my-4 border-t border-dashed border-zinc-600" />

      {/* 경로 표시 */}
      <div className="flex items-center justify-center gap-4">
        <span className="text-lg font-semibold">B0</span>
        <span className="text-xl text-zinc-500">→</span>
        <span className="text-lg font-semibold text-purple-400">{city.name}</span>
      </div>

      {/* 점선 구분선 */}
      <div className="my-4 border-t border-dashed border-zinc-600" />

      {/* 카운트다운 */}
      <p className="mb-1 text-sm text-zinc-400">도착까지</p>
      <p className="text-4xl font-bold tracking-wider tabular-nums">{formattedTime}</p>
    </div>
  );
}

/**
 * 밀리초를 hh:mm:ss 형식으로 변환
 */
function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
