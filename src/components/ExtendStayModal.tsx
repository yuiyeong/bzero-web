import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { extendCurrentStay } from "@/api/room-stays";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-client";
import type { B0ApiError } from "@/lib/api-errors";

interface ExtendStayModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCheckOut?: string;
}

export default function ExtendStayModal({ open, onOpenChange, currentCheckOut }: ExtendStayModalProps) {
  const queryClient = useQueryClient();

  const { mutate: extend, isPending } = useMutation({
    mutationFn: extendCurrentStay,
    onSuccess: (data) => {
      toast.success("체류가 1일 연장되었습니다.");
      queryClient.setQueryData(queryKeys.roomStays.current, data);
      onOpenChange(false);
    },
    onError: (error: B0ApiError) => {
      if (error.code === "INSUFFICIENT_BALANCE") {
        toast.error("포인트가 부족합니다. (필요: 300P)");
      } else {
        toast.error(error.message || "연장 실패");
      }
    },
  });

  const handleExtend = () => {
    extend();
  };

  const getNewCheckOutDate = () => {
    if (!currentCheckOut) return "";
    const date = new Date(currentCheckOut);
    date.setDate(date.getDate() + 1);
    return date.toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>체류 기간 연장</DialogTitle>
          <DialogDescription>
            체류를 1일(24시간) 연장하시겠습니까?
            <br />
            <span className="font-bold text-indigo-500">300 포인트</span>가 차감됩니다.
          </DialogDescription>
        </DialogHeader>

        {currentCheckOut && (
          <div className="grid gap-2 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">현재 체크아웃 시간</span>
              <span className="font-medium">{new Date(currentCheckOut).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">연장 후 체크아웃 시간</span>
              <span className="font-bold text-indigo-500">{getNewCheckOutDate()}</span>
            </div>
          </div>
        )}

        <DialogFooter className="sm:justify-end">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleExtend} disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700">
            {isPending ? "연장 중..." : "300P로 연장하기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
