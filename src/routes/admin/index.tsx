import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { handleAdminAuthFailure } from "@/lib/auth/admin-auth";
import { useDeleteProduct, useProducts } from "@/lib/catalog/queries";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { CATEGORY_LABEL_KEYS } from "@/lib/i18n/translations";

export const Route = createFileRoute("/admin/")({
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { data: products, isLoading, error } = useProducts();
  const deleteProduct = useDeleteProduct();

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(t("admin_delete_confirm", { title }))) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast.success(t("admin_delete_success"));
    } catch (err) {
      if (
        handleAdminAuthFailure(err, () => {
          toast.error(t("admin_session_expired"));
          void navigate({ to: "/admin/login" });
        })
      ) {
        return;
      }
      toast.error(t("admin_delete_error"));
    }
  };

  if (isLoading) {
    return <p className="text-on-surface-variant">{t("admin_products_loading")}</p>;
  }

  if (error) {
    return <p className="text-error">{t("admin_products_error")}</p>;
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary">{t("admin_products_title")}</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            {t("admin_products_count", { count: products?.length ?? 0 })}
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-widest text-on-primary transition-opacity hover:opacity-90"
        >
          <Plus className="size-4 stroke-[1.5]" aria-hidden />
          {t("admin_products_add")}
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-surface-container-highest bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-surface-container-highest bg-surface-container-low">
            <tr>
              <th className="px-4 py-3 font-label-md uppercase text-on-surface-variant">
                {t("admin_col_product")}
              </th>
              <th className="hidden px-4 py-3 font-label-md uppercase text-on-surface-variant md:table-cell">
                {t("admin_col_category")}
              </th>
              <th className="px-4 py-3 font-label-md uppercase text-on-surface-variant">
                {t("admin_col_price")}
              </th>
              <th className="px-4 py-3 font-label-md uppercase text-on-surface-variant">
                {t("admin_col_layout")}
              </th>
              <th className="px-4 py-3 text-right font-label-md uppercase text-on-surface-variant">
                {t("admin_col_actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product.id} className="border-b border-surface-container-highest last:border-0">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <img src={product.imageUrl} alt="" className="h-12 w-12 rounded object-cover" />
                    <div>
                      <p className="font-medium text-on-surface">{product.title}</p>
                      <p className="text-xs text-on-surface-variant">{product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-4 text-on-surface-variant md:table-cell">
                  {CATEGORY_LABEL_KEYS[product.category]
                    ? t(CATEGORY_LABEL_KEYS[product.category])
                    : product.category}
                </td>
                <td className="px-4 py-4 text-on-surface-variant">{product.price}</td>
                <td className="px-4 py-4 text-on-surface-variant">
                  {product.layoutRole === "featured"
                    ? t("admin_layout_featured")
                    : t("admin_layout_standard")}
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      to="/admin/products/$productId/edit"
                      params={{ productId: product.id }}
                      search={{ notice: undefined }}
                      className="inline-flex items-center gap-1 rounded-full border border-outline-variant px-3 py-1.5 text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                    >
                      <Pencil className="size-3.5 stroke-[1.5]" aria-hidden />
                      {t("admin_action_edit")}
                    </Link>
                    <button
                      type="button"
                      onClick={() => void handleDelete(product.id, product.title)}
                      disabled={deleteProduct.isPending}
                      className="inline-flex items-center gap-1 rounded-full border border-outline-variant px-3 py-1.5 text-on-surface-variant transition-colors hover:border-error hover:text-error disabled:opacity-50"
                    >
                      <Trash2 className="size-3.5 stroke-[1.5]" aria-hidden />
                      {t("admin_action_delete")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
