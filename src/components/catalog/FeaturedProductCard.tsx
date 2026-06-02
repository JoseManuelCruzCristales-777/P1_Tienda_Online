import { Link } from "@tanstack/react-router";

import type { Product } from "@/lib/catalog/types";

type FeaturedProductCardProps = {
  product: Product;
};

export function FeaturedProductCard({ product }: FeaturedProductCardProps) {
  return (
    <Link
      to="/product/$productId"
      params={{ productId: product.id }}
      className="group relative cursor-pointer overflow-hidden bg-surface shadow-sm transition-all duration-500 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] md:col-span-2 md:row-span-2"
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url('${product.imageUrl}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
      <div className="absolute bottom-0 left-0 flex w-full flex-col justify-end p-8">
        {product.featuredLabel ? (
          <span className="mb-2 font-label-md text-label-md uppercase text-secondary-fixed">
            {product.featuredLabel}
          </span>
        ) : null}
        <h3 className="mb-1 font-headline-md text-headline-md text-on-primary">{product.title}</h3>
        {product.excerpt ? (
          <p className="h-0 overflow-hidden font-body-md text-body-md text-surface-bright/80 opacity-0 transition-opacity duration-300 group-hover:h-auto group-hover:opacity-100">
            {product.excerpt}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
