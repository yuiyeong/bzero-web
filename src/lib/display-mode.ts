/**
 * 디스플레이 모드 및 플랫폼 감지 유틸리티
 */

interface NavigatorWithStandalone extends Navigator {
    standalone?: boolean;
}

/**
 * 현재 앱이 어떤 모드로 실행 중인지 확인
 *
 * @returns 'standalone' (홈 화면 실행) | 'browser' (브라우저 실행)
 */
export function getDisplayMode(): "standalone" | "browser" {
    // 1. Standard (Android, Desktop Chrome)
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

    // 2. iOS Safari (Legacy but required)
    const isIOSStandalone = (window.navigator as NavigatorWithStandalone).standalone === true;

    return isStandalone || isIOSStandalone ? "standalone" : "browser";
}

/**
 * 현재 플랫폼 감지
 *
 * @returns 'ios' | 'android' | 'web'
 */
export function getPlatform(): string {
    // 1. Modern: Client Hints (Chrome, Android, Edge)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nav = navigator as any;

    if (nav.userAgentData?.platform) {
        const p = nav.userAgentData.platform.toLowerCase();
        if (p.includes("android")) return "android";
        if (p.includes("ios") || p.includes("mac")) return "ios"; // iPadOS might report as macOS
        return "web";
    }

    // 2. Fallback: User Agent (iOS Safari, Firefox)
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) return "ios";
    if (ua.includes("android")) return "android";

    // Mac에서 터치 포인트가 있으면 iPad로 간주 (iPadOS 13+)
    if (ua.includes("mac") && navigator.maxTouchPoints > 1) return "ios";

    return "web";
}
