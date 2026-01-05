import { Button } from "@/components/ui/button.tsx";
import { ExternalLink, MessageCircle } from "lucide-react";
import { EXTERNAL_LINKS } from "@/lib/external-links.ts";

/**
 * 설정 페이지
 *
 * 문의하기, 로그아웃 등 사용자 설정 기능을 제공
 */
export default function SettingsPage() {
  return (
    <div className="flex h-full flex-col px-6 py-8">
      <div className="flex flex-col gap-4">
        {/* 문의하기 */}
        <a href={EXTERNAL_LINKS.INQUIRY_FORM} target="_blank" rel="noopener noreferrer" className="w-full">
          <Button variant="outline" className="w-full justify-between py-6">
            <div className="flex items-center gap-3">
              <MessageCircle className="size-5" />
              <span>문의하기</span>
            </div>
            <ExternalLink className="size-4 text-zinc-400" />
          </Button>
        </a>
      </div>
    </div>
  );
}
