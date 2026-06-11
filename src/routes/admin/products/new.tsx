import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { ProductForm } from "@/components/admin/ProductForm";
import { handleAdminAuthFailure } from "@/lib/auth/admin-auth";
import { useCreateProduct } from "@/lib/catalog/queries";
import { emptyProductFormValues, formValuesToProductInput } from "@/lib/catalog/types";
import { useI18n } from "@/lib/i18n/I18nProvider";

export const Route = createFileRoute("/admin/products/new")({
  component: AdminNewProductPage,
});

function AdminNewProductPage() {
  const { t } = useI18n();
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
        search: { notice: "created" },
      });
    } catch (err) {
      if (
        handleAdminAuthFailure(err, () => {
          setError(t("admin_session_expired"));
          void navigate({ to: "/admin/login" });
        })
      ) {
        return;
      }
      setError(err instanceof Error ? err.message : t("admin_new_error"));
    }
  };

  return (
    <div>
      <h1 className="mb-2 font-headline-lg text-headline-lg text-primary">
        {t("admin_new_title")}
      </h1>
      <p className="mb-8 text-body-md text-on-surface-variant">{t("admin_new_desc")}</p>
      <ProductForm
        values={values}
        onChange={setValues}
        onSubmit={(e) => void handleSubmit(e)}
        submitLabel={t("admin_new_submit")}
        isSubmitting={createProduct.isPending}
        error={error}
      />
    </div>
  );
}
