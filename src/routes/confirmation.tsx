import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle, ChevronRight, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { homeSearch } from "@/lib/home-search";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { formatOrderId, getLastOrder, type Order } from "@/lib/orders";
import { buildCartWhatsAppUrl, openWhatsApp } from "@/lib/whatsapp";

export const Route = createFileRoute("/confirmation")({
  head: () => ({
    meta: [
      { title: "Apartado confirmado — Rousse Shopping" },
      { name: "description", content: "Tu apartado en boutique fue registrado." },
      { property: "og:title", content: "Apartado confirmado — Rousse Shopping" },
    ],
  }),
  component: Confirmation,
});

function Confirmation() {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const data = getLastOrder();
    if (!data) {
      void navigate({ to: "/", search: homeSearch });
      return;
    }
    setOrder(data);
    setChecked(true);
  }, [navigate]);

  function handleOpenWhatsApp() {
    if (!order) return;
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
    );
  }

  if (!checked || !order) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="flex flex-grow items-center justify-center px-margin-mobile py-24 md:px-margin-desktop">
          <p className="text-on-surface-variant">{t("confirmation_empty")}</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background antialiased">
      <SiteHeader />

      <div className="mx-auto w-full max-w-container-max px-margin-mobile py-4 md:px-margin-desktop">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-on-surface-variant">
          <Link to="/" search={homeSearch} className="transition-colors hover:text-primary">
            {t("confirmation_home")}
          </Link>
          <ChevronRight aria-hidden className="size-4 stroke-[1.5]" />
          <span className="font-medium text-primary">{t("confirmation_nav")}</span>
        </nav>
      </div>

      <main className="relative mx-auto w-full max-w-container-max flex-grow px-margin-mobile pb-stack-lg md:px-margin-desktop">
        <div className="pointer-events-none absolute left-1/4 top-8 -z-10 h-[320px] w-[320px] rounded-full bg-secondary-fixed/20 blur-[80px] mix-blend-multiply md:h-[400px] md:w-[400px]" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/4 -z-10 h-[240px] w-[240px] rounded-full bg-tertiary-fixed/30 blur-[60px] mix-blend-multiply md:h-[300px] md:w-[300px]" />

        <div className="relative z-10 mx-auto w-full max-w-[800px] py-6 md:py-10">
          <div className="glass-panel relative flex flex-col items-center overflow-hidden rounded-xl p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.05)] md:p-12">
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-secondary-fixed to-secondary" />

            <div className="relative mb-stack-lg">
              <div className="absolute inset-0 animate-ping rounded-full bg-secondary-fixed/30 opacity-50" />
              <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border-4 border-surface-container-lowest bg-primary shadow-[0_10px_30px_rgba(7,6,40,0.2)] md:h-24 md:w-24">
                <CheckCircle className="size-10 text-on-primary md:size-12" aria-hidden />
              </div>
            </div>

            <h1 className="mb-stack-sm font-headline-xl text-headline-lg-mobile tracking-tight text-primary md:text-headline-xl">
              {t("confirmation_title")}
            </h1>
            <p className="mx-auto mb-stack-lg max-w-[500px] font-body-lg text-body-md text-on-surface-variant md:text-body-lg">
              {t("confirmation_desc")}
            </p>

            <div className="mb-stack-lg grid w-full grid-cols-1 gap-stack-md rounded-lg border border-surface-variant bg-surface-container-lowest p-stack-md text-left shadow-sm md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <span className="font-label-md text-label-md text-outline">{t("confirmation_id")}</span>
                <span className="font-body-md text-body-md font-medium tracking-wide text-primary">
                  {formatOrderId(order.id)}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-label-md text-label-md text-outline">{t("confirmation_status")}</span>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="md:col-span-2">
                <span className="font-label-md text-label-md text-outline">{t("confirmation_items")}</span>
                <ul className="mt-2 flex flex-col gap-1 font-body-md text-body-md text-on-surface-variant">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.title} ×{item.quantity} — {item.price}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-2 flex items-center justify-between border-t border-surface-variant pt-stack-sm md:col-span-2">
                <span className="font-body-md text-body-md text-on-surface-variant">
                  {t("confirmation_total")}
                </span>
                <span className="font-headline-md text-headline-md text-primary">
                  ${order.total.toFixed(2)} MXN
                </span>
              </div>
            </div>

            <div className="flex w-full flex-col flex-wrap justify-center gap-stack-sm sm:flex-row">
              <Link
                to="/my-orders"
                className="flex items-center justify-center rounded-full border border-outline-variant px-6 py-3.5 font-label-md text-label-md text-on-surface-variant transition-colors hover:border-primary hover:text-primary sm:px-8 sm:py-4"
              >
                {t("confirmation_view_orders")}
              </Link>
              <Link
                to="/"
                search={homeSearch}
                className="group flex items-center justify-center gap-2 rounded-full border border-primary bg-transparent px-6 py-3.5 font-label-md text-label-md text-primary transition-all duration-300 hover:bg-surface-variant sm:px-8 sm:py-4"
              >
                <ArrowLeft
                  className="size-5 transition-transform group-hover:-translate-x-1"
                  aria-hidden
                />
                {t("confirmation_continue")}
              </Link>
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="flex items-center justify-center gap-2 rounded-full border border-[#25D366] bg-[#25D366] px-6 py-3.5 font-label-md text-label-md text-white shadow-[0_10px_20px_rgba(37,211,102,0.25)] transition-all duration-300 hover:bg-[#1ebe5d] hover:-translate-y-0.5 sm:px-8 sm:py-4"
              >
                {t("confirmation_whatsapp")}
                <MessageCircle className="size-5" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
