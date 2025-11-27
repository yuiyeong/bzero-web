import { Outlet, useMatches } from "react-router";

interface RouteHandle {
  title?: string;
}

export default function MainLayout() {
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const title = (currentMatch?.handle as RouteHandle)?.title || "B0";

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b-1 py-4">
        <div className="flex flex-1 items-center justify-center text-xl font-medium">{title}</div>
      </header>
      <main className="flex-1 px-6">
        <Outlet />
      </main>
    </div>
  );
}
