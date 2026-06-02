import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

import type { Product } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <Link
      to="/product/$productId"
      params={{ productId: product.id }}
      className={cn(
        "group relative flex cursor-pointer flex-col overflow-hidden border border-surface-container-highest bg-surface shadow-sm transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] md:col-span-1 md:row-span-1",
        className,
      )}
    >
      <div className="relative h-3/4 w-full overflow-hidden bg-surface-container-low">
        <img
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={product.imageUrl}
        />
        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 opacity-0 shadow-sm backdrop-blur-md transition-opacity group-hover:opacity-100">
          <Heart aria-hidden className="size-4 stroke-[1.5] text-primary" />
        </div>
      </div>
      <div className="z-10 flex flex-grow flex-col justify-between bg-surface p-4">
        <h4 className="truncate font-label-md text-label-md text-on-surface">{product.title}</h4>
        <span className="mt-1 font-body-md text-body-md text-on-surface-variant">{product.price}</span>
      </div>
    </Link>
  );
}
