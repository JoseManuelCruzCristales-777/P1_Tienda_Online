import type { PlaceOrderInput, Order } from "@/lib/orders";
import { createOrderId } from "@/lib/orders";
import { getSupabase } from "@/lib/supabase/client";

import { mapDbOrder } from "./map";

const LAST_ORDER_KEY = "rousse-last-reservation";

function setLastOrder(order: Order): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
}

/** Crea un apartado en Supabase (requiere sesión activa de la clienta). */
export async function placeOrder(input: PlaceOrderInput): Promise<Order> {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Debes iniciar sesión para apartar productos.");
  }

  const now = new Date().toISOString();
  const orderId = createOrderId();

  const row = {
    id: orderId,
    customer_id: user.id,
    customer_name: input.customerName,
    customer_phone: input.customerPhone,
    customer_email: input.customerEmail,
    items: input.items,
    total: input.total,
    status: "pending" as const,
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await supabase.from("orders").insert(row).select().single();

  if (error) {
    throw new Error(error.message);
  }

  const order = mapDbOrder(data);
  setLastOrder(order);
  return order;
}

/** Apartados de la clienta autenticada. */
export async function fetchMyOrders(): Promise<Order[]> {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapDbOrder);
}

/** Último apartado (página de confirmación). */
export async function fetchLastOrder(): Promise<Order | null> {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(LAST_ORDER_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Order;
        const myOrders = await fetchMyOrders();
        const fromDb = myOrders.find((o) => o.id === parsed.id);
        return fromDb ?? parsed;
      }
    } catch {
      /* fall through */
    }
  }

  const orders = await fetchMyOrders();
  return orders[0] ?? null;
}
