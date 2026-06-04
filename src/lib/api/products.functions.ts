import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
} from "../catalog/products.repository.server";

const productInputSchema = z.object({
  title: z.string().min(1),
  price: z.string().min(1),
  imageUrl: z.string().url(),
  description: z.string().min(1),
  category: z.string().min(1),
  layoutRole: z.enum(["featured", "standard"]),
  featuredLabel: z.string().optional(),
});

const adminTokenSchema = z.object({
  adminToken: z.string().min(1),
});

const createProductSchema = adminTokenSchema.merge(productInputSchema);
const updateProductSchema = createProductSchema.extend({
  id: z.string().min(1),
});
const deleteProductSchema = adminTokenSchema.extend({
  id: z.string().min(1),
});

const getProductSchema = z.object({
  id: z.string().min(1),
});

async function requireAdminToken(adminToken: string | undefined) {
  const { assertAdminToken } = await import("../auth/admin-sessions.server");
  assertAdminToken(adminToken);
}

export const fetchProducts = createServerFn({ method: "POST" }).handler(async () => {
  return listProducts();
});

export const fetchProduct = createServerFn({ method: "POST" })
  .inputValidator(getProductSchema)
  .handler(async ({ data }) => {
    const product = await getProductById(data.id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  });

export const createCatalogProduct = createServerFn({ method: "POST" })
  .inputValidator(createProductSchema)
  .handler(async ({ data }) => {
    await requireAdminToken(data.adminToken);
    const { adminToken: _, ...input } = data;
    return createProduct(input);
  });

export const updateCatalogProduct = createServerFn({ method: "POST" })
  .inputValidator(updateProductSchema)
  .handler(async ({ data }) => {
    await requireAdminToken(data.adminToken);
    const { adminToken: _, id, ...input } = data;
    const updated = await updateProduct(id, input);
    if (!updated) {
      throw new Error("Product not found");
    }
    return updated;
  });

export const deleteCatalogProduct = createServerFn({ method: "POST" })
  .inputValidator(deleteProductSchema)
  .handler(async ({ data }) => {
    await requireAdminToken(data.adminToken);
    const deleted = await deleteProduct(data.id);
    if (!deleted) {
      throw new Error("Product not found");
    }
    return { ok: true as const };
  });
