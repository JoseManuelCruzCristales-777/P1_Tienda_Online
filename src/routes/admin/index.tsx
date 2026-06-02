import { createFileRoute, Link } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { useDeleteProduct, useProducts } from "@/lib/catalog/queries";

export const Route = createFileRoute("/admin/")({
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const { data: products, isLoading, error } = useProducts();
  const deleteProduct = useDeleteProduct();

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteProduct.mutateAsync(id);
    } catch {
      window.alert("Could not delete product. Check your session and try again.");
    }
  };

  if (isLoading) {
    return <p className="text-on-surface-variant">Loading catalog…</p>;
  }

  if (error) {
    return <p className="text-error">Failed to load products.</p>;
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary">Products</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            {products?.length ?? 0} items in the public catalog
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-widest text-on-primary transition-opacity hover:opacity-90"
        >
          <Plus className="size-4 stroke-[1.5]" aria-hidden />
          Add product
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-surface-container-highest bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-surface-container-highest bg-surface-container-low">
            <tr>
              <th className="px-4 py-3 font-label-md uppercase text-on-surface-variant">Product</th>
              <th className="hidden px-4 py-3 font-label-md uppercase text-on-surface-variant md:table-cell">
                Category
              </th>
              <th className="px-4 py-3 font-label-md uppercase text-on-surface-variant">Price</th>
              <th className="px-4 py-3 font-label-md uppercase text-on-surface-variant">Layout</th>
              <th className="px-4 py-3 text-right font-label-md uppercase text-on-surface-variant">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product.id} className="border-b border-surface-container-highest last:border-0">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.imageUrl}
                      alt=""
                      className="h-12 w-12 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium text-on-surface">{product.title}</p>
                      <p className="text-xs text-on-surface-variant">{product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-4 text-on-surface-variant md:table-cell">
                  {product.category}
                </td>
                <td className="px-4 py-4 text-on-surface-variant">{product.price}</td>
                <td className="px-4 py-4 capitalize text-on-surface-variant">{product.layoutRole}</td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      to="/admin/products/$productId/edit"
                      params={{ productId: product.id }}
                      className="inline-flex items-center gap-1 rounded-full border border-outline-variant px-3 py-1.5 text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                    >
                      <Pencil className="size-3.5 stroke-[1.5]" aria-hidden />
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => void handleDelete(product.id, product.title)}
                      disabled={deleteProduct.isPending}
                      className="inline-flex items-center gap-1 rounded-full border border-outline-variant px-3 py-1.5 text-on-surface-variant transition-colors hover:border-error hover:text-error disabled:opacity-50"
                    >
                      <Trash2 className="size-3.5 stroke-[1.5]" aria-hidden />
                      Delete
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
