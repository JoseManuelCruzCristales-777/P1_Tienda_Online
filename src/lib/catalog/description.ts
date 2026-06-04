/** Resumen corto para tarjetas destacadas (derivado de la descripción). */
export function shortProductDescription(description: string, maxLen = 80): string {
  const text = description.trim();
  return text.length > maxLen ? `${text.slice(0, maxLen)}...` : text;
}
