/**
 * 날짜/시간 포맷팅 유틸리티 함수 모음
 */

/**
 * 체크아웃 시간을 사용자 친화적인 형식으로 포맷팅
 *
 * - 내일인 경우: "내일 14:00"
 * - 그 외: "1/15 14:00"
 *
 * @param datetime - ISO 8601 형식의 날짜/시간 문자열
 * @returns 포맷팅된 체크아웃 시간 문자열
 */
export function formatCheckoutTime(datetime: string): string {
  const checkout = new Date(datetime);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const hours = checkout.getHours().toString().padStart(2, "0");
  const minutes = checkout.getMinutes().toString().padStart(2, "0");
  const time = `${hours}:${minutes}`;

  // 내일인지 확인
  if (checkout.toDateString() === tomorrow.toDateString()) {
    return `내일 ${time}`;
  }

  // 그 외 날짜
  const month = checkout.getMonth() + 1;
  const day = checkout.getDate();
  return `${month}/${day} ${time}`;
}
