import { useCallback, useEffect, useState } from "react";
import { canShowAddToHomeScreen, detectBrowser, type BrowserType } from "@/lib/device.ts";

const STORAGE_KEY = "b0-add-to-home-dismissed";

interface UseAddToHomeScreenReturn {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 현재 브라우저 유형 */
  browserType: BrowserType;
  /** 모달 닫기 (일시적) */
  handleClose: () => void;
  /** "다시 보지 않기" 처리 */
  handleDismissForever: () => void;
}

/**
 * 홈화면 추가 안내 모달의 표시 여부와 상태를 관리하는 훅
 *
 * - 모바일 브라우저(iOS Safari, Android Chrome)에서만 동작
 * - standalone 모드(홈화면에서 실행)이면 표시하지 않음
 * - "다시 보지 않기" 선택 시 localStorage에 저장
 */
export function useAddToHomeScreen(): UseAddToHomeScreenReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [browserType, setBrowserType] = useState<BrowserType>("other");

  useEffect(() => {
    // 브라우저 유형 감지
    const browser = detectBrowser();
    setBrowserType(browser);

    // localStorage에서 "다시 보지 않기" 설정 확인
    const isDismissed = (() => {
      try {
        return localStorage.getItem(STORAGE_KEY) === "true";
      } catch {
        // Private browsing 모드에서 localStorage 접근 실패 시
        return false;
      }
    })();

    // 조건 체크: 모바일 브라우저이고, standalone이 아니고, dismissed가 아니면 표시
    if (canShowAddToHomeScreen() && !isDismissed) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleDismissForever = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Private browsing 모드에서 localStorage 접근 실패 시 무시
    }
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    browserType,
    handleClose,
    handleDismissForever,
  };
}
