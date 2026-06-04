import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Minus, Package, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import {
  type CartItem,
  clearCart,
  getCart,
  getCartTotal,
  notifyCartUpdated,
  removeFromCart,
  updateCartQuantity,
} from "@/lib/cart";
import { homeSearch } from "@/lib/home-search";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { placeOrder } from "@/lib/orders";
import { getSession } from "@/lib/session";
import { buildCartWhatsAppUrl, openWhatsApp } from "@/lib/whatsapp";

export const Route = createFileRoute("/bag")({
  head: () => ({
    meta: [
      { title: "Bolsa de compras — Rousse Shopping" },
      { name: "description", content: "Revisa tus artículos reservados y confirma tu apartado en boutique." },
      { property: "og:title", content: "Bolsa de compras — Rousse Shopping" },
    ],
  }),
  component: Bag,
});

function Bag() {
  const { t, locale } = useI18n();
  const navigate = useNavigate();

  // Cargamos el carrito y la sesión desde localStorage al montar el componente
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [session] = useState(() => getSession());

  // Si el usuario no tiene sesión activa, lo mandamos a login
  useEffect(() => {
    if (!session) {
      void navigate({ to: "/login" });
    }
  }, [session, navigate]);

  // Sincroniza los items y el total cada vez que cambie el carrito
  useEffect(() => {
    const cart = getCart();
    setItems(cart);
    setTotal(getCartTotal());
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────

  function syncCartState(updated: CartItem[]) {
    setItems(updated);
    setTotal(getCartTotal());
    notifyCartUpdated();
  }

  function handleRemove(id: string) {
    syncCartState(removeFromCart(id));
  }

  function handleQtyChange(id: string, delta: number) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    syncCartState(updateCartQuantity(id, item.quantity + delta));
  }

  function handleWhatsAppReserve() {
    if (!session || items.length === 0) return;

    placeOrder({
      items,
      total,
      customerId: session.id,
      customerName: session.name,
      customerPhone: session.phone,
      customerEmail: session.email,
    });

    const url = buildCartWhatsAppUrl(items, {
      locale,
      total,
      customer: {
        name: session.name,
        phone: session.phone,
        email: session.email,
      },
    });

    openWhatsApp(url);
    clearCart();
    notifyCartUpdated();
    void navigate({ to: "/confirmation" });
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="mx-auto w-full max-w-container-max px-margin-mobile py-4 md:px-margin-desktop">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-on-surface-variant">
          <Link to="/" search={homeSearch} className="transition-colors hover:text-primary">
            {t("bag_home")}
          </Link>
          <ChevronRight aria-hidden className="size-4 stroke-[1.5]" />
          <span className="font-medium text-primary">{t("bag_nav")}</span>
        </nav>
      </div>

      <main className="mx-auto w-full flex-grow max-w-container-max px-margin-mobile pb-stack-lg md:px-margin-desktop">
        <div className="mb-stack-md">
          <h1 className="font-headline-xl text-headline-xl text-primary">{t("bag_title")}</h1>
          {session && (
            <p className="mt-1 text-body-md text-on-surface-variant">
              {t("bag_greeting", {
                name: session.name.split(" ")[0],
                status:
                  itemCount === 0
                    ? t("bag_greeting_empty")
                    : t(
                        itemCount === 1
                          ? "bag_greeting_items_one"
                          : "bag_greeting_items_other",
                        { count: itemCount },
                      ),
              })}
            </p>
          )}
        </div>

        {/* ── Estado vacío ── */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container-low">
              <ShoppingBag aria-hidden className="size-10 stroke-[1] text-on-surface-variant" />
            </div>
            <p className="font-headline-md text-headline-md text-on-surface-variant">
              {t("bag_empty")}
            </p>
            <p className="mt-2 text-body-md text-on-surface-variant">
              {t("bag_empty_hint")}
            </p>
            <Link
              to="/"
              search={homeSearch}
              className="mt-8 rounded-full bg-primary px-8 py-3 font-label-md text-label-md uppercase text-on-primary transition-colors hover:bg-primary-container"
            >
              {t("bag_view_catalog")}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-gutter lg:flex-row">

            {/* ── Lista de artículos ── */}
            <div className="flex w-full flex-col gap-stack-sm lg:w-2/3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-lg border border-surface-container bg-surface-container-lowest p-5 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:gap-6"
                >
                  {/* Imagen del producto */}
                  <Link
                    to="/product/$productId"
                    params={{ productId: item.id }}
                    className="h-28 w-full flex-shrink-0 overflow-hidden rounded bg-surface-container-low sm:w-28"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </Link>

                  <div className="flex flex-grow flex-col justify-between">
                    {/* Nombre + botón eliminar */}
                    <div className="flex items-start justify-between gap-2">
                      <Link to="/product/$productId" params={{ productId: item.id }}>
                        <h3 className="font-headline-md text-[18px] leading-snug text-primary hover:underline">
                          {item.title}
                        </h3>
                        <p className="mt-0.5 text-sm text-on-surface-variant">{item.price}</p>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        aria-label={t("bag_remove", { title: item.title })}
                        className="shrink-0 rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-error/10 hover:text-error"
                      >
                        <Trash2 aria-hidden className="size-4 stroke-[1.5]" />
                      </button>
                    </div>

                    {/* Controles de cantidad + subtotal */}
                    <div className="mt-4 flex items-center justify-between sm:mt-0">
                      <div className="flex items-center overflow-hidden rounded border border-outline-variant">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(item.id, -1)}
                          aria-label="Reducir cantidad"
                          className="px-3 py-1.5 text-on-surface-variant transition-colors hover:bg-surface-container"
                        >
                          <Minus aria-hidden className="size-3.5 stroke-[2]" />
                        </button>
                        <span className="min-w-[2.5rem] border-x border-outline-variant px-3 py-1.5 text-center font-label-md text-label-md">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(item.id, +1)}
                          aria-label="Aumentar cantidad"
                          className="px-3 py-1.5 text-on-surface-variant transition-colors hover:bg-surface-container"
                        >
                          <Plus aria-hidden className="size-3.5 stroke-[2]" />
                        </button>
                      </div>
                      <span className="font-headline-md text-[18px] text-primary">
                        {item.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Aviso de pago en tienda */}
              <div className="mt-2 flex items-start gap-3 rounded-lg border border-secondary-container bg-secondary-container/20 p-4">
                <Package aria-hidden className="mt-0.5 size-5 shrink-0 stroke-[1.5] text-secondary" />
                <div>
                  <h4 className="font-label-md text-label-md text-on-surface">
                    {t("bag_pickup_title")}
                  </h4>
                  <p className="mt-1 text-sm text-on-surface-variant">{t("bag_pickup_desc")}</p>
                </div>
              </div>
            </div>

            {/* ── Resumen de orden ── */}
            <div className="w-full lg:sticky lg:top-[180px] lg:w-1/3">
              <div className="glass-panel rounded-xl p-8 shadow-sm">
                <h2 className="mb-6 border-b border-surface-container-highest pb-4 font-headline-md text-headline-md text-primary">
                  {t("bag_summary")}
                </h2>

                <div className="mb-6 flex flex-col gap-4 font-body-md text-body-md text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>
                      {t(
                        itemCount === 1 ? "bag_subtotal_one" : "bag_subtotal",
                        { count: itemCount },
                      )}
                    </span>
                    <span className="font-medium text-primary">${total.toFixed(2)} MXN</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("bag_shipping")}</span>
                    <span className="font-medium text-primary">{t("bag_free")}</span>
                  </div>
                </div>

                <div className="mb-8 flex items-center justify-between border-t border-surface-container-highest pt-5">
                  <span className="font-headline-md text-headline-md text-primary">{t("bag_total")}</span>
                  <span className="font-headline-md text-headline-md text-primary">
                    ${total.toFixed(2)} MXN
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleWhatsAppReserve}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-[#25D366] bg-[#25D366] py-4 font-label-md text-label-md uppercase text-white transition-colors hover:bg-[#1ebe5d]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.847L.057 23.5a.5.5 0 00.623.624l5.701-1.488A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.893a9.877 9.877 0 01-5.031-1.378l-.361-.214-3.732.974.998-3.648-.235-.374A9.865 9.865 0 012.107 12C2.107 6.549 6.549 2.107 12 2.107c5.45 0 9.893 4.442 9.893 9.893 0 5.45-4.443 9.893-9.893 9.893z" />
                  </svg>
                  {t("bag_whatsapp")}
                </button>

                <p className="mt-3 text-center text-xs text-on-surface-variant/80">
                  {t("bag_whatsapp_hint")}
                </p>

                <p className="mt-2 text-center text-xs text-on-surface-variant/70">
                  {t("bag_whatsapp_terms_prefix")}{" "}
                  <Link
                    to="/legal/terminos"
                    className="text-primary underline hover:text-secondary"
                  >
                    {t("footer_terms")}
                  </Link>
                  {t("bag_whatsapp_terms_suffix")}
                </p>
              </div>
            </div>

          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
