import { Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";

import {
  createVariantRow,
  SIZE_PRESETS,
  sumVariantStock,
  type ProductVariantFormRow,
} from "@/lib/catalog/variants";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";

type ProductVariantsFieldProps = {
  variants: ProductVariantFormRow[];
  onChange: (variants: ProductVariantFormRow[]) => void;
};

function clampStock(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.floor(value);
}

export function ProductVariantsField({ variants, onChange }: ProductVariantsFieldProps) {
  const { t } = useI18n();

  const totalStock = useMemo(() => {
    return sumVariantStock(
      variants.map((row) => ({
        size: row.size,
        stock: clampStock(row.stock),
      })),
    );
  }, [variants]);

  const updateRow = (id: string, patch: Partial<Omit<ProductVariantFormRow, "id">>) => {
    onChange(variants.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const removeRow = (id: string) => {
    if (variants.length <= 1) {
      onChange([createVariantRow()]);
      return;
    }
    onChange(variants.filter((row) => row.id !== id));
  };

  const addRow = () => {
    onChange([...variants, createVariantRow()]);
  };

  return (
    <section className="flex flex-col gap-4 sm:col-span-2">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-headline-md text-base text-primary sm:text-headline-md">
            {t("admin_form_inventory_title")}
          </h3>
          <p className="mt-1 text-sm text-on-surface-variant">{t("admin_form_inventory_desc")}</p>
        </div>
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-2 rounded-full border border-primary bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary transition-colors hover:bg-primary hover:text-on-primary"
        >
          <Plus className="size-4" aria-hidden />
          {t("admin_form_variants_add")}
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-surface-container-highest bg-surface shadow-sm">
        <div className="hidden border-b border-surface-container-highest bg-surface-container-low px-4 py-3 text-xs font-semibold uppercase tracking-widest text-on-surface-variant sm:grid sm:grid-cols-[1fr_8rem_3rem] sm:gap-4">
          <span>{t("admin_form_variants_col_size")}</span>
          <span>{t("admin_form_variants_col_stock")}</span>
          <span className="sr-only">{t("admin_form_variants_col_actions")}</span>
        </div>

        <ul className="divide-y divide-surface-container-highest">
          {variants.map((row, index) => (
            <li
              key={row.id}
              className="grid gap-3 px-4 py-4 sm:grid-cols-[1fr_8rem_3rem] sm:items-center sm:gap-4"
            >
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant sm:sr-only">
                  {t("admin_form_variants_col_size")} {index + 1}
                </span>
                <input
                  required
                  list={`size-presets-${row.id}`}
                  value={row.size}
                  onChange={(e) => updateRow(row.id, { size: e.target.value })}
                  placeholder={t("admin_form_variants_size_placeholder")}
                  className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
                <datalist id={`size-presets-${row.id}`}>
                  {SIZE_PRESETS.map((size) => (
                    <option key={size} value={size} />
                  ))}
                </datalist>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant sm:sr-only">
                  {t("admin_form_variants_col_stock")}
                </span>
                <input
                  required
                  type="number"
                  min={0}
                  step={1}
                  inputMode="numeric"
                  value={row.stock}
                  onChange={(e) => {
                    const next = e.target.value === "" ? 0 : Number(e.target.value);
                    updateRow(row.id, { stock: clampStock(next) });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
                      e.preventDefault();
                    }
                  }}
                  className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </label>

              <div className="flex justify-end sm:justify-center">
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  aria-label={t("admin_form_variants_remove")}
                  className={cn(
                    "inline-flex items-center justify-center rounded-full border border-outline-variant p-2.5 text-on-surface-variant transition-colors",
                    "hover:border-error hover:bg-error/5 hover:text-error",
                  )}
                >
                  <Trash2 className="size-4 stroke-[1.5]" aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-label-md uppercase text-on-surface-variant">
          {t("admin_form_total_stock")}
        </span>
        <input
          readOnly
          value={totalStock}
          className="cursor-default rounded-lg border border-outline-variant bg-surface-container px-4 py-3 text-body-md font-semibold text-primary outline-none"
        />
        <p className="text-xs text-on-surface-variant">{t("admin_form_total_stock_hint")}</p>
      </label>
    </section>
  );
}
