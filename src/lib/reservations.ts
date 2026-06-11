import type { CartItem } from "@/lib/cart";
import { createOrderId, type Order, type OrderStatus } from "@/lib/orders";
import { fetchLastOrder, placeOrder } from "@/lib/orders/orders-browser";

/** @deprecated Usa `Order` desde `@/lib/orders`. */
export type Reservation = Order;

export type { OrderStatus };

export function createReservationId(): string {
  return createOrderId();
}

export async function saveReservation(
  data: Pick<
    Reservation,
    "items" | "total" | "customerName" | "customerPhone" | "customerEmail"
  > & { customerId?: string },
): Promise<Reservation> {
  return placeOrder(data);
}

export async function getLastReservation(): Promise<Reservation | null> {
  return fetchLastOrder();
}

export function clearLastReservation(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("rousse-last-reservation");
}

export type { CartItem };
