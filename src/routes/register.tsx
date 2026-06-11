import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";

import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RegisterFormValues {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

const emptyValues: RegisterFormValues = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function validate(values: RegisterFormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "El nombre completo es requerido.";
  }

  if (!values.email.trim()) {
    errors.email = "El correo electrónico es requerido.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Ingresa un correo electrónico válido.";
  }

  const digits = values.phone.replace(/\D/g, "");
  if (!values.phone.trim()) {
    errors.phone = "El teléfono de WhatsApp es requerido.";
  } else if (digits.length !== 10) {
    errors.phone = "El teléfono debe tener exactamente 10 dígitos.";
  }

  if (!values.password) {
    errors.password = "La contraseña es requerida.";
  } else if (values.password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Por favor confirma tu contraseña.";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Las contraseñas no coinciden.";
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Crear cuenta — Rousse Shopping" },
      {
        name: "description",
        content:
          "Únete a Rousse Shopping y descubre colecciones exclusivas de moda, fragancias y accesorios en Oaxaca.",
      },
      { property: "og:title", content: "Crear cuenta — Rousse Shopping" },
    ],
  }),
  component: RegisterPage,
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function RegisterPage() {
  const navigate = useNavigate();

  const [values, setValues] = useState<RegisterFormValues>(emptyValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pendingEmailConfirmation, setPendingEmailConfirmation] = useState(false);

  const update = <K extends keyof RegisterFormValues>(key: K, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(values);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const { signUpCustomer } = await import("@/lib/auth/customer-auth");
      const result = await signUpCustomer({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });

      if (!result.ok) {
        setErrors({ email: result.error });
        return;
      }

      window.dispatchEvent(new Event("auth-updated"));
      await new Promise<void>((resolve) => setTimeout(resolve, 800));
      await navigate({ to: "/", search: { category: undefined, q: undefined } });
    } catch (err) {
      console.error(err);
      setErrors({ fullName: "Ocurrió un error. Intenta de nuevo." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex flex-1 items-center justify-center px-4 py-8 pb-safe sm:px-margin-mobile sm:py-12 md:px-margin-desktop">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_30px_80px_rgba(7,6,40,0.12)] md:grid-cols-2">
          {/* Brand panel */}
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
                Únete a<br />
                Rousse.
              </h2>
              <p className="mt-4 max-w-xs text-body-md text-on-primary/80">
                Accede a colecciones exclusivas, novedades antes que nadie y recoge tus piezas
                favoritas directamente en boutique en 5 Señores, Oaxaca.
              </p>
            </div>
            <div className="relative font-label-md uppercase tracking-widest text-on-primary/60">
              Rousse · Boutique Edition
            </div>
          </aside>

          {/* Form panel */}
          <section className="flex flex-col justify-center p-8 md:p-12">
            {success ? (
              <SuccessBanner needsEmailConfirmation={pendingEmailConfirmation} />
            ) : (
              <>
                <div className="mb-8">
                  <h1 className="font-headline-lg text-headline-lg-mobile text-on-surface md:text-headline-lg">
                    Crea tu cuenta
                  </h1>
                  <p className="mt-2 text-body-md text-on-surface-variant">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" className="font-semibold text-primary hover:underline">
                      Inicia sesión
                    </Link>
                  </p>
                </div>

                <form
                  onSubmit={(e) => void handleSubmit(e)}
                  noValidate
                  className="flex flex-col gap-4"
                >
                  <FieldGroup
                    label="Nombre completo"
                    error={errors.fullName}
                    icon={<User className="size-5 stroke-[1.5] text-outline" />}
                  >
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      value={values.fullName}
                      onChange={(e) => update("fullName", e.target.value)}
                      placeholder="Lucía García Morales"
                      className="w-full bg-transparent text-body-md text-on-surface outline-none placeholder:text-outline"
                    />
                  </FieldGroup>

                  <FieldGroup
                    label="Correo electrónico"
                    error={errors.email}
                    icon={<Mail className="size-5 stroke-[1.5] text-outline" />}
                  >
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={values.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="tu@correo.com"
                      className="w-full bg-transparent text-body-md text-on-surface outline-none placeholder:text-outline"
                    />
                  </FieldGroup>

                  <FieldGroup
                    label="WhatsApp (10 dígitos)"
                    error={errors.phone}
                    icon={<Phone className="size-5 stroke-[1.5] text-outline" />}
                  >
                    <input
                      type="tel"
                      required
                      autoComplete="tel"
                      value={values.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="5512345678"
                      maxLength={10}
                      className="w-full bg-transparent text-body-md text-on-surface outline-none placeholder:text-outline"
                    />
                  </FieldGroup>

                  <FieldGroup
                    label="Contraseña"
                    error={errors.password}
                    icon={<Lock className="size-5 stroke-[1.5] text-outline" />}
                    action={
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        className="ml-2 text-on-surface-variant transition-colors hover:text-primary"
                      >
                        {showPassword ? (
                          <EyeOff className="size-5 stroke-[1.5]" aria-hidden />
                        ) : (
                          <Eye className="size-5 stroke-[1.5]" aria-hidden />
                        )}
                      </button>
                    }
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={values.password}
                      onChange={(e) => update("password", e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full bg-transparent text-body-md text-on-surface outline-none placeholder:text-outline"
                    />
                  </FieldGroup>

                  <FieldGroup
                    label="Confirmar contraseña"
                    error={errors.confirmPassword}
                    icon={<Lock className="size-5 stroke-[1.5] text-outline" />}
                    action={
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
                        className="ml-2 text-on-surface-variant transition-colors hover:text-primary"
                      >
                        {showConfirm ? (
                          <EyeOff className="size-5 stroke-[1.5]" aria-hidden />
                        ) : (
                          <Eye className="size-5 stroke-[1.5]" aria-hidden />
                        )}
                      </button>
                    }
                  >
                    <input
                      type={showConfirm ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={values.confirmPassword}
                      onChange={(e) => update("confirmPassword", e.target.value)}
                      placeholder="Repite tu contraseña"
                      className="w-full bg-transparent text-body-md text-on-surface outline-none placeholder:text-outline"
                    />
                  </FieldGroup>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 rounded-full bg-primary py-3.5 font-semibold tracking-wide text-on-primary transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {isSubmitting ? "Registrando…" : "Crear cuenta"}
                  </button>
                </form>

                <p className="mt-6 text-center text-xs text-on-surface-variant">
                  Al registrarte aceptas nuestros{" "}
                  <a href="#" className="underline">
                    Términos
                  </a>{" "}
                  y{" "}
                  <a href="#" className="underline">
                    Política de Privacidad
                  </a>
                  .
                </p>
              </>
            )}
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface FieldGroupProps {
  label: string;
  error?: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}

function FieldGroup({ label, error, icon, action, children }: FieldGroupProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-label-md uppercase text-on-surface-variant">{label}</span>
      <div
        className={`flex items-center rounded-lg border bg-surface-container-low px-4 py-3 transition-colors focus-within:border-primary ${
          error ? "border-error" : "border-outline-variant"
        }`}
      >
        {icon}
        <div className="ml-2 flex-1">{children}</div>
        {action}
      </div>
      {error ? <p className="text-xs text-error">{error}</p> : null}
    </label>
  );
}

function SuccessBanner({ needsEmailConfirmation }: { needsEmailConfirmation: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <span className="text-3xl">🎉</span>
      </div>
      <h2 className="font-headline-lg text-headline-lg-mobile text-primary">
        {needsEmailConfirmation ? "Revisa tu correo" : "¡Cuenta creada con éxito!"}
      </h2>
      <p className="max-w-xs text-body-md text-on-surface-variant">
        {needsEmailConfirmation
          ? "Te enviamos un enlace de confirmación. Después podrás iniciar sesión y apartar productos."
          : "Te estamos redirigiendo al inicio…"}
      </p>
      {needsEmailConfirmation && (
        <Link to="/login" className="mt-2 font-semibold text-primary hover:underline">
          Ir a iniciar sesión
        </Link>
      )}
    </div>
  );
}
