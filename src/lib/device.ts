/**
 * 브라우저 유형
 */
export type BrowserType = "ios-safari" | "android-chrome" | "other";

/**
 * 현재 브라우저 유형을 감지합니다.
 *
 * - iOS Safari: iPad, iPhone, iPod에서 Safari 브라우저
 * - Android Chrome: Android에서 Chrome 브라우저
 * - other: 그 외 모든 브라우저 (데스크톱, iOS Chrome 등)
 */
export function detectBrowser(): BrowserType {
  if (typeof navigator === "undefined") {
    return "other";
  }

  const ua = navigator.userAgent;

  // iOS Safari 감지
  // - iOS 디바이스인지 확인 (iPad, iPhone, iPod)
  // - Safari이면서 Chrome이 아닌지 확인 (iOS Chrome은 CriOS로 표시됨)
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !("MSStream" in window);
  const isSafari = /Safari/.test(ua) && !/CriOS|Chrome/.test(ua);
  if (isIOS && isSafari) {
    return "ios-safari";
  }

  // Android Chrome 감지
  const isAndroid = /Android/.test(ua);
  const isChrome = /Chrome/.test(ua) && !/Edge|Edg/.test(ua);
  if (isAndroid && isChrome) {
    return "android-chrome";
  }

  return "other";
}

/**
 * 앱이 standalone 모드(홈화면에서 실행)인지 확인합니다.
 */
export function isStandaloneMode(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  // iOS Safari standalone 체크
  if ("standalone" in window.navigator) {
    return (window.navigator as Navigator & { standalone: boolean }).standalone === true;
  }

  // Android Chrome (display-mode: standalone 체크)
  return window.matchMedia("(display-mode: standalone)").matches;
}

/**
 * 모바일 브라우저에서 홈화면 추가가 가능한 환경인지 확인합니다.
 *
 * 조건:
 * - iOS Safari 또는 Android Chrome
 * - standalone 모드가 아님 (이미 홈화면에서 실행 중이 아님)
 */
export function canShowAddToHomeScreen(): boolean {
  const browser = detectBrowser();
  return browser !== "other" && !isStandaloneMode();
}
