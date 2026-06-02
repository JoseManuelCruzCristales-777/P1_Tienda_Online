import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
// 1. Importamos las funciones de autenticación basadas en tu arquitectura
import { loginAdmin } from "@/lib/api/auth.admin.functions";
import { setAdminToken } from "../lib/auth/admin-session";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Iniciar sesión — Rousse Shopping" },
      { name: "description", content: "Accede a tu cuenta Rousse Shopping para gestionar tus apartados y favoritos." },
      { property: "og:title", content: "Iniciar sesión — Rousse Shopping" },
      { property: "og:description", content: "Accede a tu cuenta Rousse Shopping." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate(); // Hook de TanStack Router para redirigir
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Estado para pintar errores en pantalla
  const [isLoading, setIsLoading] = useState(false);

  // 2. Creamos la función controladora del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Tu backend simulado espera usuario y contraseña. Usaremos el email como username
      // o puedes poner directamente "admin" si es lo que busca la función.
      // const response = await loginAdmin({ data: { username: email, password: password } });
      const response = await loginAdmin({
        data: {
          username: email,
          password: password
        }
      });
      console.log(response);

      if (response.success && response.token) {
        // Cambiamos la llamada vieja por la función real
        setAdminToken(response.token);

        navigate({ to: "/admin" });
      }
      else {
        setError("Usuario o contraseña incorrectos. Intenta con las credenciales por defecto.");
      }
    } catch (err) {
      setError("Hubo un error de conexión con el servidor local.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 flex items-center justify-center px-margin-mobile md:px-margin-desktop py-12">
        <div className="w-full max-w-5xl grid md:grid-cols-2 rounded-xl overflow-hidden shadow-[0_30px_80px_rgba(7,6,40,0.12)] bg-surface-container-lowest">
          {/* Brand panel */}
          <aside className="hidden md:flex flex-col justify-between bg-primary text-on-primary p-10 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-secondary-container/20 blur-3xl" />
            <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-primary-container/40 blur-3xl" />

            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-on-primary text-primary flex items-center justify-center font-headline-md text-xl">R</div>
              <h2 className="mt-10 font-headline-xl text-headline-xl leading-tight">
                Bienvenida<br />de vuelta.
              </h2>
              <p className="mt-4 text-body-md text-on-primary/80 max-w-xs">
                Gestiona tus apartados, descubre nuevas colecciones y recoge en boutique sin complicaciones.
              </p>
            </div>

            <div className="relative text-label-md uppercase tracking-widest text-on-primary/60">
              Rousse · Boutique Edition
            </div>
          </aside>

          {/* Form panel */}
          <section className="p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                Inicia sesión
              </h1>
              <p className="mt-2 text-body-md text-on-surface-variant">
                ¿Aún no tienes cuenta?{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Regístrate
                </Link>
              </p>
            </div>

            {/* 5. Conectamos la acción real del formulario */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Alerta visual de error si las credenciales fallan */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              <label className="flex flex-col gap-2">
                <span className="text-label-md uppercase text-on-surface-variant">Usuario o Correo</span>
                <div className="flex items-center bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 focus-within:border-primary transition-colors">
                  <span className="material-symbols-outlined text-outline mr-2">mail</span>
                  <input
                    type="text" // Cambiado a text por si usas el username "admin" directo
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin o tu@correo.com"
                    className="bg-transparent outline-none w-full text-body-md text-on-surface placeholder-outline"
                  />
                </div>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-label-md uppercase text-on-surface-variant">Contraseña</span>
                <div className="flex items-center bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 focus-within:border-primary transition-colors">
                  <span className="material-symbols-outlined text-outline mr-2">lock</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-transparent outline-none w-full text-body-md text-on-surface placeholder-outline"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    aria-pressed={showPassword}
                    className="ml-2 text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between text-body-md">
                <label className="flex items-center gap-2 text-on-surface-variant cursor-pointer">
                  <input type="checkbox" className="accent-primary w-4 h-4" />
                  Recuérdame
                </label>
                <button type="button" className="text-primary font-semibold hover:underline">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 bg-primary text-on-primary rounded-full py-3.5 font-semibold tracking-wide hover:bg-primary-container transition-colors disabled:opacity-50"
              >
                {isLoading ? "Cargando..." : "Entrar"}
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-surface-container-highest" />
                <span className="text-label-md uppercase text-on-surface-variant">o continúa con</span>
                <div className="flex-1 h-px bg-surface-container-highest" />
              </div>

              <button
                type="button"
                className="flex items-center justify-center gap-3 border border-outline-variant rounded-full py-3 font-medium text-on-surface hover:bg-surface-container transition-colors"
              >
                <img
                  src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw"
                  alt=""
                  className="w-5 h-5"
                />
                Continuar con Google
              </button>
            </form>

            <p className="mt-8 text-xs text-on-surface-variant text-center">
              Al continuar aceptas nuestros <a className="underline" href="#">Términos</a> y <a className="underline" href="#">Política de Privacidad</a>.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}