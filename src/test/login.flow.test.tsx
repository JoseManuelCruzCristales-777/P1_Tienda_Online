import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSession } from "@/lib/session";

import { getCurrentPath, renderTestApp } from "./utils/create-test-router";
import { TEST_CREDENTIALS, TEST_USER } from "./utils/fixtures";
import { resetAuthMocks } from "./utils/mock-customer-auth";

describe("Login Flow — inicio de sesión exitoso", () => {
  beforeEach(() => {
    resetAuthMocks();
  });

  it("envía el formulario, persiste rousse-session y dispara auth-updated", async () => {
    const user = userEvent.setup();
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");

    const { router } = await renderTestApp({ initialPath: "/login" });

    expect(getCurrentPath(router)).toBe("/login");

    await user.type(screen.getByPlaceholderText("tu@correo.com"), TEST_CREDENTIALS.email);
    await user.type(screen.getByPlaceholderText("••••••••"), TEST_CREDENTIALS.password);
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(getSession()).toEqual(TEST_USER);
    });

    const stored = localStorage.getItem("rousse-session");
    expect(stored).not.toBeNull();

    const parsed = JSON.parse(stored ?? "{}") as typeof TEST_USER;
    expect(parsed).toEqual(TEST_USER);

    const authUpdatedEvents = dispatchSpy.mock.calls
      .map(([event]) => event)
      .filter((event): event is Event => event instanceof Event && event.type === "auth-updated");

    expect(authUpdatedEvents.length).toBeGreaterThanOrEqual(1);
    expect(authUpdatedEvents[0]).toEqual(expect.any(Event));
    expect(authUpdatedEvents[0]?.type).toBe("auth-updated");

    dispatchSpy.mockRestore();
  });
});
