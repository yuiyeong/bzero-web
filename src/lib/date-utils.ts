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

/**
 * 채팅 메시지 시간 포맷팅
 *
 * @param dateString - ISO 8601 형식 날짜 문자열
 * @returns 포맷된 시간 문자열
 *   - 오늘: "오전 10:30"
 *   - 어제: "어제 오후 3:45"
 *   - 그 외: "12월 25일 오전 9:00"
 */
export function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  const timeStr = date.toLocaleTimeString("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (date >= today) {
    return timeStr;
  } else if (date >= yesterday) {
    return `어제 ${timeStr}`;
  } else {
    const dateStr = date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
    });
    return `${dateStr} ${timeStr}`;
  }
}
