import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";

import { FeaturedProductCard } from "@/components/catalog/FeaturedProductCard";
import { ProductCard } from "@/components/catalog/ProductCard";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { catalogKeys, partitionCatalogProducts, useProducts } from "@/lib/catalog/queries";
import { fetchProducts } from "@/lib/api/products.functions";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: catalogKeys.all,
      queryFn: () => fetchProducts(),
    });
  },
  head: () => ({
    meta: [
      { title: "Rousse Shopping | Premium Catalog" },
      {
        name: "description",
        content:
          "Discover the Signature Autumn Collection — luxury fashion, fragrances and accessories curated in Oaxaca.",
      },
      { property: "og:title", content: "Rousse Shopping | Premium Catalog" },
      { property: "og:description", content: "Discover the Signature Autumn Collection." },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: products, isLoading, error } = useProducts();
  const { featured, standard } = partitionCatalogProducts(products ?? []);
  const shopTarget = featured ?? standard[0];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-container-max flex-grow pb-stack-lg">
        <section className="group relative mb-stack-lg h-[600px] w-full overflow-hidden bg-surface-container-low">
          <div
            className="absolute inset-0 h-full w-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCDcP_WICME9a0_gY_cY9wvrDK9YRJDgBreXcve3Bu9DvcICTWJrHj-bGzt5IOluulH9vt-az2j8D3zNzROEV5EaI5aq5_MBdxfOcgLYt1X-3WM1D6sNWxz_HZNG37PgRcAp_eodFy4dLmgTqkNpKVy-eEnbWSD2S_RTumifX_KRacsY5sSVixMobZ2JbE0q4k7SKZZQ7dKtCu0qXwZNNVrj7UW-1efeJphgaycnfoKOrIEkEEjrawDureV6OB7O6R5_y3qp50gs5I')",
            }}
          >
            <div className="absolute inset-0 bg-black/30" />
          </div>
          <div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-6 text-center md:px-20">
            <span className="mb-4 rounded bg-black/30 px-3 py-1 font-label-md text-label-md uppercase tracking-widest text-secondary-fixed backdrop-blur-sm">
              Exquisite Arrivals
            </span>
            <h1 className="mb-6 font-headline-xl text-headline-xl text-on-primary drop-shadow-md">
              The Signature
              <br />
              Autumn Collection
            </h1>
            <p className="mb-10 max-w-2xl font-body-lg text-body-lg text-surface-bright drop-shadow-sm">
              Discover meticulously curated pieces designed to elevate your everyday elegance.
              Exclusive items available only at Rousse.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {shopTarget ? (
                <Link
                  to="/product/$productId"
                  params={{ productId: shopTarget.id }}
                  className="bg-primary px-8 py-4 font-label-md text-label-md uppercase text-on-primary shadow-lg transition-colors hover:bg-primary-container"
                >
                  Shop Collection
                </Link>
              ) : (
                <span className="bg-primary px-8 py-4 font-label-md text-label-md uppercase text-on-primary opacity-60">
                  Shop Collection
                </span>
              )}
              <Link
                to="/product"
                className="border border-on-primary bg-transparent px-8 py-4 font-label-md text-label-md uppercase text-on-primary backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                Explore Boutique
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-stack-lg px-margin-mobile md:px-margin-desktop">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="mb-2 font-headline-lg text-headline-lg text-primary">Curated Selections</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Handpicked essentials for the modern connoisseur.
              </p>
            </div>
            <Link
              to="/product"
              className="hidden items-center gap-1 border-b border-transparent pb-1 font-label-md text-label-md uppercase text-primary transition-colors hover:border-secondary hover:text-secondary md:flex"
            >
              View All <ArrowRight className="size-4 stroke-[1.5]" aria-hidden />
            </Link>
          </div>

          {isLoading ? (
            <p className="text-on-surface-variant">Loading catalog…</p>
          ) : null}
          {error ? (
            <p className="text-error">Could not load products. Please refresh.</p>
          ) : null}

          {!isLoading && !error ? (
            <div className="grid auto-rows-[300px] grid-cols-1 gap-6 md:grid-cols-4">
              {featured ? <FeaturedProductCard product={featured} /> : null}

              {standard.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}

              <div className="group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-primary p-8 text-center shadow-sm transition-all duration-300 hover:shadow-md md:col-span-1 md:row-span-2">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-secondary">
                  <Sparkles className="size-8 stroke-[1.5] text-secondary" aria-hidden />
                </div>
                <h3 className="mb-4 font-headline-md text-headline-md text-on-primary">
                  Rousse VIP
                  <br />
                  Membership
                </h3>
                <p className="mb-8 font-body-md text-body-md text-on-primary-container">
                  Unlock exclusive collections, private styling sessions, and early access to sales.
                </p>
                <button
                  type="button"
                  className="bg-secondary-container px-6 py-2 font-label-md text-label-md uppercase text-on-secondary-container transition-colors hover:bg-secondary-fixed"
                >
                  Join Now
                </button>
              </div>
            </div>
          ) : null}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
