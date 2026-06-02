import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { ProductForm } from "@/components/admin/ProductForm";
import { useCreateProduct } from "@/lib/catalog/queries";
import { emptyProductFormValues, formValuesToProductInput } from "@/lib/catalog/types";

export const Route = createFileRoute("/admin/products/new")({
  component: AdminNewProductPage,
});

function AdminNewProductPage() {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();
  const [values, setValues] = useState(emptyProductFormValues);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const product = await createProduct.mutateAsync(formValuesToProductInput(values));
      await navigate({
        to: "/admin/products/$productId/edit",
        params: { productId: product.id },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create product");
    }
  };

  return (
    <div>
      <h1 className="mb-2 font-headline-lg text-headline-lg text-primary">New product</h1>
      <p className="mb-8 text-body-md text-on-surface-variant">
        Add an item to the public catalog and home grid.
      </p>
      <ProductForm
        values={values}
        onChange={setValues}
        onSubmit={(e) => void handleSubmit(e)}
        submitLabel="Create product"
        isSubmitting={createProduct.isPending}
        error={error}
      />
    </div>
  );
}
