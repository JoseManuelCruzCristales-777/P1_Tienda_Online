import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { ProductForm } from "@/components/admin/ProductForm";
import { handleAdminAuthFailure } from "@/lib/auth/admin-auth";
import { useProduct, useUpdateProduct } from "@/lib/catalog/queries";
import {
  emptyProductFormValues,
  formValuesToProductInput,
  productToFormValues,
} from "@/lib/catalog/types";
import { useI18n } from "@/lib/i18n/I18nProvider";

export const Route = createFileRoute("/admin/products/$productId/edit")({
  validateSearch: (search: Record<string, unknown>) => ({
    notice: search.notice === "created" ? ("created" as const) : undefined,
  }),
  component: AdminEditProductPage,
});

function AdminEditProductPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { productId } = Route.useParams();
  const { notice } = Route.useSearch();
  const { data: product, isLoading, error } = useProduct(productId);
  const updateProduct = useUpdateProduct();
  const [values, setValues] = useState(emptyProductFormValues);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setValues(productToFormValues(product));
    }
  }, [product]);

  useEffect(() => {
    if (notice === "created") {
      setSuccess(t("admin_new_success"));
    }
  }, [notice, t]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    setSuccess(null);
    try {
      await updateProduct.mutateAsync({
        id: productId,
        input: formValuesToProductInput(values),
      });
      setSuccess(t("admin_edit_success"));
    } catch (err) {
      if (
        handleAdminAuthFailure(err, () => {
          setFormError(t("admin_session_expired"));
          void navigate({ to: "/admin/login" });
        })
      ) {
        return;
      }
      setFormError(err instanceof Error ? err.message : t("admin_edit_error"));
    }
  };

  if (isLoading) {
    return <p className="text-on-surface-variant">{t("admin_edit_loading")}</p>;
  }

  if (error || !product) {
    return <p className="text-error">{t("admin_edit_not_found")}</p>;
  }

  return (
    <div>
      <h1 className="mb-2 font-headline-lg text-headline-lg text-primary">
        {t("admin_edit_title")}
      </h1>
      <p className="mb-8 text-body-md text-on-surface-variant">ID: {productId}</p>
      <ProductForm
        values={values}
        onChange={setValues}
        onSubmit={(e) => void handleSubmit(e)}
        submitLabel={t("admin_edit_submit")}
        isSubmitting={updateProduct.isPending}
        error={formError}
        success={success}
      />
    </div>
  );
}
