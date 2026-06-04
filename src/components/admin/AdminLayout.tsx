import { Link } from "@tanstack/react-router";
import { ClipboardList, LogOut, Package, Users } from "lucide-react";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { logoutAdmin } from "@/lib/api/auth.admin.functions";
import { clearAdminToken, getAdminToken } from "@/lib/auth/admin-session";
import { homeSearch } from "@/lib/home-search";
import { useI18n } from "@/lib/i18n/I18nProvider";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();

  const handleLogout = async () => {
    const token = getAdminToken();
    if (token) {
      try {
        await logoutAdmin({ data: { adminToken: token } });
      } catch {
        /* session may already be invalid */
      }
    }
    clearAdminToken();
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-surface-container-highest bg-surface">
        <div className="mx-auto flex max-w-container-max items-center justify-between px-margin-mobile py-4 md:px-margin-desktop">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Rousse Shopping"
              className="h-9 w-9 rounded-full object-cover"
            />
            <div>
              <p className="font-headline-md text-sm font-semibold text-primary">{t("admin_brand")}</p>
              <p className="text-xs text-on-surface-variant">{t("admin_subtitle")}</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center justify-end gap-3 md:gap-4">
            <LanguageSwitcher />
            <Link
              to="/admin"
              className="flex items-center gap-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
            >
              <Package className="size-4 stroke-[1.5]" aria-hidden />
              {t("admin_nav_products")}
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center gap-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
            >
              <ClipboardList className="size-4 stroke-[1.5]" aria-hidden />
              {t("admin_nav_orders")}
            </Link>
            <Link
              to="/admin/customers"
              className="flex items-center gap-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
            >
              <Users className="size-4 stroke-[1.5]" aria-hidden />
              {t("admin_nav_customers")}
            </Link>
            <Link
              to="/"
              search={homeSearch}
              className="text-sm text-on-surface-variant transition-colors hover:text-primary"
            >
              {t("admin_view_store")}
            </Link>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="flex items-center gap-2 rounded-full border border-outline-variant px-4 py-2 text-sm text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
            >
              <LogOut className="size-4 stroke-[1.5]" aria-hidden />
              {t("admin_logout")}
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-container-max px-margin-mobile py-8 md:px-margin-desktop">
        {children}
      </main>
    </div>
  );
}
