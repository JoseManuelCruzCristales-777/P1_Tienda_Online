import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createCatalogProduct,
  deleteCatalogProduct,
  fetchProduct,
  fetchProducts,
  updateCatalogProduct,
} from "@/lib/api/products.functions";
import { getAdminToken } from "@/lib/auth/admin-session";
import type { Product, ProductInput } from "@/lib/catalog/types";

export const catalogKeys = {
  all: ["catalog", "products"] as const,
  detail: (id: string) => ["catalog", "products", id] as const,
};

export function useProducts() {
  return useQuery({
    queryKey: catalogKeys.all,
    queryFn: () => fetchProducts(),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: catalogKeys.detail(id),
    queryFn: () => fetchProduct({ data: { id } }),
    enabled: Boolean(id),
  });
}

function requireToken(): string {
  const token = getAdminToken();
  if (!token) throw new Error("Not authenticated");
  return token;
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ProductInput) =>
      createCatalogProduct({ data: { adminToken: requireToken(), ...input } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProductInput }) =>
      updateCatalogProduct({ data: { adminToken: requireToken(), id, ...input } }),
    onSuccess: (product) => {
      void queryClient.invalidateQueries({ queryKey: catalogKeys.all });
      void queryClient.invalidateQueries({ queryKey: catalogKeys.detail(product.id) });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      deleteCatalogProduct({ data: { adminToken: requireToken(), id } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}

export function partitionCatalogProducts(products: Product[]) {
  const featured = products.find((p) => p.layoutRole === "featured");
  const standard = products.filter((p) => p.layoutRole !== "featured");
  return { featured, standard };
}
