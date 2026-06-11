import { getSupabaseAdmin } from "@/lib/supabase/admin.server";

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
}

function mapProfile(row: {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
}): Customer {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    createdAt: row.created_at,
  };
}

export async function listCustomers(): Promise<Customer[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapProfile);
}

export async function deleteCustomerById(id: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();

  const { error: authError } = await supabase.auth.admin.deleteUser(id);
  if (authError) throw new Error(authError.message);

  return true;
}
