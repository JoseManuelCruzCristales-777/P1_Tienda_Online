import {
  createVariantRow,
  normalizeVariantsFromForm,
  parseVariantsFromDb,
  variantsToFormRows,
  type ProductVariant,
  type ProductVariantFormRow,
} from "./variants";

export type { ProductVariant, ProductVariantFormRow };

export type ProductLayoutRole = "featured" | "standard";

export interface Product {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  description: string;
  category: string;
  layoutRole: ProductLayoutRole;
  /** Badge on featured card, e.g. "Exclusive Fragrance" */
  featuredLabel?: string;
  variants: ProductVariant[];
}

export type ProductInput = Omit<Product, "id">;

export interface ProductFormValues {
  title: string;
  price: string;
  imageUrl: string;
  description: string;
  category: string;
  layoutRole: ProductLayoutRole;
  featuredLabel: string;
  variants: ProductVariantFormRow[];
}

export function productToFormValues(product: Product): ProductFormValues {
  return {
    title: product.title,
    price: product.price,
    imageUrl: product.imageUrl,
    description: product.description,
    category: product.category,
    layoutRole: product.layoutRole,
    featuredLabel: product.featuredLabel ?? "",
    variants: variantsToFormRows(product.variants),
  };
}

export function formValuesToProductInput(values: ProductFormValues): ProductInput {
  return {
    title: values.title.trim(),
    price: values.price.trim(),
    imageUrl: values.imageUrl.trim(),
    description: values.description.trim(),
    category: values.category.trim(),
    layoutRole: values.layoutRole,
    featuredLabel: values.featuredLabel.trim() || undefined,
    variants: normalizeVariantsFromForm(values.variants),
  };
}

export const emptyProductFormValues: ProductFormValues = {
  title: "",
  price: "",
  imageUrl: "",
  description: "",
  category: "Accessories",
  layoutRole: "standard",
  featuredLabel: "",
  variants: [createVariantRow()],
};

/** @deprecated use parseVariantsFromDb — re-export for callers */
export { parseVariantsFromDb };
