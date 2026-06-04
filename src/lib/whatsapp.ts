import type { CartItem } from "@/lib/cart";
import type { Locale } from "@/lib/i18n/translations";

export type WhatsAppLocale = Locale;

export type WhatsAppCustomer = {
  name?: string;
  email?: string;
  phone?: string;
};

export type WhatsAppMessageOptions = {
  locale?: WhatsAppLocale;
  customer?: WhatsAppCustomer;
  /** Total en MXN para incluir en el mensaje del carrito */
  total?: number;
};

const FALLBACK_NUMBER = "529516000000";

/** Número en formato internacional sin + (ej. 5295112345678). Configura VITE_WHATSAPP_NUMBER en .env */
export function getWhatsAppNumber(): string {
  const raw = import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined;
  const digits = (raw ?? FALLBACK_NUMBER).replace(/\D/g, "");
  return digits.length >= 10 ? digits : FALLBACK_NUMBER;
}

function buildWaUrl(text: string): string {
  return `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(text)}`;
}

function customerBlock(
  customer: WhatsAppCustomer | undefined,
  locale: WhatsAppLocale,
): string[] {
  if (!customer?.name && !customer?.phone && !customer?.email) return [];

  const header =
    locale === "en" ? "My details:" : "Mis datos:";
  const lines: string[] = [header];
  if (customer.name) {
    lines.push(locale === "en" ? `• Name: ${customer.name}` : `• Nombre: ${customer.name}`);
  }
  if (customer.phone) {
    lines.push(locale === "en" ? `• WhatsApp: ${customer.phone}` : `• WhatsApp: ${customer.phone}`);
  }
  if (customer.email) {
    lines.push(locale === "en" ? `• Email: ${customer.email}` : `• Correo: ${customer.email}`);
  }
  return ["", ...lines];
}

export function buildCartWhatsAppUrl(
  items: CartItem[],
  options: WhatsAppMessageOptions = {},
): string {
  const locale = options.locale ?? "es";
  const lines = items.map(
    (item) => `• ${item.title} x${item.quantity} — ${item.price}`,
  );

  const intro =
    locale === "en"
      ? "Hi 👋 I'd like to reserve the following items from *Rousse Shopping*:"
      : "Hola 👋 Quiero apartar los siguientes productos de *Rousse Shopping*:";

  const outro =
    locale === "en" ? "Are they available?" : "¿Están disponibles?";

  const totalLine =
    options.total != null && options.total > 0
      ? [
          "",
          locale === "en"
            ? `*Estimated total: $${options.total.toFixed(2)} MXN*`
            : `*Total estimado: $${options.total.toFixed(2)} MXN*`,
        ]
      : [];

  const message = [
    intro,
    "",
    ...lines,
    ...totalLine,
    ...customerBlock(options.customer, locale),
    "",
    outro,
  ].join("\n");

  return buildWaUrl(message);
}

export function buildSingleWhatsAppUrl(
  item: Pick<CartItem, "title" | "price">,
  options: WhatsAppMessageOptions = {},
): string {
  const locale = options.locale ?? "es";

  const intro =
    locale === "en"
      ? "Hi 👋 I'd like to reserve this item from *Rousse Shopping*:"
      : "Hola 👋 Quiero apartar este producto de *Rousse Shopping*:";

  const productLine =
    locale === "en"
      ? `• Product: *${item.title}*`
      : `• Producto: *${item.title}*`;

  const priceLine =
    locale === "en" ? `• Price: ${item.price}` : `• Precio: ${item.price}`;

  const outro = locale === "en" ? "Is it available?" : "¿Está disponible?";

  const message = [
    intro,
    "",
    productLine,
    priceLine,
    ...customerBlock(options.customer, locale),
    "",
    outro,
  ].join("\n");

  return buildWaUrl(message);
}

/** Enlace directo al chat de la boutique. */
export function buildStoreWhatsAppUrl(locale: WhatsAppLocale = "es"): string {
  const message =
    locale === "en"
      ? "Hi 👋 I'd like information about *Rousse Shopping*."
      : "Hola 👋 Me gustaría información sobre *Rousse Shopping*.";
  return buildWaUrl(message);
}

/** Mensaje precargado para solicitar programa Rousse VIP. */
export function buildVipWhatsAppUrl(locale: WhatsAppLocale = "es"): string {
  const message =
    locale === "en"
      ? "Hi 👋 I'd like to join *Rousse VIP* — exclusive collections and early access."
      : "Hola 👋 Me interesa unirme a *Rousse VIP* — colecciones exclusivas y acceso anticipado.";
  return buildWaUrl(message);
}

/** Formato legible para mostrar en UI (ej. +52 951 276 5521). */
export function formatWhatsAppDisplayNumber(): string {
  const digits = getWhatsAppNumber();
  if (digits.startsWith("52") && digits.length >= 12) {
    const rest = digits.slice(2);
    return `+52 ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6)}`.trim();
  }
  return `+${digits}`;
}

/** Abre WhatsApp en una pestaña nueva (evita perder la tienda). */
export function openWhatsApp(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}
