// ---------------------------------------------------------------------------
// Customer storage helpers — persisted in localStorage (mock phase).
// TODO: Replace with Supabase calls when backend is ready.
// ---------------------------------------------------------------------------

const CUSTOMERS_KEY = "rousse_customers";

// Credentials stored separately so the Customer object never exposes passwords.
// TODO: Replace with Supabase Auth (supabase.auth.signUp / signInWithPassword).
const CREDENTIALS_KEY = "rousse_credentials";

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
}

export function getCustomers(): Customer[] {
  try {
    const raw = localStorage.getItem(CUSTOMERS_KEY);
    return raw ? (JSON.parse(raw) as Customer[]) : [];
  } catch {
    return [];
  }
}

export function saveCustomer(data: Omit<Customer, "id" | "createdAt">): Customer {
  const customers = getCustomers();

  // Avoid duplicate emails
  const exists = customers.some((c) => c.email.toLowerCase() === data.email.toLowerCase());
  if (exists) {
    throw new Error("Ya existe una cuenta con ese correo.");
  }

  const customer: Customer = {
    id: crypto.randomUUID(),
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify([...customers, customer]));
  return customer;
}

export function deleteCustomer(id: string): void {
  const updated = getCustomers().filter((c) => c.id !== id);
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(updated));
}

// ---------------------------------------------------------------------------
// Authentication helpers
// ---------------------------------------------------------------------------

function getCredentials(): Record<string, string> {
  try {
    const raw = localStorage.getItem(CREDENTIALS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

/**
 * Saves a customer AND stores their password under a separate key.
 * Use this in the registration form instead of bare `saveCustomer`.
 */
export function saveCustomerWithPassword(
  data: Omit<Customer, "id" | "createdAt">,
  password: string,
): Customer {
  const customer = saveCustomer(data);
  const creds = getCredentials();
  // TODO: hash the password before storing (e.g. bcrypt) when moving to Supabase.
  creds[data.email.toLowerCase()] = password;
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
  return customer;
}

/**
 * Validates credentials and returns the Customer if they match, null otherwise.
 * Used by the /login page for mock customer authentication.
 * TODO: Replace with supabase.auth.signInWithPassword({ email, password }).
 */
export function authenticateCustomer(email: string, password: string): Customer | null {
  const creds = getCredentials();
  const stored = creds[email.toLowerCase()];
  if (!stored || stored !== password) return null;
  return getCustomers().find((c) => c.email.toLowerCase() === email.toLowerCase()) ?? null;
}
