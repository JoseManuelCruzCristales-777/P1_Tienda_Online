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
    mutationFn: (id: string) => deleteCatalogProduct({ data: { adminToken: requireToken(), id } }),
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

// ---------------------------------------------------------------------------
// Price helpers
// ---------------------------------------------------------------------------

/** Extracts a numeric MXN value from any price string format.
 *  "$350 MXN" → 350 | "$4,500 MXN" → 4500 | "280" → 280
 */
export function parsePriceMXN(price: string): number {
  const cleaned = price.replace(/[$,\s]/gi, "").replace(/MXN/gi, "");
  return parseFloat(cleaned) || 0;
}

/** Mínimo por defecto al abrir filtros (sin tope inferior). */
export const DEFAULT_PRICE_FILTER_MIN = 0;

/** Sin tope superior en el filtro hasta que el usuario escriba un máximo. */
export const DEFAULT_PRICE_FILTER_MAX = Number.POSITIVE_INFINITY;

/** Calcula el rango real de precios del catálogo (para la barra visual). */
export function getCatalogPriceBounds(products: Product[]): { min: number; max: number } {
  if (products.length === 0) {
    return { min: 0, max: 10_000 };
  }
  const prices = products.map((p) => parsePriceMXN(p.price)).filter((n) => n >= 0);
  if (prices.length === 0) {
    return { min: 0, max: 10_000 };
  }
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/** Parsea lo que el usuario escribe en los campos de precio (vacío = null). */
export function parsePriceFilterInput(value: string): number | null {
  const trimmed = value.trim().replace(/,/g, "");
  if (trimmed === "") return null;
  const n = parseFloat(trimmed);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function resolvePriceFilterRange(
  minInput: string,
  maxInput: string,
): { min: number; max: number } {
  const min = parsePriceFilterInput(minInput) ?? DEFAULT_PRICE_FILTER_MIN;
  const maxParsed = parsePriceFilterInput(maxInput);
  const max = maxParsed ?? DEFAULT_PRICE_FILTER_MAX;
  if (min <= max) return { min, max };
  return { min: max, max: min };
}

// ---------------------------------------------------------------------------
// Client-side filter (no extra server call — data already in Query cache)
// ---------------------------------------------------------------------------

export interface CatalogFilters {
  category: string | null;
  minPrice: number;
  maxPrice: number;
  /** Texto libre. Busca coincidencias en título, descripción y categoría. */
  searchTerm?: string;
}

export function applyFilters(products: Product[], filters: CatalogFilters): Product[] {
  // Normaliza el término una sola vez para no repetirlo en cada iteración
  const term = filters.searchTerm?.trim().toLowerCase() ?? "";

  const min = Math.max(0, filters.minPrice);
  const max =
    !Number.isFinite(filters.maxPrice) || filters.maxPrice <= 0
      ? DEFAULT_PRICE_FILTER_MAX
      : filters.maxPrice;

  return products.filter((p) => {
    const price = parsePriceMXN(p.price);

    // ¿El precio cae dentro del rango seleccionado?
    const inPrice = price >= min && price <= max;

    // ¿Pertenece a la categoría seleccionada (o no hay filtro de categoría)?
    const inCategory = !filters.category || p.category === filters.category;

    // ¿Coincide con el texto buscado en título, descripción o categoría?
    const inSearch =
      !term ||
      p.title.toLowerCase().includes(term) ||
      (p.description ?? "").toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term);

    return inPrice && inCategory && inSearch;
  });
}
