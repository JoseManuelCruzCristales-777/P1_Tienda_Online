import { createFileRoute, redirect } from "@tanstack/react-router";

import { fetchProducts } from "@/lib/api/products.functions";
import { catalogKeys } from "@/lib/catalog/queries";

export const Route = createFileRoute("/product/")({
  loader: async ({ context }) => {
    const products = await context.queryClient.ensureQueryData({
      queryKey: catalogKeys.all,
      queryFn: () => fetchProducts(),
    });
    const first = products[0];
    if (!first) {
      throw redirect({ to: "/" });
    }
    throw redirect({
      to: "/product/$productId",
      params: { productId: first.id },
    });
  },
});
