import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";

import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { formatOrderId, type Order } from "@/lib/orders";
import { homeSearch } from "@/lib/home-search";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { getSession } from "@/lib/session";
import { buildCartWhatsAppUrl, openWhatsApp } from "@/lib/whatsapp";

export const Route = createFileRoute("/my-orders")({
  head: () => ({
    meta: [
      { title: "Mis apartados — Rousse Shopping" },
      { name: "description", content: "Consulta el estado de tus reservas en boutique." },
    ],
  }),
  component: MyOrdersPage,
});

function MyOrdersPage() {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const [session] = useState(() => getSession());
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      void navigate({ to: "/login" });
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const { fetchMyOrders } = await import("@/lib/orders/orders-browser");
        const data = await fetchMyOrders();
        if (!cancelled) setOrders(data);
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session, navigate]);

  const dateLocale = locale === "es" ? "es-MX" : "en-US";

  if (!session) return null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <div className="mx-auto w-full max-w-container-max px-margin-mobile py-4 md:px-margin-desktop">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1 text-sm text-on-surface-variant"
        >
          <Link to="/" search={homeSearch} className="transition-colors hover:text-primary">
            {t("my_orders_home")}
          </Link>
          <ChevronRight aria-hidden className="size-4 stroke-[1.5]" />
          <span className="font-medium text-primary">{t("my_orders_nav")}</span>
        </nav>
      </div>

      <main className="mx-auto w-full max-w-container-max flex-grow px-margin-mobile pb-stack-lg md:px-margin-desktop">
        <h1 className="font-headline-xl text-headline-xl text-primary">{t("my_orders_title")}</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          {t("my_orders_subtitle", { name: session.name.split(" ")[0] })}
        </p>

        {orders.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container-low">
              <ClipboardList className="size-10 stroke-[1] text-on-surface-variant" aria-hidden />
            </div>
            <p className="font-headline-md text-on-surface-variant">{t("my_orders_empty")}</p>
            <p className="mt-2 max-w-md text-sm text-on-surface-variant">
              {t("my_orders_empty_hint")}
            </p>
            <Link
              to="/"
              search={homeSearch}
              className="mt-8 rounded-full bg-primary px-8 py-3 font-label-md uppercase text-on-primary hover:bg-primary-container"
            >
              {t("my_orders_browse")}
            </Link>
          </div>
        ) : (
          <ul className="mt-8 flex flex-col gap-4">
            {orders.map((order) => {
              const isOpen = expandedId === order.id;
              const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);

              return (
                <li
                  key={order.id}
                  className="overflow-hidden rounded-xl border border-surface-container-highest bg-surface shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedId(isOpen ? null : order.id)}
                    className="flex w-full flex-wrap items-center justify-between gap-3 p-5 text-left transition-colors hover:bg-surface-container-low/40"
                  >
                    <div>
                      <p className="font-headline-md text-primary">{formatOrderId(order.id)}</p>
                      <p className="mt-1 text-xs text-on-surface-variant">
                        {new Date(order.createdAt).toLocaleString(dateLocale, {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {" · "}
                        {t(itemCount === 1 ? "my_orders_items_one" : "my_orders_items_other", {
                          count: itemCount,
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-headline-md text-primary">
                        ${order.total.toFixed(2)} MXN
                      </span>
                      <OrderStatusBadge status={order.status} />
                      <ChevronRight
                        className={`size-5 text-on-surface-variant transition-transform ${isOpen ? "rotate-90" : ""}`}
                        aria-hidden
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-surface-container-highest px-5 pb-5 pt-4">
                      <ul className="mb-4 space-y-2 text-sm text-on-surface-variant">
                        {order.items.map((item) => (
                          <li key={item.id}>
                            {item.title} ×{item.quantity} — {item.price}
                          </li>
                        ))}
                      </ul>
                      {order.status === "pending" && (
                        <button
                          type="button"
                          onClick={() =>
                            openWhatsApp(
                              buildCartWhatsAppUrl(order.items, {
                                locale,
                                total: order.total,
                                customer: {
                                  name: order.customerName,
                                  phone: order.customerPhone,
                                  email: order.customerEmail,
                                },
                              }),
                            )
                          }
                          className="text-sm font-medium text-[#25D366] hover:underline"
                        >
                          {t("my_orders_whatsapp_followup")}
                        </button>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
