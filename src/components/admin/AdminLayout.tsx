import { Link } from "@tanstack/react-router";
import { LogOut, Package } from "lucide-react";

import { logoutAdmin } from "@/lib/api/auth.admin.functions";
import { clearAdminToken, getAdminToken } from "@/lib/auth/admin-session";

export function AdminLayout({ children }: { children: React.ReactNode }) {
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
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-surface-container-highest bg-surface">
        <div className="mx-auto flex max-w-container-max items-center justify-between px-margin-mobile py-4 md:px-margin-desktop">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-on-primary">
              R
            </div>
            <div>
              <p className="font-headline-md text-sm font-semibold text-primary">Rousse Admin</p>
              <p className="text-xs text-on-surface-variant">Catalog management</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              to="/admin"
              className="flex items-center gap-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
            >
              <Package className="size-4 stroke-[1.5]" aria-hidden />
              Products
            </Link>
            <Link
              to="/"
              className="text-sm text-on-surface-variant transition-colors hover:text-primary"
            >
              View store
            </Link>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="flex items-center gap-2 rounded-full border border-outline-variant px-4 py-2 text-sm text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
            >
              <LogOut className="size-4 stroke-[1.5]" aria-hidden />
              Log out
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
