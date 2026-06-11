import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { deleteAdminCustomer, fetchAdminCustomers } from "@/lib/api/customers.functions";
import { getAdminToken } from "@/lib/auth/admin-session";

export const customerKeys = {
  all: ["admin", "customers"] as const,
};

function requireToken(): string {
  const token = getAdminToken();
  if (!token) throw new Error("Not authenticated");
  return token;
}

export function useAdminCustomers() {
  const hasToken = typeof window !== "undefined" && Boolean(getAdminToken());

  return useQuery({
    queryKey: customerKeys.all,
    enabled: hasToken,
    queryFn: () => fetchAdminCustomers({ data: { adminToken: requireToken() } }),
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customerId: string) =>
      deleteAdminCustomer({ data: { adminToken: requireToken(), customerId } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
  });
}
