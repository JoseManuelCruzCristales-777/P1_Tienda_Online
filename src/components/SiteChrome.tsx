import { Link, useNavigate, useRouterState } from "@tanstack/react-router";

import {
  buildStoreWhatsAppUrl,
  formatWhatsAppDisplayNumber,
  openWhatsApp,
} from "@/lib/whatsapp";
import {
  formatStoreAddress,
  STORE_EMAIL,
  STORE_FACEBOOK_URL,
  STORE_INSTAGRAM_URL,
  STORE_MAPS_URL,
} from "@/lib/store-config";
import type { LucideIcon } from "lucide-react";
import {
  CircleUser,
  ClipboardList,
  Heart,
  Instagram,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  ScanFace,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Watch,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { TranslationKey } from "@/lib/i18n/translations";
import { homeSearch } from "@/lib/home-search";
import { cn } from "@/lib/utils";
import type { CustomerSession } from "@/lib/session";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers de localStorage — con guardia SSR para TanStack Start.
// En el servidor `window` no existe; estas funciones retornan valores neutros.
// TODO: cuando conectes Supabase Auth, estos helpers se reemplazarán por
//       `supabase.auth.getSession()` y `supabase.auth.onAuthStateChange()`.
// ─────────────────────────────────────────────────────────────────────────────

/** Lee cuántos productos hay en la lista de deseos. */
function readWishlistCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem("rousse-wishlist");
    if (!raw) return 0;
    const list = JSON.parse(raw) as unknown[];
    return Array.isArray(list) ? list.length : 0;
  } catch {
    return 0;
  }
}

/** Lee cuántas unidades hay en el carrito. */
function readCartCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem("rousse-cart");
    if (!raw) return 0;
    const cart = JSON.parse(raw) as Array<{ quantity?: number }>;
    return cart.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
  } catch {
    return 0;
  }
}

/** Lee la sesión del cliente desde localStorage. */
function readSession(): CustomerSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("rousse-session");
    return raw ? (JSON.parse(raw) as CustomerSession) : null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORÍAS DE NAVEGACIÓN
// Cada item tiene `category`: el valor exacto que coincide con Product.category
// en products.json. Al hacer clic, navega a /?category=X y el catálogo filtra.
// ─────────────────────────────────────────────────────────────────────────────
const navItems: { category: string; labelKey: TranslationKey; Icon: LucideIcon }[] = [
  { category: "New Collection", labelKey: "nav_newCollection", Icon: Star },
  { category: "Boutique", labelKey: "nav_boutique", Icon: Store },
  { category: "Perfumes", labelKey: "nav_perfumes", Icon: Sparkles },
  { category: "Skincare", labelKey: "nav_skincare", Icon: ScanFace },
  { category: "Accessories", labelKey: "nav_accessories", Icon: Watch },
];

const iconStroke = "stroke-[1.5]";

