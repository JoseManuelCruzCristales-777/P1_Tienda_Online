import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";

import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { signInCustomer } from "@/lib/auth/customer-auth";
import { useI18n } from "@/lib/i18n/I18nProvider";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Iniciar sesión — Rousse Shopping" },
      {
        name: "description",
        content: "Accede a tu cuenta Rousse Shopping para gestionar tus apartados y favoritos.",
      },
      { property: "og:title", content: "Iniciar sesión — Rousse Shopping" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { t } = useI18n();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signInCustomer(email, password);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      window.dispatchEvent(new Event("auth-updated"));
      await navigate({ to: "/", search: { category: undefined, q: undefined } });
    } catch (err) {
      setError("Hubo un error inesperado. Intenta de nuevo.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex flex-1 items-center justify-center px-4 py-8 pb-safe sm:px-margin-mobile sm:py-12 md:px-margin-desktop">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_30px_80px_rgba(7,6,40,0.12)] md:grid-cols-2">
          {/* ── Panel de marca ── */}
          <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-on-primary md:flex">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-secondary-container/20 blur-3xl" />
            <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-primary-container/40 blur-3xl" />
            <div className="relative">
              <img
                src="/logo.png"
                alt="Rousse Shopping"
                className="h-16 w-16 rounded-full object-cover"
              />
              <h2 className="mt-10 font-headline-xl text-headline-xl leading-tight">
                Bienvenida
                <br />
                de vuelta.
              </h2>
              <p className="mt-4 max-w-xs text-body-md text-on-primary/80">
                Gestiona tus apartados, descubre nuevas colecciones y recoge en boutique sin
                complicaciones.
              </p>
            </div>
            <span className="relative font-label-md uppercase tracking-widest text-on-primary/60">
              Rousse · Boutique Edition
            </span>
          </aside>

          {/* ── Formulario ── */}
          <section className="flex flex-col justify-center p-8 md:p-12">
            <div className="mb-8">
              <h1 className="font-headline-lg text-headline-lg-mobile text-on-surface md:text-headline-lg">
                {t("login_title")}
              </h1>
              <p className="mt-2 text-body-md text-on-surface-variant">
                {t("login_no_account")}{" "}
                <Link to="/register" className="font-semibold text-primary hover:underline">
                  {t("login_register")}
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Error banner */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              {/* Email */}
              <label className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-widest text-on-surface-variant">
                  Correo electrónico
                </span>
                <div className="flex items-center rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 transition-colors focus-within:border-primary">
                  <Mail aria-hidden className="mr-2 size-4 shrink-0 text-outline" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full bg-transparent text-body-md text-on-surface outline-none placeholder:text-outline"
                  />
                </div>
              </label>

              {/* Password */}
              <label className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-widest text-on-surface-variant">
                  Contraseña
                </span>
                <div className="flex items-center rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 transition-colors focus-within:border-primary">
                  <Lock aria-hidden className="mr-2 size-4 shrink-0 text-outline" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-body-md text-on-surface outline-none placeholder:text-outline"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="ml-2 text-on-surface-variant transition-colors hover:text-primary"
                  >
                    {showPassword ? (
                      <EyeOff aria-hidden className="size-4" />
                    ) : (
                      <Eye aria-hidden className="size-4" />
                    )}
                  </button>
                </div>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 rounded-full bg-primary py-3.5 font-semibold tracking-wide text-on-primary transition-colors hover:bg-primary-container disabled:opacity-50"
              >
                {isLoading ? t("login_loading") : t("login_submit")}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-on-surface-variant">
              Al continuar aceptas nuestros{" "}3
              <a className="underline" href="#">
                Términos
              </a>{" "}
              y{" "}
              <a className="underline" href="#">
                Política de Privacidad
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
