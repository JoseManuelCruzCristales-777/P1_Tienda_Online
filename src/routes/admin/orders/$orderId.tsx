import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import {
  deleteOrder,
  formatOrderId,
  getOrderById,
  updateOrderStatus,
  type Order,
  type OrderStatus,
} from "@/lib/orders";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { getWhatsAppNumber } from "@/lib/whatsapp";

export const Route = createFileRoute("/admin/orders/$orderId")({
  component: AdminOrderDetailPage,
});

const STATUS_OPTIONS: OrderStatus[] = ["pending", "confirmed", "picked_up", "cancelled"];

function AdminOrderDetailPage() {
  const { orderId } = Route.useParams();
  const { t, locale } = useI18n();
  const [order, setOrder] = useState<Order | undefined>(() => getOrderById(orderId));

  useEffect(() => {
    setOrder(getOrderById(orderId));
  }, [orderId]);

  const dateLocale = locale === "es" ? "es-MX" : "en-US";

  if (!order) {
    return (
      <div>
        <Link
          to="/admin/orders"
          className="mb-6 inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {t("admin_orders_back")}
        </Link>
        <p className="text-on-surface-variant">{t("admin_orders_not_found")}</p>
      </div>
    );
  }

  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
  const customerWa = `https://wa.me/52${order.customerPhone.replace(/\D/g, "")}`;

  function handleStatusChange(status: OrderStatus) {
    const updated = updateOrderStatus(order!.id, status);
    if (updated) setOrder(updated);
  }

  function handleDelete() {
    if (!window.confirm(t("admin_orders_delete_confirm", { id: formatOrderId(order!.id) }))) {
      return;
    }
    deleteOrder(order!.id);
    window.location.href = "/admin/orders";
  }

  return (
    <div>
      <Link
        to="/admin/orders"
        className="mb-6 inline-flex items-center gap-2 text-sm text-on-surface-variant transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4 stroke-[1.5]" aria-hidden />
        {t("admin_orders_back")}
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary">
            {formatOrderId(order.id)}
          </h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            {new Date(order.createdAt).toLocaleString(dateLocale, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
        <OrderStatusBadge status={order.status} className="text-sm px-3 py-1" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-xl border border-surface-container-highest bg-surface p-6">
            <h2 className="mb-4 font-headline-md text-headline-md text-primary">
              {t("admin_orders_items")}
            </h2>
            <ul className="divide-y divide-surface-container-highest">
              {order.items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded object-cover"
                  />
                  <div className="min-w-0 flex-grow">
                    <p className="font-medium text-on-surface">{item.title}</p>
                    <p className="text-sm text-on-surface-variant">
                      {t("admin_orders_qty", { count: item.quantity })} — {item.price}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-surface-container-highest pt-4">
              <span className="text-on-surface-variant">
                {t(
                  itemCount === 1 ? "admin_orders_items_one" : "admin_orders_items_other",
                  { count: itemCount },
                )}
              </span>
              <span className="font-headline-md text-primary">
                ${order.total.toFixed(2)} MXN
              </span>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-surface-container-highest bg-surface p-6">
            <h2 className="mb-4 font-headline-md text-sm uppercase tracking-widest text-on-surface-variant">
              {t("admin_orders_customer")}
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-on-surface-variant">{t("admin_col_name")}</dt>
                <dd className="font-medium text-on-surface">{order.customerName}</dd>
              </div>
              <div>
                <dt className="text-on-surface-variant">{t("admin_col_email")}</dt>
                <dd>
                  <a href={`mailto:${order.customerEmail}`} className="text-primary hover:underline">
                    {order.customerEmail}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-on-surface-variant">{t("admin_col_whatsapp")}</dt>
                <dd>
                  <a
                    href={customerWa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {order.customerPhone}
                  </a>
                </dd>
              </div>
            </dl>

            <a
              href={customerWa}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-[#25D366] bg-[#25D366] py-3 text-sm font-medium text-white transition-colors hover:bg-[#1ebe5d]"
            >
              <MessageCircle className="size-4" aria-hidden />
              {t("admin_orders_contact_wa")}
            </a>
            <p className="mt-2 text-center text-[10px] text-on-surface-variant">
              {t("admin_orders_store_wa", { number: getWhatsAppNumber() })}
            </p>
          </section>

          <section className="rounded-xl border border-surface-container-highest bg-surface p-6">
            <h2 className="mb-3 font-headline-md text-sm uppercase tracking-widest text-on-surface-variant">
              {t("admin_orders_update_status")}
            </h2>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
              className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {t(
                    s === "pending"
                      ? "order_status_pending"
                      : s === "confirmed"
                        ? "order_status_confirmed"
                        : s === "cancelled"
                          ? "order_status_cancelled"
                          : "order_status_picked_up",
                  )}
                </option>
              ))}
            </select>
          </section>

          <button
            type="button"
            onClick={handleDelete}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-error/40 py-3 text-sm text-error transition-colors hover:bg-error/5"
          >
            <Trash2 className="size-4" aria-hidden />
            {t("admin_orders_delete")}
          </button>
        </div>
      </div>
    </div>
  );
}
