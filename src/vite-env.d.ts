/// <reference types="vite/client" />

/**
 * Google Analytics gtag.js 전역 타입 정의
 */
interface Window {
  gtag?: (
    command: "event" | "config" | "js" | "set",
    targetId: string | Date,
    params?: Record<string, unknown>
  ) => void;
  dataLayer?: unknown[];
}
