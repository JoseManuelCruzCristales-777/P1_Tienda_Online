import type { CustomerSession } from "@/lib/session";

export const TEST_USER: CustomerSession = {
  id: "user-test-001",
  name: "María López",
  email: "maria@example.com",
  phone: "9511234567",
};

export const TEST_CREDENTIALS = {
  email: "maria@example.com",
  password: "RousseTest123!",
} as const;
