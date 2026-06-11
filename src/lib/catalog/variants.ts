import type { TranslationKey } from "@/lib/i18n/translations";

/** Variante persistida en Supabase (JSONB). */
export type ProductVariant = {
  size: string;
  stock: number;
};

/** Fila editable en el formulario admin (incluye id estable para React). */
export type ProductVariantFormRow = {
  id: string;
  size: string;
  stock: number;
};

export const SIZE_PRESETS = [
  "CH",
  "M",
  "G",
  "XG",
  "XXG",
  "Única",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
] as const;

export function createVariantRow(size = "", stock = 0): ProductVariantFormRow {
  return {
    id: crypto.randomUUID(),
    size,
    stock: Math.max(0, Math.floor(stock)),
  };
}

export function sumVariantStock(variants: readonly ProductVariant[]): number {
  return variants.reduce((total, variant) => total + Math.max(0, variant.stock), 0);
}

export function parseVariantsFromDb(value: unknown): ProductVariant[] {
  if (!Array.isArray(value)) return [];

  const parsed: ProductVariant[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const record = entry as Record<string, unknown>;
    const size = typeof record.size === "string" ? record.size.trim() : "";
    const stockRaw = record.stock;
    const stock =
      typeof stockRaw === "number"
        ? Math.max(0, Math.floor(stockRaw))
        : typeof stockRaw === "string"
          ? Math.max(0, Math.floor(Number(stockRaw)) || 0)
          : 0;

    if (!size) continue;
    parsed.push({ size, stock });
  }

  return parsed;
}

export function variantsToFormRows(variants: ProductVariant[]): ProductVariantFormRow[] {
  if (variants.length === 0) {
    return [createVariantRow()];
  }
  return variants.map((variant) => createVariantRow(variant.size, variant.stock));
}

export function normalizeVariantsFromForm(rows: ProductVariantFormRow[]): ProductVariant[] {
  const cleaned = rows
    .map((row) => ({
      size: row.size.trim(),
      stock: Math.max(0, Math.floor(Number.isFinite(row.stock) ? row.stock : 0)),
    }))
    .filter((row) => row.size.length > 0);

  const seen = new Set<string>();
  for (const row of cleaned) {
    const key = row.size.toLowerCase();
    if (seen.has(key)) {
      throw new Error("VARIANT_DUPLICATE");
    }
    seen.add(key);
  }

  if (cleaned.length === 0) {
    throw new Error("VARIANTS_REQUIRED");
  }

  return cleaned;
}

type ValidateOptions = {
  t: (key: TranslationKey) => string;
};

export function validateProductVariants(
  rows: ProductVariantFormRow[],
  { t }: ValidateOptions,
): string | null {
  try {
    normalizeVariantsFromForm(rows);
    return null;
  } catch (err) {
    const code = err instanceof Error ? err.message : "";
    if (code === "VARIANT_DUPLICATE") return t("admin_form_variants_duplicate");
    if (code === "VARIANTS_REQUIRED") return t("admin_form_variants_required");
    return t("admin_form_variants_invalid");
  }
}