export function SiteHeader() {
  const { t } = useI18n();
  const { location } = useRouterState();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  // Extrae category y q de la URL para resaltar el nav y pre-poblar el input
  const urlSearchParams = new URLSearchParams(location.search);
  const activeCategory = isHome ? (urlSearchParams.get("category") ?? null) : null;
  const urlQ = isHome ? (urlSearchParams.get("q") ?? "") : "";

  // ── Estado del input de búsqueda ─────────────────────────────────────────
  // El input se sincroniza con la URL cuando el usuario navega (e.g. al clic
  // en una categoría, la búsqueda activa se preserva; al limpiar desde index,
  // el input también se vacía).
  const [inputValue, setInputValue] = useState(urlQ);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sincroniza el input con el parámetro `q` de la URL en cada navegación
  useEffect(() => {
    setInputValue(urlQ);
  }, [urlQ]);

  // Cuando se abre la barra mobile, enfoca el input automáticamente
  useEffect(() => {
    if (mobileSearchOpen) inputRef.current?.focus();
  }, [mobileSearchOpen]);

  // Ejecuta la búsqueda: navega a /?q=término (limpia la categoría para que
  // la búsqueda no quede confinada a un solo departamento por defecto)
  function submitSearch(value: string) {
    const trimmed = value.trim();
    void navigate({
      to: "/",
      search: { q: trimmed || undefined, category: undefined },
    });
    setMobileSearchOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") submitSearch(inputValue);
    if (e.key === "Escape") {
      setInputValue("");
      setMobileSearchOpen(false);
    }
  }

  function clearSearch() {
    setInputValue("");
    void navigate({ to: "/", search: { q: undefined, category: undefined } });
    inputRef.current?.focus();
  }

  // ── Contadores reactivos (bolsa + wishlist) ─────────────────────────────
  const [cartCount, setCartCount] = useState<number>(0);
  const [wishlistCount, setWishlistCount] = useState<number>(0);

  useEffect(() => {
    setCartCount(readCartCount());
    const updateCount = () => setCartCount(readCartCount());
    window.addEventListener("cart-updated", updateCount);
    return () => window.removeEventListener("cart-updated", updateCount);
  }, []);

  useEffect(() => {
    setWishlistCount(readWishlistCount());
    const updateWishlist = () => setWishlistCount(readWishlistCount());
    window.addEventListener("wishlist-updated", updateWishlist);
    return () => window.removeEventListener("wishlist-updated", updateWishlist);
  }, []);

  // ── Sesión del cliente ────────────────────────────────────────────────────
  // Empieza en null (servidor no tiene acceso a localStorage).
  // Se hidrata en el cliente al montar y se actualiza con el evento "auth-updated"
  // que disparan /login y /register tras un inicio de sesión exitoso.
  // TODO: reemplazar readSession() con supabase.auth.getSession() +
  //       supabase.auth.onAuthStateChange() cuando conectes Supabase.
  const [currentUser, setCurrentUser] = useState<CustomerSession | null>(null);

  useEffect(() => {
    // Hidratación inicial
    setCurrentUser(readSession());

    // Actualiza el header en tiempo real cuando la sesión cambia
    const syncAuth = () => setCurrentUser(readSession());
    window.addEventListener("auth-updated", syncAuth);
    return () => window.removeEventListener("auth-updated", syncAuth);
  }, []);

  // Limpia sesión + carrito, notifica al header y redirige al inicio
  function handleLogout() {
    localStorage.removeItem("rousse-session");
    localStorage.removeItem("rousse-cart");

    // Notifica a todos los listeners para que actualicen su estado reactivo
    window.dispatchEvent(new Event("auth-updated"));
    window.dispatchEvent(new Event("cart-updated"));

    void navigate({ to: "/", search: { category: undefined, q: undefined } });
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-surface shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex w-full max-w-container-max flex-col px-margin-mobile py-4 md:px-margin-desktop">

        {/* ── Fila superior: Logo + Buscador + Iconos de acción ── */}
        <div className="flex w-full items-center gap-3 md:gap-4 lg:gap-5">

          {/* Logo — lleva al inicio limpiando categoría y búsqueda */}
          <Link
            to="/"
            search={{ category: undefined, q: undefined }}
            className="flex shrink-0 items-center gap-2 transition-opacity duration-300 hover:opacity-70 sm:gap-3"
          >
            <img
              src="/logo.png"
              alt="Rousse Shopping"
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
            <span className="hidden font-headline-lg text-headline-lg font-medium tracking-tight text-primary sm:block">
              {t("brand")}
            </span>
          </Link>

          {/* ── Buscador — desktop (ocupa el espacio entre logo e iconos) ── */}
          <div className="relative hidden min-w-0 flex-1 md:block md:min-w-[16rem] lg:min-w-[22rem]">
            <div
              className={cn(
                "flex items-center rounded-full border bg-surface-container-low px-4 py-2.5 transition-colors duration-300 lg:px-5 lg:py-3",
                inputValue
                  ? "border-primary bg-surface"
                  : "border-outline-variant focus-within:border-primary focus-within:bg-surface",
              )}
            >
              <button
                type="button"
                aria-label="Buscar"
                onClick={() => submitSearch(inputValue)}
                className="mr-2 shrink-0 text-outline transition-colors hover:text-primary"
              >
                <Search aria-hidden className={cn("size-5", iconStroke)} />
              </button>
              <input
                ref={inputRef}
                type="search"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full min-w-0 border-none bg-transparent font-body-md text-body-md text-on-surface outline-none placeholder:text-outline focus:ring-0 lg:text-base"
                placeholder={t("search_placeholder")}
                aria-label={t("search_aria")}
              />
              {/* Botón X — limpia la búsqueda y la URL */}
              {inputValue && (
                <button
                  type="button"
                  aria-label={t("search_clear")}
                  onClick={clearSearch}
                  className="ml-2 shrink-0 rounded-full p-0.5 text-outline transition-colors hover:bg-surface-container hover:text-primary"
                >
                  <X aria-hidden className="size-4 stroke-[2]" />
                </button>
              )}
            </div>
          </div>

          {/* Iconos de acción: idioma, wishlist, bolsa, perfil, búsqueda mobile */}
          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-4 lg:gap-5">
            <LanguageSwitcher className="hidden sm:flex" />

            <Link
              to="/wishlist"
              aria-label={
                wishlistCount > 0
                  ? t(
                      wishlistCount === 1
                        ? "wishlist_aria_count_one"
                        : "wishlist_aria_count_other",
                      { count: wishlistCount },
                    )
                  : t("wishlist_aria")
              }
              className="relative text-on-surface-variant transition-opacity duration-300 hover:opacity-70"
            >
              <Heart aria-hidden className={cn("size-6", iconStroke)} />
              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-on-secondary">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Bolsa — badge reactivo: se oculta cuando el carrito está vacío */}
            <Link
              to="/bag"
              aria-label={
                cartCount > 0
                  ? t(cartCount === 1 ? "bag_aria_count_one" : "bag_aria_count_other", {
                      count: cartCount,
                    })
                  : t("bag_aria")
              }
              className="relative text-on-surface-variant transition-opacity duration-300 hover:opacity-70"
            >
              <ShoppingBag aria-hidden className={cn("size-6", iconStroke)} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            {/* ── Perfil: condicional según sesión activa ── */}
            {currentUser ? (
              // ── AUTENTICADO: saludo + botón de logout ──────────────────────
              <div className="flex items-center gap-2">
                {/* Avatar inicial + nombre (solo desktop) */}
                <Link
                  to="/my-orders"
                  className="hidden items-center gap-1.5 text-sm font-medium text-on-surface-variant transition-colors hover:text-primary sm:flex"
                  title={t("nav_my_orders")}
                >
                  <ClipboardList aria-hidden className="size-4 stroke-[1.5]" />
                  <span className="max-w-[100px] truncate">{t("nav_my_orders")}</span>
                </Link>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden max-w-[120px] truncate text-sm font-medium text-primary md:block">
                    {t("hello_user", { name: currentUser.name.split(" ")[0] })}
                  </span>
                </div>

                {/* Botón logout — icono siempre visible, tooltip en hover */}
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label={t("logout_aria")}
                  title={t("logout_aria")}
                  className="flex items-center gap-1.5 rounded-full border border-outline-variant px-2 py-1.5 text-on-surface-variant transition-colors hover:border-error/40 hover:bg-error/5 hover:text-error"
                >
                  <LogOut aria-hidden className="size-4 stroke-[1.5]" />
                  <span className="hidden text-xs font-medium sm:block">{t("logout_btn")}</span>
                </button>
              </div>
            ) : (
              // ── NO AUTENTICADO: link a login ────────────────────────────────
              // TODO: cuando Supabase esté listo, este Link también puede abrir
              //       un modal de auth (supabase.auth.signInWithOAuth, etc.)
              <Link
                to="/login"
                aria-label={t("login_aria")}
                className="flex items-center gap-1.5 text-on-surface-variant transition-colors duration-300 hover:text-primary"
              >
                <CircleUser aria-hidden className={cn("size-6", iconStroke)} />
                <span className="hidden text-sm font-medium sm:block">{t("login_btn")}</span>
              </Link>
            )}
            {/* Ícono de búsqueda en móvil — abre/cierra la barra expandible */}
            <button
              type="button"
              aria-label={t("search_aria")}
              onClick={() => setMobileSearchOpen((v) => !v)}
              className={cn(
                "transition-colors duration-300 md:hidden",
                mobileSearchOpen ? "text-primary" : "text-on-surface-variant hover:opacity-70",
              )}
            >
              <Search aria-hidden className={cn("size-6", iconStroke)} />
            </button>
          </div>
        </div>

        {/* ── Buscador expandible en móvil ── */}
        {mobileSearchOpen && (
          <div className="mt-3 flex items-center gap-2 rounded-full border border-primary bg-surface px-4 py-2 md:hidden">
            <Search aria-hidden className={cn("size-4 shrink-0 text-primary", iconStroke)} />
            <input
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full border-none bg-transparent text-sm text-on-surface outline-none placeholder:text-outline focus:ring-0"
              placeholder={t("search_placeholder_mobile")}
            />
            {inputValue && (
              <button type="button" onClick={clearSearch} aria-label={t("search_clear")}>
                <X aria-hidden className="size-4 stroke-[2] text-outline" />
              </button>
            )}
            <button
              type="button"
              onClick={() => submitSearch(inputValue)}
              className="ml-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-on-primary"
            >
              {t("search_btn")}
            </button>
          </div>
        )}

        {/* Selector de idioma visible solo en móvil (debajo del buscador o en la fila superior) */}
        <LanguageSwitcher className="mt-3 sm:hidden" />

        {/* ── Fila inferior: Nav de categorías ── */}
        {/*
         * Cada Link navega a /?category=X (sin recargar la página).
         * El catálogo en index.tsx lee ese parámetro y filtra automáticamente.
         * `isActive` resalta visualmente la categoría actualmente seleccionada.
         */}
        <nav
          aria-label="Categorías de la tienda"
          className="hide-scrollbar mt-5 hidden w-full items-center justify-start overflow-x-auto whitespace-nowrap border-t border-surface-container-highest pt-4 md:flex"
        >
          <ul className="flex items-center gap-4 lg:gap-6">
            {navItems.map((item) => {
              const { Icon } = item;
              // Un nav item está activo si estamos en "/" y su categoría coincide con la URL
              const isActive = activeCategory === item.category;

              return (
                <li key={item.category}>
                  <Link
                    to="/"
                    search={{ category: item.category, q: undefined }}
                    className={cn(
                      "flex items-center gap-2 py-2 pl-0 pr-2 transition-colors duration-200 lg:pr-3",
                      isActive
                        ? "border-b-2 border-primary font-bold text-primary"
                        : "border-b-2 border-transparent text-on-surface-variant hover:text-primary",
                    )}
                  >
                    <Icon
                      aria-hidden
                      className={cn("size-5 shrink-0", iconStroke, isActive && "fill-primary/10")}
                    />
                    <span className="font-label-md text-label-md uppercase tracking-widest">
                      {t(item.labelKey)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

      </div>
    </header>
  );
}

export function SiteFooter() {
  const { t, locale } = useI18n();
  const whatsappUrl = buildStoreWhatsAppUrl(locale);

  return (
    <footer className="mt-auto w-full border-t border-surface-container-highest bg-surface-container">
      <div className="mx-auto grid w-full max-w-container-max grid-cols-1 gap-stack-lg px-margin-mobile py-stack-lg md:grid-cols-3 md:px-margin-desktop">
        <div className="flex flex-col gap-6">
          <span className="font-headline-md text-headline-md font-bold text-primary">
            {t("brand")}
          </span>
          <p className="max-w-sm font-body-md text-body-md text-on-surface-variant">
            {t("footer_tagline")}
          </p>
          <div className="mt-2 flex flex-wrap gap-4">
            <a
              href={STORE_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
            >
              <Instagram aria-hidden className={cn("size-5", iconStroke)} />
            </a>
            <a
              href={`mailto:${STORE_EMAIL}`}
              aria-label={t("footer_email")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
            >
              <Mail aria-hidden className={cn("size-5", iconStroke)} />
            </a>
            <button
              type="button"
              onClick={() => openWhatsApp(whatsappUrl)}
              aria-label={t("footer_whatsapp")}
              title={formatWhatsAppDisplayNumber()}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#25D366]/40 text-[#25D366] transition-colors hover:bg-[#25D366]/10"
            >
              <MessageCircle aria-hidden className={cn("size-5", iconStroke)} />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="mb-2 font-label-md text-label-md uppercase tracking-widest text-primary">
            {t("footer_explore")}
          </h4>
          <ul className="flex flex-col gap-3">
            <li>
              <Link
                to="/contacto"
                className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-secondary"
              >
                {t("footer_location")}
              </Link>
            </li>
            <li>
              <Link
                to="/contacto"
                className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-secondary"
              >
                {t("footer_hours_title")}
              </Link>
            </li>
            <li>
              <Link
                to="/contacto"
                className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-secondary"
              >
                {t("footer_contact")}
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={() => openWhatsApp(whatsappUrl)}
                className="text-left font-body-md text-body-md text-on-surface-variant transition-colors hover:text-[#25D366]"
              >
                {t("footer_whatsapp")}
              </button>
            </li>
            {STORE_FACEBOOK_URL ? (
              <li>
                <a
                  href={STORE_FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-secondary"
                >
                  Facebook
                </a>
              </li>
            ) : null}
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="mb-2 font-label-md text-label-md uppercase tracking-widest text-primary">
            {t("footer_visit")}
          </h4>
          <a
            href={STORE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block h-40 w-full overflow-hidden rounded bg-surface-variant"
          >
            <img
              alt="Map of Oaxaca location"
              className="h-full w-full object-cover opacity-80 grayscale transition-opacity group-hover:opacity-100 group-hover:grayscale-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFZG9TMJp1TjIT18sJ_nCkgPtnxUL8qn5HV-9pIOmpVa1hUrDNUct8FOdsfLLkbJT4xrtG0PSjPjfPdcpQaYGWF4oWThBNvPuCJJMzmFaYMpAxw29UoG3G9QYWEa9Xf7Xg4mzdQ3vzCBg8FRQIvmP5oXDJN7TmOZuQr4xamb8cgQTT1edlREESY-WICFheyOLreegPvc8WgJdWkZU7uYrcJ3cmHayw9VRVkA85TNtfteJICP3TJfj3ZinWhxQyarl3c8nIS4yey3g"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <MapPin
                aria-hidden
                className={cn("size-8 text-secondary drop-shadow-md", iconStroke)}
                fill="currentColor"
              />
            </div>
          </a>
          <p className="mt-2 font-body-md text-sm text-on-surface-variant">
            {formatStoreAddress(locale)}
            <br />
            {t("footer_hours")}
            <br />
            <span className="text-primary">{formatWhatsAppDisplayNumber()}</span>
          </p>
        </div>
      </div>
      <div className="w-full border-t border-surface-container-highest">
        <div className="mx-auto flex max-w-container-max flex-col items-center justify-between gap-4 px-margin-mobile py-6 md:flex-row md:px-margin-desktop">
          <span className="font-body-md text-sm text-on-surface-variant">
            {t("footer_copyright")}
          </span>
          <div className="flex gap-4">
            <Link
              to="/legal/privacidad"
              className="text-xs text-on-surface-variant transition-colors hover:text-primary"
            >
              {t("footer_privacy")}
            </Link>
            <Link
              to="/legal/terminos"
              className="text-xs text-on-surface-variant transition-colors hover:text-primary"
            >
              {t("footer_terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
