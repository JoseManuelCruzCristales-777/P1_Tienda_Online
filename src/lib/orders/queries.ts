import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteAdminOrder,
  fetchAdminOrder,
  fetchAdminOrders,
  updateAdminOrderStatus,
} from "@/lib/api/orders.functions";
import { getAdminToken } from "@/lib/auth/admin-session";
import { countOrdersByStatus, type OrderStatus } from "@/lib/orders";

export const orderKeys = {
  all: ["admin", "orders"] as const,
  detail: (id: string) => ["admin", "orders", id] as const,
};

function requireToken(): string {
  const token = getAdminToken();
  if (!token) throw new Error("Not authenticated");
  return token;
}

export function useAdminOrders() {
  const hasToken = typeof window !== "undefined" && Boolean(getAdminToken());

  return useQuery({
    queryKey: orderKeys.all,
    enabled: hasToken,
    queryFn: () => fetchAdminOrders({ data: { adminToken: requireToken() } }),
  });
}

export function useAdminOrder(orderId: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => fetchAdminOrder({ data: { adminToken: requireToken(), orderId } }),
    enabled: Boolean(orderId),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      updateAdminOrderStatus({ data: { adminToken: requireToken(), orderId, status } }),
    onSuccess: (order) => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
      void queryClient.setQueryData(orderKeys.detail(order.id), order);
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) =>
      deleteAdminOrder({ data: { adminToken: requireToken(), orderId } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
