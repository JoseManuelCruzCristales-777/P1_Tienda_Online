import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ClipboardList, Eye } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { handleAdminAuthFailure } from "@/lib/auth/admin-auth";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { TranslationKey } from "@/lib/i18n/translations";
import { countOrdersByStatus, formatOrderId, type OrderStatus } from "@/lib/orders";
import { useAdminOrders } from "@/lib/orders/queries";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrdersPage,
});

type StatusFilter = "all" | OrderStatus;

const FILTER_KEYS: Record<StatusFilter, TranslationKey> = {
  all: "admin_orders_filter_all",
  pending: "admin_orders_filter_pending",
  confirmed: "admin_orders_filter_confirmed",
  cancelled: "admin_orders_filter_cancelled",
  picked_up: "admin_orders_filter_picked_up",
};

function AdminOrdersPage() {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const { data: orders = [], isLoading, error } = useAdminOrders();
  const [filter, setFilter] = useState<StatusFilter>("all");

  const counts = useMemo(() => countOrdersByStatus(orders), [orders]);
  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const dateLocale = locale === "es" ? "es-MX" : "en-US";

  const filters: StatusFilter[] = ["all", "pending", "confirmed", "picked_up", "cancelled"];

  if (error) {
    if (
      handleAdminAuthFailure(error, () => {
        toast.error(t("admin_session_expired"));
        void navigate({ to: "/admin/login" });
      })
    ) {
      return null;
    }

    return (
      <p className="text-error">
        {error instanceof Error ? error.message : t("admin_products_error")}
      </p>
    );
  }

  if (isLoading) {
    return <p className="text-on-surface-variant">{t("admin_products_loading")}</p>;
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary">
            {t("admin_orders_title")}
          </h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            {orders.length === 0
              ? t("admin_orders_empty")
              : t(orders.length === 1 ? "admin_orders_count_one" : "admin_orders_count_other", {
                  count: orders.length,
                })}
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((key) => {
          const count = key === "all" ? orders.length : counts[key as OrderStatus];
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                filter === key
                  ? "border-primary bg-primary text-on-primary"
                  : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
              }`}
            >
              {t(FILTER_KEYS[key])} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-hidden rounded-xl border border-surface-container-highest bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-surface-container-highest bg-surface-container-low">
              <tr>
                <th className="px-4 py-3 font-label-md uppercase text-on-surface-variant">
                  {t("admin_col_order")}
                </th>
                <th className="hidden px-4 py-3 font-label-md uppercase text-on-surface-variant md:table-cell">
                  {t("admin_col_name")}
                </th>
                <th className="px-4 py-3 font-label-md uppercase text-on-surface-variant">
                  {t("admin_col_total")}
                </th>
                <th className="px-4 py-3 font-label-md uppercase text-on-surface-variant">
                  {t("admin_col_status")}
                </th>
                <th className="hidden px-4 py-3 font-label-md uppercase text-on-surface-variant sm:table-cell">
                  {t("admin_col_date")}
                </th>
                <th className="px-4 py-3 text-right font-label-md uppercase text-on-surface-variant">
                  {t("admin_col_action")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-surface-container-highest last:border-0 transition-colors hover:bg-surface-container-low/50"
                >
                  <td className="px-4 py-4 font-medium text-primary">{formatOrderId(order.id)}</td>
                  <td className="hidden px-4 py-4 md:table-cell">
                    <p className="font-medium text-on-surface">{order.customerName}</p>
                    <p className="text-xs text-on-surface-variant">{order.customerEmail}</p>
                  </td>
                  <td className="px-4 py-4 text-on-surface-variant">
                    ${order.total.toFixed(2)} MXN
                  </td>
                  <td className="px-4 py-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="hidden px-4 py-4 text-xs text-on-surface-variant sm:table-cell">
                    {new Date(order.createdAt).toLocaleString(dateLocale, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      to="/admin/orders/$orderId"
                      params={{ orderId: order.id }}
                      className="inline-flex items-center gap-1 rounded-full border border-outline-variant px-3 py-1.5 text-xs text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                    >
                      <Eye className="size-3.5 stroke-[1.5]" aria-hidden />
                      {t("admin_orders_view")}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-surface-container-highest py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-container">
        <ClipboardList className="size-7 stroke-[1.5] text-on-surface-variant" aria-hidden />
      </div>
      <p className="text-sm font-label-md uppercase tracking-widest text-on-surface-variant">
        {t("admin_orders_empty_title")}
      </p>
      <p className="mt-2 max-w-sm text-xs text-on-surface-variant">
        {t("admin_orders_empty_desc")}
      </p>
    </div>
  );
}
