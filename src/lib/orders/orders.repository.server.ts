import type { Order, OrderStatus } from "@/lib/orders";
import { getSupabaseAdmin } from "@/lib/supabase/admin.server";

import { mapDbOrder } from "./map";

export async function listOrders(): Promise<Order[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapDbOrder);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapDbOrder(data) : null;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapDbOrder(data) : null;
}

export async function deleteOrderById(id: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { error, count } = await supabase.from("orders").delete({ count: "exact" }).eq("id", id);

  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}
