import { Link } from "@tanstack/react-router";

import { shortProductDescription } from "@/lib/catalog/description";
import type { Product } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

type FeaturedProductCardProps = {
  product: Product;
  className?: string;
};

export function FeaturedProductCard({ product, className }: FeaturedProductCardProps) {
  const summary = shortProductDescription(product.description);

  return (
    <Link
      to="/product/$productId"
      params={{ productId: product.id }}
      className={cn(
        "group relative block cursor-pointer overflow-hidden bg-surface shadow-sm transition-all duration-500 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]",
        className,
      )}
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
        {summary ? (
          <p className="h-0 overflow-hidden font-body-md text-body-md text-surface-bright/80 opacity-0 transition-opacity duration-300 group-hover:h-auto group-hover:opacity-100">
            {summary}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
