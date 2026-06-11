import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { isAdminLoggedIn } from "@/lib/auth/admin-session";
import { useI18n } from "@/lib/i18n/I18nProvider";

export const Route = createFileRoute("/admin")({
  component: AdminRouteShell,
});

function AdminSessionGate({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center text-on-surface-variant">
      {message}
    </div>
  );
}

function AdminRouteShell() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = pathname === "/admin/login";

  // SSR y primer paint en cliente: sessionStorage no está disponible en el servidor.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (isLogin) {
      if (isAdminLoggedIn()) {
        void navigate({ to: "/admin", replace: true });
      }
      return;
    }

    if (!isAdminLoggedIn()) {
      void navigate({ to: "/admin/login", replace: true });
    }
  }, [isLogin, mounted, navigate, pathname]);

  if (isLogin) {
    return <Outlet />;
  }

  if (!mounted) {
    return <AdminSessionGate message={t("admin_session_check")} />;
  }

  // Leer sessionStorage en cada render tras montar — no guardar en useState
  // (el estado quedaba obsoleto tras login y dejaba la pantalla trabada).
  if (!isAdminLoggedIn()) {
    return <AdminSessionGate message={t("admin_session_check")} />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
