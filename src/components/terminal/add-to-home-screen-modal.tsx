import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { MoreVertical, Plus, Share } from "lucide-react";
import type { BrowserType } from "@/lib/device.ts";

interface AddToHomeScreenModalProps {
  /** 모달 열림 상태 */
  open: boolean;
  /** 모달 상태 변경 콜백 */
  onOpenChange: (open: boolean) => void;
  /** 브라우저 유형 (iOS Safari 또는 Android Chrome) */
  browserType: BrowserType;
  /** "다시 보지 않기" 버튼 클릭 콜백 */
  onDismissForever: () => void;
}

/**
 * 홈화면 추가 안내 모달 컴포넌트
 *
 * - iOS Safari: "공유 버튼 → 홈 화면에 추가" 안내
 * - Android Chrome: "메뉴 → 홈 화면에 추가" 안내
 */
export function AddToHomeScreenModal({ open, onOpenChange, browserType, onDismissForever }: AddToHomeScreenModalProps) {
  const isIOS = browserType === "ios-safari";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-b0-deep-navy border-zinc-800 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Plus className="text-b0-light-purple size-5" />홈 화면에 추가하기
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            B0를 홈 화면에 추가하면 더 빠르게 접속할 수 있어요.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4">
            {isIOS ? (
              <>
                {/* iOS Safari 안내 */}
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                    <span className="text-sm font-bold text-white">1</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">
                      하단의{" "}
                      <span className="inline-flex items-center gap-1 rounded bg-zinc-800 px-1.5 py-0.5">
                        <Share className="text-b0-light-purple size-4" />
                        공유
                      </span>{" "}
                      버튼을 탭하세요
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                    <span className="text-sm font-bold text-white">2</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">
                      <span className="inline-flex items-center gap-1 rounded bg-zinc-800 px-1.5 py-0.5">
                        <Plus className="text-b0-light-purple size-4" />홈 화면에 추가
                      </span>
                      를 선택하세요
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Android Chrome 안내 */}
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                    <span className="text-sm font-bold text-white">1</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">
                      우측 상단의{" "}
                      <span className="inline-flex items-center gap-1 rounded bg-zinc-800 px-1.5 py-0.5">
                        <MoreVertical className="text-b0-light-purple size-4" />
                        메뉴
                      </span>{" "}
                      버튼을 탭하세요
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                    <span className="text-sm font-bold text-white">2</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">
                      <span className="inline-flex items-center gap-1 rounded bg-zinc-800 px-1.5 py-0.5">
                        <Plus className="text-b0-light-purple size-4" />홈 화면에 추가
                      </span>
                      를 선택하세요
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-3 sm:flex-col">
          <Button onClick={() => onOpenChange(false)} className="bg-b0-purple hover:bg-b0-light-purple w-full">
            확인
          </Button>
          <Button variant="ghost" onClick={onDismissForever} className="w-full text-zinc-500 hover:text-zinc-300">
            다시 보지 않기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
