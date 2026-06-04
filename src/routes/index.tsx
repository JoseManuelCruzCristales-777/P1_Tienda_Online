import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { ArrowRight, Sparkles, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

import { FeaturedProductCard } from "@/components/catalog/FeaturedProductCard";
import { PriceRangeSlider } from "@/components/catalog/PriceRangeSlider";
import { ProductCard } from "@/components/catalog/ProductCard";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import {
  applyFilters,
  DEFAULT_PRICE_FILTER_MIN,
  getCatalogPriceBounds,
  parsePriceFilterInput,
  resolvePriceFilterRange,
  catalogKeys,
  partitionCatalogProducts,
  useProducts,
} from "@/lib/catalog/queries";
import { fetchProducts } from "@/lib/api/products.functions";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { isLoggedIn } from "@/lib/session";
import { buildVipWhatsAppUrl, openWhatsApp } from "@/lib/whatsapp";
import {
  CATEGORY_LABEL_KEYS,
  FILTER_CATEGORIES,
  type TranslationKey,
} from "@/lib/i18n/translations";

// ─────────────────────────────────────────────────────────────────────────────
// DEFINICIÓN DE RUTA  (TanStack Router)
// validateSearch le dice al router qué parámetros acepta esta URL.
// Ejemplo: /?category=Boutique  →  { category: "Boutique" }
// Cuando no hay parámetro, category es undefined (sin filtro = mostrar todo).
// ─────────────────────────────────────────────────────────────────────────────
export const Route = createFileRoute("/")({
  // Precarga los productos en el servidor antes de renderizar la página
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: catalogKeys.all,
      queryFn: () => fetchProducts(),
    });
  },

  // Declara y valida los parámetros de búsqueda que acepta esta URL.
  // Ejemplo: /?category=Perfumes&q=rose  →  { category: "Perfumes", q: "rose" }
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === "string" ? search.category : undefined,
    q: typeof search.q === "string" && search.q.trim() ? search.q.trim() : undefined,
  }),

  // Meta-tags para SEO y Open Graph
  head: () => ({
    meta: [
      { title: "Rousse Shopping | Catálogo Premium" },
      {
        name: "description",
        content: "Descubre la Colección Otoño — moda, fragancias y accesorios exclusivos en Oaxaca.",
      },
      { property: "og:title", content: "Rousse Shopping | Catálogo Premium" },
    ],
  }),

  component: Index,
});

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
function categoryTitle(category: string, t: (key: TranslationKey) => string): string {
  const key = CATEGORY_LABEL_KEYS[category];
  return key ? t(key) : category;
}

