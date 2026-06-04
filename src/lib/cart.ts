// ---------------------------------------------------------------------------
// Cart helpers — persisted in localStorage under "rousse-cart".
// All operations return the updated cart array for easy state sync in components.
// ---------------------------------------------------------------------------

import type { Product } from "@/lib/catalog/types";

export interface CartItem {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  quantity: number;
}

const CART_KEY = "rousse-cart";

// ── Reads ──────────────────────────────────────────────────────────────────

/** Returns all items currently in the cart. */
export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

/** Number of individual units across all cart items (badge count). */
export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Extracts a numeric MXN price from any string format.
 * "$350 MXN" → 350 | "$4,500 MXN" → 4500 | "280" → 280
 */
function parsePriceMXN(price: string): number {
  const cleaned = price.replace(/[$,\s]/gi, "").replace(/MXN/gi, "");
  return parseFloat(cleaned) || 0;
}

/** Calculates the total value of the cart in MXN. */
export function getCartTotal(): number {
  return getCart().reduce((sum, item) => sum + parsePriceMXN(item.price) * item.quantity, 0);
}

// ── Writes ─────────────────────────────────────────────────────────────────

function saveCart(cart: CartItem[]): CartItem[] {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  return cart;
}

/**
 * Adds a product to the cart.
 * If the product already exists, increments its quantity by 1.
 */
export function addToCart(product: Pick<Product, "id" | "title" | "price" | "imageUrl">): CartItem[] {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  const updated: CartItem[] = existing
    ? cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
      )
    : [...cart, { ...product, quantity: 1 }];

  return saveCart(updated);
}

/**
 * Removes a product entirely from the cart by its id.
 * Returns the updated cart.
 */
export function removeFromCart(id: string): CartItem[] {
  return saveCart(getCart().filter((item) => item.id !== id));
}

/**
 * Sets a specific quantity for a cart item.
 * If quantity ≤ 0, the item is removed completely.
 */
export function updateCartQuantity(id: string, quantity: number): CartItem[] {
  if (quantity <= 0) return removeFromCart(id);
  return saveCart(
    getCart().map((item) => (item.id === id ? { ...item, quantity } : item)),
  );
}

/** Empties the entire cart (e.g. after order confirmation). */
export function clearCart(): CartItem[] {
  return saveCart([]);
}

/** Notifica al header y otros listeners que el carrito cambió. */
export function notifyCartUpdated(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cart-updated"));
  }
}
