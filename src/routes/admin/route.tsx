import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { isAdminLoggedIn } from "@/lib/auth/admin-session";

export const Route = createFileRoute("/admin")({
  component: AdminRouteShell,
});

function AdminRouteShell() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isLogin) {
      if (isAdminLoggedIn()) {
        void navigate({ to: "/admin" });
      }
      return;
    }

    if (!isAdminLoggedIn()) {
      void navigate({ to: "/admin/login" });
    }
  }, [isLogin, navigate]);

  if (isLogin) {
    return <Outlet />;
  }

  if (!isAdminLoggedIn()) {
    return (
      <div className="flex min-h-screen items-center justify-center text-on-surface-variant">
        Checking session…
      </div>
    );
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