function Index() {
  const { t, locale } = useI18n();
  // Lee category y q (término de búsqueda) directamente desde la URL
  const { category: urlCategory, q: urlQ } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });

  const handleVipJoin = useCallback(() => {
    if (isLoggedIn()) {
      openWhatsApp(buildVipWhatsAppUrl(locale));
      return;
    }
    void navigate({ to: "/register" });
  }, [locale, navigate]);

  // Precio: texto libre en inputs (vacío en máximo = sin tope)
  const [minPriceInput, setMinPriceInput] = useState(String(DEFAULT_PRICE_FILTER_MIN));
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // selectedCategory y searchTerm vienen de la URL; null/undefined = sin filtro
  const selectedCategory = urlCategory ?? null;
  const searchTerm = urlQ ?? "";

  // Actualiza la categoría en la URL conservando el término de búsqueda activo
  const setSelectedCategory = (cat: string | null) => {
    void navigate({
      to: "/",
      search: { category: cat ?? undefined, q: urlQ },
    });
  };

  // ── Datos del catálogo ────────────────────────────────────────────────────
  // useProducts() usa React Query: devuelve caché instantáneo en re-renders.
  const { data: allProducts = [], isLoading, error } = useProducts();

  const catalogBounds = useMemo(
    () => getCatalogPriceBounds(allProducts),
    [allProducts],
  );

  const priceRange = useMemo(
    () => resolvePriceFilterRange(minPriceInput, maxPriceInput),
    [minPriceInput, maxPriceInput],
  );

  /** Escala de la barra y sliders: catálogo + lo que el usuario escriba. */
  const sliderMax = useMemo(() => {
    const typedMin = parsePriceFilterInput(minPriceInput) ?? 0;
    const typedMax = parsePriceFilterInput(maxPriceInput);
    return Math.max(catalogBounds.max, typedMax ?? 0, typedMin, 1);
  }, [catalogBounds.max, minPriceInput, maxPriceInput]);

  // Aplica los filtros activos (texto libre + categoría + rango de precio)
  const filtered = applyFilters(allProducts, {
    searchTerm,
    category: selectedCategory,
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
  });

  // Separa el producto destacado (layoutRole: "featured") del resto
  const { featured, standard } = partitionCatalogProducts(filtered);

  // El botón "Shop Collection" del hero siempre apunta al producto destacado global
  const shopTarget = allProducts.find((p) => p.layoutRole === "featured") ?? allProducts[0];

  // Hay filtro activo si hay texto, categoría, o rango de precio modificado
  const hasPriceFilter =
    (parsePriceFilterInput(minPriceInput) ?? DEFAULT_PRICE_FILTER_MIN) > DEFAULT_PRICE_FILTER_MIN ||
    parsePriceFilterInput(maxPriceInput) !== null;

  const hasActiveFilters =
    !!searchTerm || selectedCategory !== null || hasPriceFilter;

  // Resetea TODOS los filtros: borra URL params y restaura precios por defecto
  const clearFilters = () => {
    void navigate({ to: "/", search: { category: undefined, q: undefined } });
    setMinPriceInput(String(DEFAULT_PRICE_FILTER_MIN));
    setMaxPriceInput("");
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header global con navegación de categorías */}
      <SiteHeader />

      <main className="mx-auto w-full max-w-container-max flex-grow pb-stack-lg">

        {/* ── HERO ── imagen de fondo con overlay y CTA principal ── */}
        <section className="group relative mb-stack-lg h-[600px] w-full overflow-hidden bg-surface-container-low">
          {/* Imagen de fondo con zoom suave al hacer hover */}
          <div
            className="absolute inset-0 h-full w-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCDcP_WICME9a0_gY_cY9wvrDK9YRJDgBreXcve3Bu9DvcICTWJrHj-bGzt5IOluulH9vt-az2j8D3zNzROEV5EaI5aq5_MBdxfOcgLYt1X-3WM1D6sNWxz_HZNG37PgRcAp_eodFy4dLmgTqkNpKVy-eEnbWSD2S_RTumifX_KRacsY5sSVixMobZ2JbE0q4k7SKZZQ7dKtCu0qXwZNNVrj7UW-1efeJphgaycnfoKOrIEkEEjrawDureV6OB7O6R5_y3qp50gs5I')",
            }}
          >
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* Contenido centrado sobre la imagen */}
          <div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-6 text-center md:px-20">
            <span className="mb-4 rounded bg-black/30 px-3 py-1 font-label-md text-label-md uppercase tracking-widest text-secondary-fixed backdrop-blur-sm">
              {t("hero_badge")}
            </span>
            <h1 className="mb-6 font-headline-xl text-headline-xl text-on-primary drop-shadow-md">
              {t("hero_title_1")}
              <br />
              {t("hero_title_2")}
            </h1>
            <p className="mb-10 max-w-2xl font-body-lg text-body-lg text-surface-bright drop-shadow-sm">
              {t("hero_subtitle")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {shopTarget ? (
                <Link
                  to="/product/$productId"
                  params={{ productId: shopTarget.id }}
                  className="bg-primary px-8 py-4 font-label-md text-label-md uppercase text-on-primary shadow-lg transition-colors hover:bg-primary-container"
                >
                  {t("hero_shop")}
                </Link>
              ) : null}
              {/* Abre el panel de filtros y hace scroll al catálogo */}
              <button
                type="button"
                onClick={() => setShowFilters(true)}
                className="border border-on-primary bg-transparent px-8 py-4 font-label-md text-label-md uppercase text-on-primary backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                {t("hero_explore")}
              </button>
            </div>
          </div>
        </section>

        {/* ── SECCIÓN CATÁLOGO ── */}
        <section className="mb-stack-lg px-margin-mobile md:px-margin-desktop">

          {/* Encabezado: título + contador de resultados + botones de filtro */}
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="mb-1 font-headline-lg text-headline-lg text-primary">
                {searchTerm
                  ? `"${searchTerm}"`
                  : selectedCategory
                    ? categoryTitle(selectedCategory, t)
                    : t("catalog_title")}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {isLoading
                  ? t("catalog_loading")
                  : t("catalog_count", { shown: filtered.length, total: allProducts.length })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Botón que abre/cierra el panel de filtros */}
              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  hasActiveFilters
                    ? "border-primary bg-primary text-on-primary"
                    : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                }`}
              >
                <SlidersHorizontal className="size-4 stroke-[1.5]" aria-hidden />
                {t("catalog_filters")}
                {/* Indicador visual de filtro activo */}
                {hasActiveFilters && (
                  <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-on-primary text-[10px] font-bold text-primary">
                    ✓
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-on-surface-variant transition-colors hover:text-error"
                >
                  <X className="size-4 stroke-[1.5]" aria-hidden />
                  {t("catalog_clear")}
                </button>
              )}

              <Link
                to="/product"
                className="hidden items-center gap-1 border-b border-transparent pb-1 font-label-md text-label-md uppercase text-primary transition-colors hover:border-secondary hover:text-secondary md:flex"
              >
                {t("catalog_view_all")}{" "}
                <ArrowRight className="size-4 stroke-[1.5]" aria-hidden />
              </Link>
            </div>
          </div>

          {/* ── PANEL DE FILTROS (colapsable) ── */}
          {showFilters && (
            <div className="mb-8 rounded-xl border border-surface-container-highest bg-surface p-5 shadow-sm">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">

                {/* Chips de categoría — al hacer clic actualiza la URL */}
                <div className="flex-1">
                  <p className="mb-3 font-label-md text-xs uppercase tracking-widest text-on-surface-variant">
                    {t("catalog_category")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(null)}
                      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                        selectedCategory === null
                          ? "border-primary bg-primary text-on-primary"
                          : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                      }`}
                    >
                      {t("nav_all")}
                    </button>

                    {FILTER_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                        className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                          selectedCategory === cat
                            ? "border-primary bg-primary text-on-primary"
                            : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                        }`}
                      >
                        {categoryTitle(cat, t)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rango de precio: escribe cualquier monto; máximo vacío = sin tope */}
                <div className="min-w-[280px] flex-1">
                  <p className="mb-1 font-label-md text-xs uppercase tracking-widest text-on-surface-variant">
                    {t("catalog_price_range")}
                  </p>
                  <p className="mb-3 text-[10px] text-on-surface-variant/80">
                    {t("catalog_price_hint", {
                      min: catalogBounds.min,
                      max: catalogBounds.max,
                    })}
                  </p>

                  <div className="mb-4">
                    <PriceRangeSlider
                      minInput={minPriceInput}
                      maxInput={maxPriceInput}
                      sliderMax={sliderMax}
                      onMinInputChange={setMinPriceInput}
                      onMaxInputChange={setMaxPriceInput}
                    />
                  </div>

                  <div className="flex flex-wrap items-end gap-3">
                    <label className="flex min-w-[7rem] flex-col gap-1">
                      <span className="text-[10px] uppercase text-on-surface-variant">
                        {t("catalog_price_min")}
                      </span>
                      <div className="flex items-center rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2">
                        <span className="mr-1 text-xs text-on-surface-variant">$</span>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={minPriceInput}
                          onChange={(e) => setMinPriceInput(e.target.value)}
                          placeholder="0"
                          className="w-20 min-w-0 bg-transparent text-sm text-on-surface outline-none"
                        />
                      </div>
                    </label>
                    <span className="pb-2 text-on-surface-variant">—</span>
                    <label className="flex min-w-[7rem] flex-col gap-1">
                      <span className="text-[10px] uppercase text-on-surface-variant">
                        {t("catalog_price_max")}
                      </span>
                      <div className="flex items-center rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2">
                        <span className="mr-1 text-xs text-on-surface-variant">$</span>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={maxPriceInput}
                          onChange={(e) => setMaxPriceInput(e.target.value)}
                          placeholder={t("catalog_price_max_placeholder")}
                          className="w-20 min-w-0 bg-transparent text-sm text-on-surface outline-none"
                        />
                      </div>
                    </label>
                    <span className="pb-2 text-xs text-on-surface-variant">MXN</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── ESTADOS DEL CATÁLOGO ── */}

          {/* Esqueleto de carga: 8 tarjetas grises animadas */}
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-[300px] animate-pulse rounded bg-surface-container-low" />
              ))}
            </div>

          ) : error ? (
            <p className="text-error">{t("catalog_error")}</p>

          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="font-headline-md text-headline-md text-on-surface-variant">
                {t("catalog_no_results")}
              </p>
              <p className="mt-2 text-body-md text-on-surface-variant">
                {t("catalog_no_results_hint")}
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-full border border-primary px-6 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-on-primary"
              >
                {t("catalog_clear_filters")}
              </button>
            </div>

          ) : (
            /*
             * GRID DE PRODUCTOS
             * - 2 columnas en móvil / 4 en desktop  (regla de diseño Rousse)
             * - auto-rows-[280px]: altura fija por fila para consistencia visual
             * - El producto "featured" ocupa 2 columnas × 2 filas (col-span-2 row-span-2)
             */
            <div className="grid auto-rows-[280px] grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">

              {/* Tarjeta destacada — siempre primera, ocupa el doble de espacio */}
              {featured ? (
                <div className="col-span-2 row-span-2">
                  <FeaturedProductCard product={featured} className="h-full" />
                </div>
              ) : null}

              {/* Tarjetas estándar — una por columna */}
              {standard.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}

              {/* Banner VIP — solo visible cuando no hay filtros activos */}
              {!hasActiveFilters && (
                <div className="col-span-2 flex flex-col items-center justify-center gap-4 rounded bg-primary p-6 text-center shadow-sm transition-shadow hover:shadow-md md:col-span-1">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-secondary">
                    <Sparkles className="size-7 stroke-[1.5] text-secondary" aria-hidden />
                  </div>
                  <div>
                    <h3 className="mb-2 font-headline-md text-headline-md text-on-primary">
                      {t("vip_title")}
                    </h3>
                    <p className="font-body-md text-sm text-on-primary-container">
                      {t("vip_desc")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleVipJoin}
                    className="rounded-full bg-secondary-container px-5 py-2 font-label-md text-label-md uppercase text-on-secondary-container transition-colors hover:bg-secondary-fixed"
                  >
                    {isLoggedIn() ? t("vip_join") : t("vip_join_register")}
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
