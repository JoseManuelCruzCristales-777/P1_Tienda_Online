import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight, MessageCircle } from "lucide-react";

import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { catalogKeys, useProduct, useProducts } from "@/lib/catalog/queries";
import { fetchProduct, fetchProducts } from "@/lib/api/products.functions";

export const Route = createFileRoute("/product/$productId")({
  loader: async ({ context, params }) => {
    const { productId } = params;
    try {
      return await context.queryClient.ensureQueryData({
        queryKey: catalogKeys.detail(productId),
        queryFn: () => fetchProduct({ data: { id: productId } }),
      });
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    const title = loaderData?.title ?? "Product";
    const description = loaderData?.description ?? "";
    return {
      meta: [
        { title: `${title} — Rousse Shopping` },
        { name: "description", content: description },
        { property: "og:title", content: `${title} — Rousse Shopping` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const { data: product, isLoading, error } = useProduct(productId);
  const { data: allProducts } = useProducts();

  if (isLoading) {
    return (
      <StoreShell>
        <p className="py-24 text-center text-on-surface-variant">Loading product…</p>
      </StoreShell>
    );
  }

  if (error || !product) {
    throw notFound();
  }

  const related =
    allProducts?.filter((p) => p.id !== product.id).slice(0, 4) ?? [];

  const gallery = [
    product.imageUrl,
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAGmQsTWZDwgsEcTg5k38y4Te9orlD0u_T1JcrbcjfdMQ0u29Uj4Z4FmIvyWkwrFSy5d-gOiJuf7OGhkjtkhk8Yjl7U1msEVdcu5_cVSGnSJXKBFBVgb-B-7s28LYVyNBdMusPYefyaOPXiNvd4A_UflU0RDiC-iBBOCw0pJHmwDBq-vn_-HLrqu_QD8InDlBTwXocRc8We4PGrfdxgVxRKw0Og8AoQrOFVf9pBweQervlMO8tH5CN5rHydY2RJW1Sxk6k2x0UKbbk",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDQR7_nbae5hU-jEtl0Z6enW5YDeen1X77qPrN62oOsJJhMhHafm88eMf8_n16yANaL8emJG3C-3GiXBVHoJ3ZpcDDmebB8Pb6ysAxF0F8LO83dTh9RO38XKuIewFSliJ4R9GNTz5I2MyGZCfC6IYEjFYCcNhWbzbdQvoELoY8QEbtXzyKBRrNzXjTjdvnoVgG0ek6pt3UUd-gpNgJBM_4q_6wQAp3LiIS76QnSkDEJm4D9SnbjurG6NB-OeY5nwo3Y0qy6FX94kiM",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBtB0WCW9pQrzg01rKge7tHMFaS49mLA6awMGF6cQCwtTPlFi2CbHxTd81WtDwZAvJl5icdTUQfS384cn2a0omOL7DaWPtU6GfEM2xSB7wWcSCdUTmvY8NKbSU8GnSFlB3ly1525rNxTBuROpWWpdwfvXqnKFQ88j6jE5jUPIA6GH-bD0acR1xCj8UdAtfavU8WlAipef_ynCf_PKY31Y_0cN25RkjeV3fBLTlAUNNR93fDnv5PUaqZQj4WJ4v5BRSs1dHlbanNtkA",
  ];

  return (
    <StoreShell>
      <nav aria-label="Breadcrumb" className="mb-8 flex font-label-md text-sm text-on-surface-variant">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li>
            <Link to="/" className="transition-colors hover:text-primary">
              Boutique
            </Link>
          </li>
          <li className="flex items-center">
            <ChevronRight className="mx-1 size-4 stroke-[1.5]" aria-hidden />
            <span className="transition-colors hover:text-primary">{product.category}</span>
          </li>
          <li aria-current="page" className="flex items-center">
            <ChevronRight className="mx-1 size-4 stroke-[1.5]" aria-hidden />
            <span className="font-medium text-primary">{product.title}</span>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12 lg:gap-stack-lg">
        <div className="flex flex-col gap-4 lg:col-span-7">
          <div className="aspect-[4/5] w-full overflow-hidden bg-surface-container-lowest md:aspect-square">
            <img
              alt={product.title}
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
              src={product.imageUrl}
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {gallery.map((src, i) => (
              <div
                key={src}
                className={`aspect-square overflow-hidden bg-surface-container-low ${i === 0 ? "border border-primary" : "transition-opacity hover:opacity-80"}`}
              >
                <img alt="" className="h-full w-full object-cover" src={src} />
              </div>
            ))}
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <div className="flex flex-col gap-8 lg:sticky lg:top-[180px]">
            <div className="flex flex-col gap-2 border-b border-surface-container pb-8">
              <h1 className="font-headline-xl text-headline-lg-mobile tracking-tight text-primary md:text-headline-xl">
                {product.title}
              </h1>
              <p className="mt-2 font-body-lg text-body-lg text-on-surface-variant">{product.price}</p>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <Link
                to="/bag"
                className="flex w-full items-center justify-center gap-2 bg-primary py-4 font-label-md text-label-md uppercase tracking-widest text-on-primary shadow-[0_10px_20px_rgba(7,6,40,0.15)] transition-opacity hover:opacity-90"
              >
                Apartar por WhatsApp
                <MessageCircle className="size-5 stroke-[1.5]" aria-hidden />
              </Link>
              <p className="text-center font-body-md text-xs text-on-surface-variant">
                Free shipping on orders over $2,000 MXN. Secure checkout.
              </p>
            </div>

            <div className="mt-4 flex flex-col border-t border-surface-container">
              <details className="group cursor-pointer border-b border-surface-container py-4" open>
                <summary className="flex list-none items-center justify-between font-label-md text-label-md uppercase tracking-widest">
                  Description
                </summary>
                <p className="pt-4 font-body-md text-body-md leading-relaxed text-on-surface-variant">
                  {product.description}
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <div className="mt-24 md:mt-32">
          <h2 className="mb-8 border-b border-surface-container pb-4 font-headline-md text-headline-md text-primary">
            You May Also Like
          </h2>
          <div className="hide-scrollbar flex snap-x snap-mandatory gap-gutter overflow-x-auto pb-8">
            {related.map((item) => (
              <Link
                key={item.id}
                to="/product/$productId"
                params={{ productId: item.id }}
                className="group w-[280px] flex-none snap-start cursor-pointer md:w-[320px]"
              >
                <div className="relative mb-4 aspect-[4/5] overflow-hidden bg-surface-container-low">
                  <img
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={item.imageUrl}
                  />
                </div>
                <div className="flex flex-col items-center text-center">
                  <h3 className="mb-1 font-headline-md text-body-lg font-medium text-primary">
                    {item.title}
                  </h3>
                  <p className="font-body-md text-on-surface-variant">{item.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </StoreShell>
  );
}

function StoreShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-container-max px-margin-mobile py-12 md:px-margin-desktop md:py-stack-lg">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
