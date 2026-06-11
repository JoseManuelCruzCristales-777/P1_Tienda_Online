import type { CartItem } from "@/lib/cart";

export type OrderStatus = "pending" | "confirmed" | "cancelled" | "picked_up";

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export type PlaceOrderInput = Pick<
  Order,
  "items" | "total" | "customerName" | "customerPhone" | "customerEmail" | "customerId"
>;

export function createOrderId(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  return `RS-${stamp}`;
}

/** Etiqueta visible con prefijo # (no usar en URLs). */
export function formatOrderId(id: string): string {
  return id.startsWith("#") ? id : `#${id}`;
}

export function countOrdersByStatus(orders: Order[]): Record<OrderStatus, number> {
  const counts: Record<OrderStatus, number> = {
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    picked_up: 0,
  };

  for (const order of orders) {
    counts[order.status] += 1;
  }

  return counts;
}
