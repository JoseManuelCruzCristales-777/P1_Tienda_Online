import type { Product, ProductInput } from "./types";
import { mapDbProduct, toDbProductInsert, toDbProductUpdate } from "./products.map";
import { getSupabaseAdmin } from "@/lib/supabase/admin.server";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function demoteOtherFeatured(exceptId?: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("products")
    .update({ layout_role: "standard" })
    .eq("layout_role", "featured");

  if (exceptId) {
    query = query.neq("id", exceptId);
  }

  const { error } = await query;
  if (error) throw new Error(error.message);
}

async function uniqueProductId(baseId: string): Promise<string> {
  const supabase = getSupabaseAdmin();
  let id = baseId;
  let suffix = 1;

  while (true) {
    const { data, error } = await supabase.from("products").select("id").eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return id;
    id = `${baseId}-${suffix++}`;
  }
}

export async function listProducts(): Promise<Product[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapDbProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapDbProduct(data) : null;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const supabase = getSupabaseAdmin();
  const baseId = slugify(input.title) || "product";
  const id = await uniqueProductId(baseId);

  if (input.layoutRole === "featured") {
    await demoteOtherFeatured();
  }

  const row = toDbProductInsert(id, input);
  const { data, error } = await supabase.from("products").insert(row).select().single();

  if (error) throw new Error(error.message);
  return mapDbProduct(data);
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product | null> {
  const supabase = getSupabaseAdmin();
  const existing = await getProductById(id);
  if (!existing) return null;

  if (input.layoutRole === "featured") {
    await demoteOtherFeatured(id);
  }

  const { data, error } = await supabase
    .from("products")
    .update(toDbProductUpdate(input))
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapDbProduct(data) : null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { error, count } = await supabase.from("products").delete({ count: "exact" }).eq("id", id);

  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}
