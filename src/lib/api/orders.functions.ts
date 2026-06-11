import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  deleteOrderById,
  getOrderById,
  listOrders,
  updateOrderStatus,
} from "@/lib/orders/orders.repository.server";

const adminTokenSchema = z.object({
  adminToken: z.string().min(1),
});

const orderIdSchema = adminTokenSchema.extend({
  orderId: z.string().min(1),
});

const updateStatusSchema = orderIdSchema.extend({
  status: z.enum(["pending", "confirmed", "cancelled", "picked_up"]),
});

async function requireAdminToken(adminToken: string | undefined) {
  const { assertAdminToken } = await import("../auth/admin-sessions.server");
  assertAdminToken(adminToken);
}

export const fetchAdminOrders = createServerFn({ method: "POST" })
  .inputValidator(adminTokenSchema)
  .handler(async ({ data }) => {
    await requireAdminToken(data.adminToken);
    return listOrders();
  });

export const fetchAdminOrder = createServerFn({ method: "POST" })
  .inputValidator(orderIdSchema)
  .handler(async ({ data }) => {
    await requireAdminToken(data.adminToken);
    const order = await getOrderById(data.orderId);
    if (!order) throw new Error("Order not found");
    return order;
  });

export const updateAdminOrderStatus = createServerFn({ method: "POST" })
  .inputValidator(updateStatusSchema)
  .handler(async ({ data }) => {
    await requireAdminToken(data.adminToken);
    const updated = await updateOrderStatus(data.orderId, data.status);
    if (!updated) throw new Error("Order not found");
    return updated;
  });

export const deleteAdminOrder = createServerFn({ method: "POST" })
  .inputValidator(orderIdSchema)
  .handler(async ({ data }) => {
    await requireAdminToken(data.adminToken);
    const deleted = await deleteOrderById(data.orderId);
    if (!deleted) throw new Error("Order not found");
    return { ok: true as const };
  });
