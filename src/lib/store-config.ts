/** Datos públicos de la boutique (footer, contacto, legal). */

export const STORE_ADDRESS = {
  street: "5 Señores",
  city: "Oaxaca",
  region: "Oaxaca",
  country: "México",
} as const;

export const STORE_MAPS_URL =
  import.meta.env.VITE_STORE_MAPS_URL ??
  "https://www.google.com/maps/search/?api=1&query=5+Se%C3%B1ores+Oaxaca+Mexico";

export const STORE_EMAIL =
  (import.meta.env.VITE_STORE_EMAIL as string | undefined)?.trim() ||
  "contacto@rousse-shopping.com";

export const STORE_INSTAGRAM_URL =
  (import.meta.env.VITE_STORE_INSTAGRAM_URL as string | undefined)?.trim() ||
  "https://www.instagram.com/";

export const STORE_FACEBOOK_URL =
  (import.meta.env.VITE_STORE_FACEBOOK_URL as string | undefined)?.trim() || "";

export function formatStoreAddress(locale: "es" | "en"): string {
  if (locale === "en") {
    return `${STORE_ADDRESS.street}, ${STORE_ADDRESS.city}, ${STORE_ADDRESS.country}`;
  }
  return `${STORE_ADDRESS.street}, ${STORE_ADDRESS.city}, ${STORE_ADDRESS.country}.`;
}
