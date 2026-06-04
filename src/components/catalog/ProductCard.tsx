import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogIn, ShoppingBag } from "lucide-react";

import { WishlistButton } from "@/components/WishlistButton";

import type { Product } from "@/lib/catalog/types";
import { addToCart, notifyCartUpdated } from "@/lib/cart";
import { isLoggedIn } from "@/lib/session";
import { getSession } from "@/lib/session";
import { buildSingleWhatsAppUrl } from "@/lib/whatsapp";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";

// Duración del mensaje visual de "¡Agregado!" en ms
const ADDED_FEEDBACK_MS = 1500;
// Tiempo antes de redirigir al login cuando no hay sesión
const AUTH_REDIRECT_MS = 2500;

type ProductCardProps = {
  product: Product;
  className?: string;
  onCartUpdate?: () => void;
};

export function ProductCard({ product, className, onCartUpdate }: ProductCardProps) {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const session = getSession();
  const whatsappUrl = buildSingleWhatsAppUrl(
    { title: product.title, price: product.price },
    {
      locale,
      customer: session
        ? { name: session.name, phone: session.phone, email: session.email }
        : undefined,
    },
  );

  // Estado del botón: "idle" | "added" | "auth-required"
  const [btnState, setBtnState] = useState<"idle" | "added" | "auth-required">("idle");

  // Ref para limpiar timeouts al desmontar el componente
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleAddToCart() {
    // ── Regla de negocio: verificar 'rousse-session' en localStorage ──────
    if (!isLoggedIn()) {
      // No autenticado → mostrar mensaje y redirigir al login
      setBtnState("auth-required");
      timerRef.current = setTimeout(() => {
        setBtnState("idle");
        void navigate({ to: "/login" });
      }, AUTH_REDIRECT_MS);
      return;
    }

    // Autenticado → agregar al carrito y mostrar feedback visual
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
    });

    // Notifica al Header (y cualquier otro listener) que el carrito cambió.
    // CustomEvent viaja por el bus global window sin necesidad de prop drilling.
    notifyCartUpdated();

    setBtnState("added");
    onCartUpdate?.();
    timerRef.current = setTimeout(() => setBtnState("idle"), ADDED_FEEDBACK_MS);
  }

  const isAdded = btnState === "added";
  const needsAuth = btnState === "auth-required";

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden border border-surface-container-highest bg-surface shadow-sm transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]",
        className,
      )}
    >
      {/* Imagen — navega al detalle del producto */}
      <Link
        to="/product/$productId"
        params={{ productId: product.id }}
        className="relative block h-64 w-full overflow-hidden bg-surface-container-low"
      >
        <img
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={product.imageUrl}
        />
        <WishlistButton
          product={{
            id: product.id,
            title: product.title,
            price: product.price,
            imageUrl: product.imageUrl,
          }}
          stopPropagation
          className="absolute right-3 top-3 h-8 w-8 bg-white/80 opacity-100 shadow-sm backdrop-blur-md transition-opacity md:opacity-0 md:group-hover:opacity-100"
          iconClassName="size-4"
        />
      </Link>

      {/* Info + botones */}
      <div className="z-10 flex flex-grow flex-col justify-between bg-surface p-4">
        {/* Título y precio — clic navega al detalle */}
        <Link to="/product/$productId" params={{ productId: product.id }}>
          <h4 className="truncate font-label-md text-label-md text-on-surface">{product.title}</h4>
          <span className="mt-1 block font-body-md text-body-md text-on-surface-variant">
            {product.price}
          </span>
        </Link>

        {/* ── Toast de autenticación requerida ── */}
        {needsAuth && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs leading-snug text-primary">
            <LogIn aria-hidden className="mt-0.5 size-4 shrink-0 stroke-[1.5]" />
            <span>{t("product_auth_required")}</span>
          </div>
        )}

        {/* ── Botones de acción (visibles al hacer hover en desktop) ── */}
        <div className="mt-3 flex flex-col gap-2 md:translate-y-2 md:opacity-0 md:transition-all md:duration-200 md:group-hover:translate-y-0 md:group-hover:opacity-100">

          {/* Botón "Agregar a la bolsa" */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdded || needsAuth}
            className={cn(
              "flex w-full items-center justify-center gap-2 border py-2 text-xs font-medium tracking-wide transition-all duration-150 active:scale-[0.98]",
              isAdded
                ? "cursor-default border-on-surface bg-on-surface text-surface"
                : needsAuth
                  ? "cursor-default border-primary/30 bg-primary/5 text-primary"
                  : "border-on-surface/30 bg-surface text-on-surface hover:bg-on-surface hover:text-surface",
            )}
          >
            <ShoppingBag aria-hidden className="size-3.5" />
            {isAdded
              ? t("product_added")
              : needsAuth
                ? t("product_logging_in")
                : t("product_add_bag")}
          </button>

          {/* Botón "Apartar por WhatsApp" */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 border border-[#25D366] bg-[#25D366] py-2 text-xs font-medium tracking-wide text-white transition-all duration-150 hover:bg-[#1ebe5d] active:scale-[0.98]"
          >
            {/* WhatsApp SVG icon */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.847L.057 23.5a.5.5 0 00.623.624l5.701-1.488A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.893a9.877 9.877 0 01-5.031-1.378l-.361-.214-3.732.974.998-3.648-.235-.374A9.865 9.865 0 012.107 12C2.107 6.549 6.549 2.107 12 2.107c5.45 0 9.893 4.442 9.893 9.893 0 5.45-4.443 9.893-9.893 9.893z" />
            </svg>
            {t("product_whatsapp")}
          </a>
        </div>
      </div>
    </div>
  );
}
