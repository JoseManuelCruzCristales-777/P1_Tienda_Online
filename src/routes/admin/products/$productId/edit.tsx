import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { ProductForm } from "@/components/admin/ProductForm";
import { useProduct, useUpdateProduct } from "@/lib/catalog/queries";
import {
  emptyProductFormValues,
  formValuesToProductInput,
  productToFormValues,
} from "@/lib/catalog/types";

export const Route = createFileRoute("/admin/products/$productId/edit")({
  component: AdminEditProductPage,
});

function AdminEditProductPage() {
  const { productId } = Route.useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct(productId);
  const updateProduct = useUpdateProduct();
  const [values, setValues] = useState(emptyProductFormValues);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setValues(productToFormValues(product));
    }
  }, [product]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    try {
      await updateProduct.mutateAsync({
        id: productId,
        input: formValuesToProductInput(values),
      });
      await navigate({ to: "/admin" });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not update product");
    }
  };

  if (isLoading) {
    return <p className="text-on-surface-variant">Loading product…</p>;
  }

  if (error || !product) {
    return <p className="text-error">Product not found.</p>;
  }

  return (
    <div>
      <h1 className="mb-2 font-headline-lg text-headline-lg text-primary">Edit product</h1>
      <p className="mb-8 text-body-md text-on-surface-variant">ID: {productId}</p>
      <ProductForm
        values={values}
        onChange={setValues}
        onSubmit={(e) => void handleSubmit(e)}
        submitLabel="Save changes"
        isSubmitting={updateProduct.isPending}
        error={formError}
      />
    </div>
  );
}
