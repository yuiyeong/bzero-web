/**
 * 도시별 테마 설정
 *
 * 도시 이름을 키로 하여 아이콘과 그라데이션 클래스를 매핑합니다.
 */

/** 도시별 그라데이션 클래스 */
export const CITY_GRADIENTS: Record<string, string> = {
  세렌시아: "from-[#f97316] to-[#fbbf24]",
  로렌시아: "from-[#22c55e] to-[#16a34a]",
  엠마시아: "from-[#facc15] to-[#fde68a]",
  다마린: "from-[#3b82f6] to-[#60a5fa]",
  갈리시아: "from-[#a855f7] to-[#c084fc]",
};

/**
 * 도시 이름으로 그라데이션 클래스를 가져옵니다
 *
 * @param cityName - 도시 이름
 * @returns 해당 도시의 그라데이션 클래스 (없으면 기본 그라데이션)
 */
export function getCityGradient(cityName: string): string {
  return CITY_GRADIENTS[cityName] || "from-purple-600 to-purple-400";
}
