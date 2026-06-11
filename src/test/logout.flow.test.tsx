import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { setSession } from "@/lib/session";

import { getCurrentPath, renderTestApp } from "./utils/create-test-router";
import { TEST_USER } from "./utils/fixtures";
import { resetAuthMocks } from "./utils/mock-customer-auth";

const ADMIN_TOKEN_KEY = "rousse_admin_token";

describe("Logout Flow — cierre de sesión seguro", () => {
  beforeEach(() => {
    resetAuthMocks();
    setSession(TEST_USER);
    localStorage.setItem("rousse-cart", JSON.stringify([{ id: "p1", quantity: 2 }]));
    sessionStorage.setItem(ADMIN_TOKEN_KEY, "admin-token-test");
  });

  it("limpia localStorage y sessionStorage, redirige a / y restaura el Header", async () => {
    const user = userEvent.setup();

    const { router } = await renderTestApp({ initialPath: "/" });

    await waitFor(() => {
      expect(screen.getByText("¡Hola, María! 🌟")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Cerrar sesión" }));

    await waitFor(() => {
      expect(localStorage.getItem("rousse-session")).toBeNull();
      expect(localStorage.getItem("rousse-cart")).toBeNull();
      expect(sessionStorage.getItem(ADMIN_TOKEN_KEY)).toBeNull();
    });

    await waitFor(() => {
      expect(getCurrentPath(router)).toBe("/");
    });

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Iniciar sesión" })).toBeInTheDocument();
    });

    expect(screen.queryByText("¡Hola, María! 🌟")).not.toBeInTheDocument();
  });
});
