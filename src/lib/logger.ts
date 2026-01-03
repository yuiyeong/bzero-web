/**
 * 개발 환경 전용 로거 유틸리티
 *
 * 프로덕션 환경에서는 로그를 출력하지 않음
 */

const isDev = true;

/**
 * 개발 환경에서만 console.log 출력
 */
export function log(...args: unknown[]): void {
  if (isDev) {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
}

/**
 * 개발 환경에서만 console.warn 출력
 */
export function warn(...args: unknown[]): void {
  if (isDev) {
    console.warn(...args);
  }
}

/**
 * 개발 환경에서만 console.error 출력
 */
export function error(...args: unknown[]): void {
  if (isDev) {
    console.error(...args);
  }
}

/**
 * 개발 환경 전용 로거 객체
 */
export const logger = {
  log,
  warn,
  error,
} as const;
