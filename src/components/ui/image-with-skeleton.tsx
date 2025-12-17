import { Skeleton } from "@/components/ui/skeleton.tsx";
import { type ReactNode, useState } from "react";
import { cn } from "@/lib/utils.ts";

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  /** 이미지 컨테이너에 적용할 클래스 */
  className?: string;
  /** 이미지 로드 실패 시 표시할 fallback (이모지 또는 ReactNode) */
  fallback?: ReactNode;
}

/**
 * 로딩 상태를 Skeleton으로 표시하는 이미지 컴포넌트
 *
 * - 이미지 로딩 중: Skeleton 표시
 * - 로딩 완료: 이미지 표시
 * - 로딩 실패: fallback 표시 (없으면 빈 상태)
 */
export function ImageWithSkeleton({ src, alt, className, fallback }: ImageWithSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError && fallback) {
    return <div className={cn("flex items-center justify-center bg-zinc-700", className)}>{fallback}</div>;
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && <Skeleton className="absolute inset-0 h-full w-full" />}
      <img
        src={src}
        alt={alt}
        className={cn("h-full w-full object-cover", isLoading ? "invisible" : "visible")}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
