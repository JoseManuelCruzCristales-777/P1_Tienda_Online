import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { deleteCustomerById, listCustomers } from "@/lib/customers/customers.repository.server";

const adminTokenSchema = z.object({
  adminToken: z.string().min(1),
});

const deleteCustomerSchema = adminTokenSchema.extend({
  customerId: z.string().uuid(),
});

async function requireAdminToken(adminToken: string | undefined) {
  const { assertAdminToken } = await import("../auth/admin-sessions.server");
  assertAdminToken(adminToken);
}

export const fetchAdminCustomers = createServerFn({ method: "POST" })
  .inputValidator(adminTokenSchema)
  .handler(async ({ data }) => {
    await requireAdminToken(data.adminToken);
    return listCustomers();
  });

export const deleteAdminCustomer = createServerFn({ method: "POST" })
  .inputValidator(deleteCustomerSchema)
  .handler(async ({ data }) => {
    await requireAdminToken(data.adminToken);
    await deleteCustomerById(data.customerId);
    return { ok: true as const };
  });
