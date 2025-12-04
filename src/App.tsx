import { router } from "@/root-route.tsx";
import { RouterProvider } from "react-router";
import AuthSessionProvider from "@/providers/auth-session-provider.tsx";

export default function App() {
  return (
    <AuthSessionProvider>
      <RouterProvider router={router} />
    </AuthSessionProvider>
  );
}
