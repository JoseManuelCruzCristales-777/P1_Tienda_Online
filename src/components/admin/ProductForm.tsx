import type { ProductFormValues } from "@/lib/catalog/types";

const CATEGORIES = ["Boutique", "Perfumes", "Skincare", "Accessories", "New Collection"];

type ProductFormProps = {
  values: ProductFormValues;
  onChange: (values: ProductFormValues) => void;
  onSubmit: (event: React.FormEvent) => void;
  submitLabel: string;
  isSubmitting?: boolean;
  error?: string | null;
};

export function ProductForm({
  values,
  onChange,
  onSubmit,
  submitLabel,
  isSubmitting,
  error,
}: ProductFormProps) {
  const update = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <form onSubmit={onSubmit} className="flex max-w-2xl flex-col gap-6">
      {error ? (
        <p className="rounded-lg border border-error/30 bg-error-container px-4 py-3 text-sm text-error">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className="text-label-md uppercase text-on-surface-variant">Title</span>
          <input
            required
            value={values.title}
            onChange={(e) => update("title", e.target.value)}
            className="rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md outline-none focus:border-primary"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-label-md uppercase text-on-surface-variant">Price</span>
          <input
            required
            value={values.price}
            onChange={(e) => update("price", e.target.value)}
            placeholder="$450.00"
            className="rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md outline-none focus:border-primary"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-label-md uppercase text-on-surface-variant">Category</span>
          <select
            value={values.category}
            onChange={(e) => update("category", e.target.value)}
            className="rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md outline-none focus:border-primary"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className="text-label-md uppercase text-on-surface-variant">Image URL</span>
          <input
            required
            type="url"
            value={values.imageUrl}
            onChange={(e) => update("imageUrl", e.target.value)}
            className="rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md outline-none focus:border-primary"
          />
        </label>

        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className="text-label-md uppercase text-on-surface-variant">Description</span>
          <textarea
            required
            rows={4}
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            className="resize-y rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md outline-none focus:border-primary"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-label-md uppercase text-on-surface-variant">Layout</span>
          <select
            value={values.layoutRole}
            onChange={(e) => update("layoutRole", e.target.value as ProductFormValues["layoutRole"])}
            className="rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md outline-none focus:border-primary"
          >
            <option value="standard">Standard card</option>
            <option value="featured">Featured (hero grid)</option>
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-label-md uppercase text-on-surface-variant">Featured label</span>
          <input
            value={values.featuredLabel}
            onChange={(e) => update("featuredLabel", e.target.value)}
            placeholder="Exclusive Fragrance"
            className="rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md outline-none focus:border-primary"
          />
        </label>

        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className="text-label-md uppercase text-on-surface-variant">Featured excerpt</span>
          <input
            value={values.excerpt}
            onChange={(e) => update("excerpt", e.target.value)}
            className="rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-md outline-none focus:border-primary"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-fit rounded-full bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-widest text-on-primary transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
