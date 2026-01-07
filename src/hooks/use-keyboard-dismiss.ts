/**
 * 모바일 키보드 dismiss 처리를 위한 훅
 *
 * 메시지 전송 후 새로 생긴 자신의 메시지에 focus하여 키보드를 자동으로 내림.
 * iOS Safari, Android Chrome 등 모바일 브라우저에서 동작.
 *
 * @example
 * // 콜백 패턴 (MessageList가 내 메시지 감지)
 * const { scheduleKeyboardDismiss, dismissKeyboardIfScheduled } = useKeyboardDismiss();
 *
 * const handleLastOwnMessageRef = useCallback((ref: HTMLDivElement | null) => {
 *   dismissKeyboardIfScheduled(ref);
 * }, [dismissKeyboardIfScheduled]);
 *
 * <MessageList onLastOwnMessageRef={handleLastOwnMessageRef} />
 * <MessageInput onMessageSent={scheduleKeyboardDismiss} />
 *
 * @example
 * // 직접 감지 패턴 (페이지에서 직접 내 메시지 감지)
 * const { scheduleKeyboardDismiss, dismissKeyboardIfScheduled } = useKeyboardDismiss();
 * const lastOwnMessageRef = useRef<HTMLDivElement>(null);
 *
 * useEffect(() => {
 *   if (newOwnMessageDetected) {
 *     dismissKeyboardIfScheduled(lastOwnMessageRef.current);
 *   }
 * }, [newOwnMessageDetected, dismissKeyboardIfScheduled]);
 */
import { useCallback, useRef } from "react";

interface UseKeyboardDismissReturn {
  /**
   * 메시지 전송 완료 시 호출 - 다음 내 메시지에 focus 예약
   * MessageInput의 onMessageSent 콜백으로 전달
   */
  scheduleKeyboardDismiss: () => void;

  /**
   * 새 내 메시지가 감지되었을 때 호출
   * focus 예약이 되어 있으면 해당 요소에 focus하여 키보드를 내림
   */
  dismissKeyboardIfScheduled: (ref: HTMLDivElement | null) => void;
}

/**
 * 모바일 키보드 dismiss 처리를 위한 훅
 */
export function useKeyboardDismiss(): UseKeyboardDismissReturn {
  const shouldFocusNextRef = useRef(false);

  const scheduleKeyboardDismiss = useCallback(() => {
    shouldFocusNextRef.current = true;
  }, []);

  const dismissKeyboardIfScheduled = useCallback((ref: HTMLDivElement | null) => {
    if (ref && shouldFocusNextRef.current) {
      shouldFocusNextRef.current = false;
      requestAnimationFrame(() => {
        ref.focus({ preventScroll: true });
      });
    }
  }, []);

  return {
    scheduleKeyboardDismiss,
    dismissKeyboardIfScheduled,
  };
}
