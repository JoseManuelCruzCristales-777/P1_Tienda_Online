/** Mensajes de error de autenticación en español (Supabase Auth + validación local). */
export function mapAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("rate limit") || lower.includes("too many requests")) {
    return "Demasiados intentos. Espera unos minutos antes de volver a intentar.";
  }
  if (lower.includes("already registered") || lower.includes("already exists")) {
    return "Ya existe una cuenta con ese correo.";
  }
  if (lower.includes("invalid login credentials")) {
    return "Correo o contraseña incorrectos. Verifica tus datos.";
  }
  if (lower.includes("email not confirmed")) {
    return "Confirma tu correo antes de iniciar sesión.";
  }
  if (lower.includes("password") && lower.includes("weak")) {
    return "La contraseña es demasiado débil. Usa al menos 6 caracteres.";
  }

  return message;
}
