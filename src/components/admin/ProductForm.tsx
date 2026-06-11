import { useState } from "react";

import { ProductImageField } from "@/components/admin/ProductImageField";
import { ProductVariantsField } from "@/components/admin/ProductVariantsField";
import type { ProductFormValues } from "@/lib/catalog/types";
import { validateProductVariants } from "@/lib/catalog/variants";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { CATEGORY_LABEL_KEYS, FILTER_CATEGORIES } from "@/lib/i18n/translations";

type ProductFormProps = {
  values: ProductFormValues;
  onChange: (values: ProductFormValues) => void;
  onSubmit: (event: React.FormEvent) => void;
  submitLabel: string;
  isSubmitting?: boolean;
  error?: string | null;
  success?: string | null;
};

export function ProductForm({
  values,
  onChange,
  onSubmit,
  submitLabel,
  isSubmitting,
  error,
  success,
}: ProductFormProps) {
  const { t } = useI18n();
  const [validationError, setValidationError] = useState<string | null>(null);

  const update = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
    onChange({ ...values, [key]: value });
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const variantError = validateProductVariants(values.variants, { t });
    if (variantError) {
      setValidationError(variantError);
      return;
    }
    setValidationError(null);
    onSubmit(event);
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex max-w-3xl flex-col gap-8">
      {success ? (
        <p
          role="status"
          className="rounded-lg border border-secondary/40 bg-secondary-container/50 px-4 py-3 text-sm font-medium text-on-secondary-container"
        >
          {success}
        </p>
      ) : null}

      {error || validationError ? (
        <p className="rounded-lg border border-error/30 bg-error-container px-4 py-3 text-sm text-error">
          {validationError ?? error}
        </p>
      ) : null}

      <div className="rounded-xl border border-surface-container-highest bg-surface-container-lowest p-5 shadow-sm sm:p-6">
        <h2 className="mb-4 font-headline-md text-base text-primary sm:text-headline-md">
          {t("admin_form_section_details")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className="text-label-md uppercase text-on-surface-variant">
            {t("admin_form_title")}
          </span>
          <input
            required
            value={values.title}
            onChange={(e) => update("title", e.target.value)}
            className="rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md outline-none focus:border-primary"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-label-md uppercase text-on-surface-variant">
            {t("admin_form_price")}
          </span>
          <input
            required
            value={values.price}
            onChange={(e) => update("price", e.target.value)}
            placeholder={t("admin_form_price_placeholder")}
            className="rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md outline-none focus:border-primary"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-label-md uppercase text-on-surface-variant">
            {t("admin_form_category")}
          </span>
          <select
            value={values.category}
            onChange={(e) => update("category", e.target.value)}
            className="rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md outline-none focus:border-primary"
          >
            {FILTER_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {CATEGORY_LABEL_KEYS[category] ? t(CATEGORY_LABEL_KEYS[category]) : category}
              </option>
            ))}
          </select>
        </label>

        <ProductImageField
          value={values.imageUrl}
          onChange={(url) => update("imageUrl", url)}
        />

        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className="text-label-md uppercase text-on-surface-variant">
            {t("admin_form_description")}
          </span>
          <textarea
            required
            rows={4}
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            className="resize-y rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md outline-none focus:border-primary"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-label-md uppercase text-on-surface-variant">
            {t("admin_form_layout")}
          </span>
          <select
            value={values.layoutRole}
            onChange={(e) =>
              update("layoutRole", e.target.value as ProductFormValues["layoutRole"])
            }
            className="rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md outline-none focus:border-primary"
          >
            <option value="standard">{t("admin_form_layout_standard")}</option>
            <option value="featured">{t("admin_form_layout_featured")}</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className="text-label-md uppercase text-on-surface-variant">
            {t("admin_form_featured_label")}
          </span>
          <input
            value={values.featuredLabel}
            onChange={(e) => update("featuredLabel", e.target.value)}
            placeholder={t("admin_form_featured_placeholder")}
            className="rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md outline-none focus:border-primary"
          />
        </label>
        </div>
      </div>

      <div className="rounded-xl border border-surface-container-highest bg-surface-container-lowest p-5 shadow-sm sm:p-6">
        <ProductVariantsField
          variants={values.variants}
          onChange={(variants) => update("variants", variants)}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-fit rounded-full bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-widest text-on-primary transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? t("admin_form_saving") : submitLabel}
      </button>
    </form>
  );
}
