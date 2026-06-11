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
      <div className="absolute bottom-0 left-0 flex w-full flex-col justify-end p-4 sm:p-6 md:p-8">
        {product.featuredLabel ? (
          <span className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-secondary-fixed sm:mb-2 sm:text-label-md">
            {product.featuredLabel}
          </span>
        ) : null}
        <h3 className="mb-1 text-lg font-medium leading-tight text-on-primary sm:text-headline-md">
          {product.title}
        </h3>
        {summary ? (
          <p className="line-clamp-2 text-xs leading-relaxed text-surface-bright/90 sm:text-sm md:line-clamp-none md:text-body-md md:opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100">
            {summary}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
