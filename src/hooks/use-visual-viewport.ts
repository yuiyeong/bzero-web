import { useEffect, useState } from "react";

export function useVisualViewport() {
  const [viewportHeight, setViewportHeight] = useState<number>(window.innerHeight);

  useEffect(() => {
    // 1. Check if Visual Viewport API is supported
    if (!window.visualViewport) {
      return;
    }

    const handleResize = () => {
      // 2. Update state with current visual viewport height
      if (window.visualViewport) {
        setViewportHeight(window.visualViewport.height);
      }
    };

    // Initial check
    handleResize();

    // 3. Add listener
    window.visualViewport.addEventListener("resize", handleResize);
    window.visualViewport.addEventListener("scroll", handleResize); // Scroll might affect layout too

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
        window.visualViewport.removeEventListener("scroll", handleResize);
      }
    };
  }, []);

  return viewportHeight;
}
