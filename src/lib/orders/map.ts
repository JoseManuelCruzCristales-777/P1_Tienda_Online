import type { CartItem } from "@/lib/cart";
import type { Order, OrderStatus } from "@/lib/orders";
import type { Database } from "@/lib/supabase/database.types";

type DbOrder = Database["public"]["Tables"]["orders"]["Row"];

export function mapDbOrder(row: DbOrder): Order {
  return {
    id: row.id,
    items: row.items as CartItem[],
    total: Number(row.total),
    customerId: row.customer_id ?? undefined,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email,
    status: row.status as OrderStatus,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
