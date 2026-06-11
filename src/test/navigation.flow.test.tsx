import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { setSession } from "@/lib/session";

import { getCurrentPath, renderTestApp } from "./utils/create-test-router";
import { TEST_CREDENTIALS, TEST_USER } from "./utils/fixtures";
import { resetAuthMocks } from "./utils/mock-customer-auth";

describe("Navigation Flow — redirección post-login y Header reactivo", () => {
  beforeEach(() => {
    resetAuthMocks();
  });

  it("redirige a / tras login y muestra el saludo personalizado en el Header", async () => {
    const user = userEvent.setup();

    const { router } = await renderTestApp({ initialPath: "/login" });

    await user.type(screen.getByPlaceholderText("tu@correo.com"), TEST_CREDENTIALS.email);
    await user.type(screen.getByPlaceholderText("••••••••"), TEST_CREDENTIALS.password);
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(getCurrentPath(router)).toBe("/");
    });

    expect(screen.getByTestId("home-page")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("¡Hola, María! 🌟")).toBeInTheDocument();
    });

    expect(screen.queryByRole("link", { name: /entrar/i })).not.toBeInTheDocument();
  });

  it("actualiza el Header al disparar auth-updated con sesión ya guardada", async () => {
    setSession(TEST_USER);

    await renderTestApp({ initialPath: "/" });

    await waitFor(() => {
      expect(screen.getByText("¡Hola, María! 🌟")).toBeInTheDocument();
    });

    window.dispatchEvent(new Event("auth-updated"));

    await waitFor(() => {
      expect(screen.getByText("¡Hola, María! 🌟")).toBeInTheDocument();
    });
  });
});
