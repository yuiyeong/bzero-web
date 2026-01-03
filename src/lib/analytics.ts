/**
 * Google Analytics 이벤트 추적 유틸리티
 *
 * GA4 gtag.js를 사용하여 사용자 행동 이벤트를 추적합니다.
 * index.html에 gtag.js 스크립트가 로드되어 있어야 합니다.
 */

type GtagEventParams = Record<string, string | number | boolean | undefined>;

/**
 * GA4 커스텀 이벤트 전송
 *
 * @param eventName - 이벤트 이름 (예: 'button_click', 'ticket_purchase')
 * @param params - 이벤트 파라미터 (예: { button_name: '구매하기', city: '세렌시아' })
 *
 * @example
 * // 버튼 클릭 이벤트
 * trackEvent('button_click', { button_name: '비행선 티켓 구매', city: '세렌시아' });
 *
 * @example
 * // 페이지 조회 이벤트 (SPA 라우트 변경 시)
 * trackEvent('page_view', { page_title: '터미널', page_path: '/terminal' });
 */
export function trackEvent(eventName: string, params?: GtagEventParams): void {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

/**
 * 버튼 클릭 이벤트 전송
 *
 * @param buttonName - 버튼 이름/식별자
 * @param additionalParams - 추가 파라미터
 *
 * @example
 * trackButtonClick('ticket_purchase', { city: '세렌시아', airship_type: '쾌속' });
 */
export function trackButtonClick(buttonName: string, additionalParams?: GtagEventParams): void {
  trackEvent("button_click", {
    button_name: buttonName,
    ...additionalParams,
  });
}

/**
 * 페이지 조회 이벤트 전송 (SPA 라우트 변경 시 사용)
 *
 * @param pageTitle - 페이지 제목
 * @param pagePath - 페이지 경로
 *
 * @example
 * trackPageView('터미널', '/terminal');
 */
export function trackPageView(pageTitle: string, pagePath: string): void {
  trackEvent("page_view", {
    page_title: pageTitle,
    page_path: pagePath,
  });
}
