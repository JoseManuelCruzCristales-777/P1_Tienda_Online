import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { isAdminLoggedIn } from "@/lib/auth/admin-session";
import { useI18n } from "@/lib/i18n/I18nProvider";

export const Route = createFileRoute("/admin")({
  component: AdminRouteShell,
});

function AdminRouteShell() {
  const { t } = useI18n();
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
        {t("admin_session_check")}
      </div>
    );
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
