import { useNavigate } from "react-router";
import { useMe } from "@/hooks/queries/use-me";
import { ROUTES } from "@/lib/routes";
import bgTerminal from "@/assets/images/img_bg_boarding.webp";
import { Loader2, ChevronRight, BookText, FileText, MessageCircleQuestion, LogOut } from "lucide-react";
import { useSignOut } from "@/hooks/mutations/use-sign-out";

import { EXTERNAL_LINKS } from "@/lib/external-links";

export default function MyPage() {
  const navigate = useNavigate();
  const { data: user, isLoading } = useMe();
  const { mutate: signOut, isPending: isSigningOut } = useSignOut();

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  const menuItems = [
    { icon: BookText, label: "나의 일기", path: ROUTES.MYPAGE_DIARIES },
    { icon: FileText, label: "나의 문답지", path: ROUTES.MYPAGE_QUESTIONNAIRES },
  ];

  const handleContactClick = () => {
    window.open(EXTERNAL_LINKS.INQUIRY_FORM, "_blank");
  };

  const handleSignOut = () => {
    if (window.confirm("정말 로그아웃하시겠습니까?")) {
      signOut();
    }
  };

  return (
    <div className="relative flex h-screen flex-col bg-black text-white">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm"
        style={{ backgroundImage: `url(${bgTerminal})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/80 to-black" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col pt-4">
        {/* Profile Info */}
        <div className="flex flex-col items-center gap-3 px-6 py-8">
          <div className="text-6xl">{user.profile_emoji}</div>
          <div className="text-center">
            <h2 className="text-xl font-bold">{user.nickname}</h2>
            <span className="text-b0-light-purple bg-b0-purple/20 mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium">
              {user.current_points} P
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-white/10" />

        {/* Menu List */}
        <nav className="flex flex-col gap-2 px-6 py-6">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-4 rounded-xl bg-zinc-900/50 px-4 py-4 transition-colors hover:bg-zinc-800/50"
            >
              <item.icon className="h-5 w-5 text-zinc-400" />
              <span className="flex-1 text-left text-base">{item.label}</span>
              <ChevronRight className="h-5 w-5 text-zinc-500" />
            </button>
          ))}
          <button
            onClick={handleContactClick}
            className="flex items-center gap-4 rounded-xl bg-zinc-900/50 px-4 py-4 transition-colors hover:bg-zinc-800/50"
          >
            <MessageCircleQuestion className="h-5 w-5 text-zinc-400" />
            <span className="flex-1 text-left text-base">문의하기</span>
            <ChevronRight className="h-5 w-5 text-zinc-500" />
          </button>
        </nav>

        {/* Divider */}
        <div className="mx-6 border-t border-white/10" />

        {/* Logout Section */}
        <div className="px-6 py-4">
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex w-full items-center gap-4 rounded-xl bg-zinc-900/50 px-4 py-4 transition-colors hover:bg-zinc-800/50 disabled:opacity-50"
          >
            <LogOut className="h-5 w-5 text-zinc-400" />
            <span className="flex-1 text-left text-base">
              {isSigningOut ? "로그아웃 중..." : "로그아웃"}
            </span>
            <ChevronRight className="h-5 w-5 text-zinc-500" />
          </button>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-white/10" />

        {/* Close Button */}
        <div className="px-6 py-6">
          <button
            onClick={() => navigate(-1)}
            className="w-full rounded-xl border border-white/20 py-3 text-center text-zinc-400 transition-colors hover:bg-white/5"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
