import { LoaderPinwheelIcon } from "lucide-react";

export default function GlobalLoader() {
  return (
    <div className="h-screen-safe flex w-full flex-col items-center justify-center">
      <div className="mb-12 flex flex-col items-center justify-center gap-2">
        <LoaderPinwheelIcon className="text-primary size-16 animate-spin" />
        <p className="text-muted-foreground">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}
