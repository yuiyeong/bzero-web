
import { useEffect, useState } from "react";
import { Sparkles, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ServiceTerminationPage() {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Simple fade-in effect on mount
        const timer = setTimeout(() => setShowContent(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-b0-deep-navy px-4 text-center text-foreground">
            {/* Background Ambience */}
            <div className="absolute inset-0 z-0">
                <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 animate-pulse rounded-full bg-b0-purple/20 blur-[100px]" />
                <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 animate-pulse rounded-full bg-b0-pink-purple/10 blur-[100px] delay-1000" />
            </div>

            {/* Main Content Card */}
            <div
                className={cn(
                    "glass relative z-10 flex max-w-md flex-col items-center rounded-2xl p-8 pt-12 shadow-2xl transition-all duration-1000 ease-out",
                    showContent ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                )}
            >
                {/* Icon / Brand Element */}
                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-b0-card-navy/50 shadow-inner ring-1 ring-white/10">
                    <Sparkles className="h-10 w-10 text-b0-light-purple animate-pulse" />
                </div>

                {/* Title */}
                <h1 className="mb-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                    서비스 종료 안내
                </h1>
                <p className="mb-8 text-lg font-medium text-b0-light-purple/80">
                    B0: Zero to One
                </p>

                {/* Divider */}
                <div className="mb-8 h-px w-full max-w-[200px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                {/* Message Body */}
                <div className="space-y-4 text-gray-300">
                    <p>
                        안녕하세요, B0 팀입니다.
                    </p>
                    <p>
                        지난 여정을 함께해주신 여행자 여러분께<br />
                        깊은 감사의 말씀을 드립니다.
                    </p>
                    <p>
                        아쉽게도 B0 서비스는<br />
                        <span className="font-bold text-white">2026년 2월 14일</span>을 마지막으로<br />
                        긴 여행을 마치게 되었습니다.
                    </p>
                    <p>
                        비록 서비스는 종료되지만,<br />
                        여러분의 일상 속 모험은 계속되길 응원하겠습니다.
                    </p>
                </div>

                {/* Footer / Date */}
                <div className="mt-12 flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Heart className="h-4 w-4 text-rose-500 fill-rose-500/20" />
                    <span>Thank you for being with us</span>
                </div>
            </div>

            {/* Footer Copyright */}
            <div className="absolute bottom-6 z-10 text-xs text-gray-600">
                © 2026 B0 Team. All rights reserved.
            </div>
        </div>
    );
}
