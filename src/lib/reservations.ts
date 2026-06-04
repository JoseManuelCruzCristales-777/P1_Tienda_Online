import type { CartItem } from "@/lib/cart";
import {
  createOrderId,
  getLastOrder,
  placeOrder,
  type Order,
  type OrderStatus,
} from "@/lib/orders";

/** @deprecated Usa `Order` desde `@/lib/orders`. */
export type Reservation = Order;

export type { OrderStatus };

export function createReservationId(): string {
  return createOrderId();
}

export function saveReservation(
  data: Pick<
    Reservation,
    "items" | "total" | "customerName" | "customerPhone" | "customerEmail"
  > & { customerId?: string },
): Reservation {
  return placeOrder(data);
}

export function getLastReservation(): Reservation | null {
  return getLastOrder();
}

export function clearLastReservation(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("rousse-last-reservation");
}

export type { CartItem };
