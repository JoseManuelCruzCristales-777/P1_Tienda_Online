import type { Product } from "@/lib/catalog/types";

export type WishlistItem = Pick<Product, "id" | "title" | "price" | "imageUrl">;

const WISHLIST_KEY = "rousse-wishlist";

export function getWishlist(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? (JSON.parse(raw) as WishlistItem[]) : [];
  } catch {
    return [];
  }
}

export function getWishlistCount(): number {
  return getWishlist().length;
}

export function isInWishlist(productId: string): boolean {
  return getWishlist().some((item) => item.id === productId);
}

function saveWishlist(items: WishlistItem[]): WishlistItem[] {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  return items;
}

export function addToWishlist(product: WishlistItem): WishlistItem[] {
  if (isInWishlist(product.id)) return getWishlist();
  return saveWishlist([...getWishlist(), product]);
}

export function removeFromWishlist(productId: string): WishlistItem[] {
  return saveWishlist(getWishlist().filter((item) => item.id !== productId));
}

export function toggleWishlist(product: WishlistItem): { items: WishlistItem[]; added: boolean } {
  if (isInWishlist(product.id)) {
    return { items: removeFromWishlist(product.id), added: false };
  }
  return { items: addToWishlist(product), added: true };
}

export function notifyWishlistUpdated(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("wishlist-updated"));
  }
}
