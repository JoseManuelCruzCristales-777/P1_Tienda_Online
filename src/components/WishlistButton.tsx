import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useI18n } from "@/lib/i18n/I18nProvider";
import type { WishlistItem } from "@/lib/wishlist";
import { isInWishlist, notifyWishlistUpdated, toggleWishlist } from "@/lib/wishlist";
import { cn } from "@/lib/utils";

type WishlistButtonProps = {
  product: WishlistItem;
  className?: string;
  iconClassName?: string;
  /** Evita que un Link padre capture el clic (tarjetas de producto). */
  stopPropagation?: boolean;
};

export function WishlistButton({
  product,
  className,
  iconClassName,
  stopPropagation = false,
}: WishlistButtonProps) {
  const { t } = useI18n();
  const [saved, setSaved] = useState(() => isInWishlist(product.id));

  useEffect(() => {
    setSaved(isInWishlist(product.id));
    const sync = () => setSaved(isInWishlist(product.id));
    window.addEventListener("wishlist-updated", sync);
    return () => window.removeEventListener("wishlist-updated", sync);
  }, [product.id]);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (stopPropagation) {
      e.preventDefault();
      e.stopPropagation();
    }
    const { added } = toggleWishlist(product);
    notifyWishlistUpdated();
    toast.success(added ? t("wishlist_added_toast") : t("wishlist_removed_toast"));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? t("wishlist_remove_aria") : t("wishlist_add_aria")}
      aria-pressed={saved}
      className={cn(
        "flex items-center justify-center rounded-full transition-colors",
        saved ? "text-primary" : "text-on-surface-variant hover:text-primary",
        className,
      )}
    >
      <Heart
        aria-hidden
        className={cn("size-4 stroke-[1.5]", saved && "fill-primary", iconClassName)}
      />
    </button>
  );
}
