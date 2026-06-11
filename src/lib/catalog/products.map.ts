import type { Product, ProductInput } from "./types";
import { parseVariantsFromDb } from "./variants";
import type { Database } from "@/lib/supabase/database.types";

type DbProduct = Database["public"]["Tables"]["products"]["Row"];
type DbProductInsert = Database["public"]["Tables"]["products"]["Insert"];

export function mapDbProduct(row: DbProduct): Product {
  return {
    id: row.id,
    title: row.title,
    price: row.price,
    imageUrl: row.image_url,
    description: row.description,
    category: row.category,
    layoutRole: row.layout_role,
    featuredLabel: row.featured_label ?? undefined,
    variants: parseVariantsFromDb(row.variants),
  };
}

export function toDbProductInsert(id: string, input: ProductInput): DbProductInsert {
  return {
    id,
    title: input.title,
    price: input.price,
    image_url: input.imageUrl,
    description: input.description,
    category: input.category,
    layout_role: input.layoutRole,
    featured_label: input.featuredLabel ?? null,
    variants: input.variants,
  };
}

export function toDbProductUpdate(
  input: ProductInput,
): Database["public"]["Tables"]["products"]["Update"] {
  return {
    title: input.title,
    price: input.price,
    image_url: input.imageUrl,
    description: input.description,
    category: input.category,
    layout_role: input.layoutRole,
    featured_label: input.featuredLabel ?? null,
    variants: input.variants,
  };
}
