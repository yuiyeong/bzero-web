import { Outlet, useMatches, useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";

interface RouteHandle {
  title?: string;
  isRoot?: boolean;
}

export default function MainLayout() {
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const title = (currentMatch?.handle as RouteHandle)?.title || "B0";
  const isRoot = (currentMatch?.handle as RouteHandle)?.isRoot || false;
  const navigate = useNavigate();

  const handleBackClicked = () => navigate(-1);

  return (
    <div className="h-screen-safe flex flex-col">
      {isRoot ? null : (
        <header className="relative items-center justify-between border-b-1 py-4">
          <div className="absolute inset-0 flex items-center px-4">
            <ChevronLeft className="size-8 hover:cursor-pointer" onClick={handleBackClicked} />
          </div>
          <div className="flex flex-1 items-center justify-center text-xl font-medium">{title}</div>
        </header>
      )}
      <main className="flex min-h-0 w-full flex-1 flex-col overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
