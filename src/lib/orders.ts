import type { CartItem } from "@/lib/cart";

const ORDERS_KEY = "rousse-orders";
const LAST_ORDER_KEY = "rousse-last-reservation";

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

function readOrdersRaw(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function writeOrders(orders: Order[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function setLastOrder(order: Order): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
}

/** Migra un apartado guardado solo como "último" antes de la lista de pedidos. */
function migrateLegacyLastOrder(): void {
  if (typeof window === "undefined") return;
  const existing = readOrdersRaw();
  if (existing.length > 0) return;

  try {
    const raw = localStorage.getItem(LAST_ORDER_KEY);
    if (!raw) return;
    const legacy = JSON.parse(raw) as Order;
    if (!legacy.id || !legacy.items) return;

    const order: Order = {
      ...legacy,
      status: legacy.status ?? "pending",
      updatedAt: legacy.updatedAt ?? legacy.createdAt ?? new Date().toISOString(),
    };
    writeOrders([order]);
  } catch {
    /* ignore corrupt legacy data */
  }
}

export function createOrderId(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  return `RS-${stamp}`;
}

/** Etiqueta visible con prefijo # (no usar en URLs). */
export function formatOrderId(id: string): string {
  return id.startsWith("#") ? id : `#${id}`;
}

export function getOrders(): Order[] {
  migrateLegacyLastOrder();
  return readOrdersRaw().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getOrderById(id: string): Order | undefined {
  return getOrders().find((o) => o.id === id);
}

export function getOrdersByCustomerEmail(email: string): Order[] {
  const normalized = email.trim().toLowerCase();
  return getOrders().filter((o) => o.customerEmail.trim().toLowerCase() === normalized);
}

export function getOrdersByStatus(status: OrderStatus): Order[] {
  return getOrders().filter((o) => o.status === status);
}

export function placeOrder(input: PlaceOrderInput): Order {
  const now = new Date().toISOString();
  const order: Order = {
    id: createOrderId(),
    status: "pending",
    createdAt: now,
    updatedAt: now,
    ...input,
  };

  writeOrders([order, ...readOrdersRaw()]);
  setLastOrder(order);
  return order;
}

export function getLastOrder(): Order | null {
  migrateLegacyLastOrder();

  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LAST_ORDER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Order;
      const fromList = getOrders().find((o) => o.id === parsed.id);
      return fromList ?? parsed;
    }
  } catch {
    /* fall through */
  }

  return getOrders()[0] ?? null;
}

export function updateOrderStatus(id: string, status: OrderStatus): Order | null {
  const orders = readOrdersRaw();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;

  const updated: Order = {
    ...orders[index],
    status,
    updatedAt: new Date().toISOString(),
  };
  orders[index] = updated;
  writeOrders(orders);

  const last = getLastOrder();
  if (last?.id === id) {
    setLastOrder(updated);
  }

  return updated;
}

export function deleteOrder(id: string): boolean {
  const orders = readOrdersRaw();
  const next = orders.filter((o) => o.id !== id);
  if (next.length === orders.length) return false;
  writeOrders(next);

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(LAST_ORDER_KEY);
      if (raw) {
        const last = JSON.parse(raw) as Order;
        if (last.id === id) {
          localStorage.removeItem(LAST_ORDER_KEY);
        }
      }
    } catch {
      localStorage.removeItem(LAST_ORDER_KEY);
    }
  }

  return true;
}

export function countOrdersByStatus(): Record<OrderStatus, number> {
  const counts: Record<OrderStatus, number> = {
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    picked_up: 0,
  };
  for (const order of getOrders()) {
    counts[order.status] += 1;
  }
  return counts;
}
