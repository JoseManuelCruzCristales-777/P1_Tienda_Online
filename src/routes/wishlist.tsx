import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Heart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { WishlistButton } from "@/components/WishlistButton";
import { useProducts } from "@/lib/catalog/queries";
import { homeSearch } from "@/lib/home-search";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { getWishlist, type WishlistItem } from "@/lib/wishlist";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Lista de deseos — Rousse Shopping" },
      { name: "description", content: "Tus productos guardados en Rousse Shopping." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { t } = useI18n();
  const { data: products, isLoading } = useProducts();
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    setItems(getWishlist());
    const sync = () => setItems(getWishlist());
    window.addEventListener("wishlist-updated", sync);
    return () => window.removeEventListener("wishlist-updated", sync);
  }, []);

  const resolved = useMemo(() => {
    if (!products) return items;
    const byId = new Map(products.map((p) => [p.id, p]));
    return items.map((item) => {
      const fresh = byId.get(item.id);
      return fresh
        ? { id: fresh.id, title: fresh.title, price: fresh.price, imageUrl: fresh.imageUrl }
        : item;
    });
  }, [items, products]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <div className="mx-auto w-full max-w-container-max px-margin-mobile py-4 md:px-margin-desktop">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1 text-sm text-on-surface-variant"
        >
          <Link to="/" search={homeSearch} className="transition-colors hover:text-primary">
            {t("legal_home")}
          </Link>
          <ChevronRight aria-hidden className="size-4 stroke-[1.5]" />
          <span className="font-medium text-primary">{t("wishlist_title")}</span>
        </nav>
      </div>

      <main className="mx-auto w-full max-w-container-max flex-grow px-margin-mobile pb-stack-lg md:px-margin-desktop">
        <h1 className="font-headline-lg text-headline-lg text-primary">{t("wishlist_title")}</h1>
        <p className="mt-2 text-body-md text-on-surface-variant">
          {t(resolved.length === 1 ? "wishlist_count_one" : "wishlist_count_other", {
            count: resolved.length,
          })}
        </p>

        {isLoading && resolved.length === 0 ? (
          <p className="mt-12 text-center text-on-surface-variant">{t("catalog_loading")}</p>
        ) : resolved.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <Heart aria-hidden className="size-12 stroke-[1.5] text-outline-variant" />
            <p className="mt-4 font-headline-md text-headline-md text-on-surface">
              {t("wishlist_empty")}
            </p>
            <p className="mt-2 max-w-sm text-sm text-on-surface-variant">
              {t("wishlist_empty_hint")}
            </p>
            <Link
              to="/"
              search={homeSearch}
              className="mt-8 inline-flex rounded-full bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-widest text-on-primary hover:opacity-90"
            >
              {t("wishlist_view_catalog")}
            </Link>
          </div>
        ) : (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resolved.map((item) => (
              <li
                key={item.id}
                className="flex gap-4 border border-surface-container-highest bg-surface p-4 shadow-sm"
              >
                <Link
                  to="/product/$productId"
                  params={{ productId: item.id }}
                  className="h-24 w-20 shrink-0 overflow-hidden bg-surface-container-low"
                >
                  <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <Link
                      to="/product/$productId"
                      params={{ productId: item.id }}
                      className="line-clamp-2 font-medium text-on-surface hover:text-primary"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-sm text-on-surface-variant">{item.price}</p>
                  </div>
                  <WishlistButton
                    product={item}
                    className="mt-2 self-start"
                    iconClassName="size-5"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
