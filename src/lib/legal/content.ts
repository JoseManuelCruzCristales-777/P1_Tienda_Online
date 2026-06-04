import type { Locale } from "@/lib/i18n/translations";

export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

export type LegalPageContent = {
  title: string;
  updated: string;
  intro?: string;
  sections: LegalSection[];
};

const privacyEs: LegalPageContent = {
  title: "Política de privacidad",
  updated: "Última actualización: junio 2024",
  intro:
    "En Rousse Shopping respetamos tu privacidad. Esta política describe qué datos recopilamos al usar nuestra tienda en línea y cómo los utilizamos.",
  sections: [
    {
      heading: "Datos que recopilamos",
      paragraphs: [
        "Al registrarte o apartar productos podemos guardar tu nombre, correo electrónico, número de WhatsApp y el detalle de los artículos que solicitas.",
        "También almacenamos preferencias técnicas como el idioma seleccionado y, mientras navegas, información de sesión en tu dispositivo (carrito y acceso).",
      ],
    },
    {
      heading: "Uso de la información",
      paragraphs: [
        "Utilizamos tus datos para gestionar apartados, contactarte por WhatsApp, mejorar el catálogo y cumplir obligaciones legales aplicables.",
        "No vendemos tu información personal a terceros.",
      ],
    },
    {
      heading: "Conservación y seguridad",
      paragraphs: [
        "Conservamos la información el tiempo necesario para atender tu pedido y nuestras obligaciones comerciales.",
        "Aplicamos medidas razonables de seguridad; ningún sistema en internet es 100% infalible.",
      ],
    },
    {
      heading: "Tus derechos",
      paragraphs: [
        "Puedes solicitar acceso, corrección o eliminación de tus datos escribiéndonos por WhatsApp o al correo de contacto de la boutique.",
        "Si creas cuenta, puedes cerrar sesión en cualquier momento desde la tienda.",
      ],
    },
    {
      heading: "Contacto",
      paragraphs: [
        "Para dudas sobre privacidad, contáctanos en la página de Contacto o por los medios indicados en el pie de página.",
      ],
    },
  ],
};

const privacyEn: LegalPageContent = {
  title: "Privacy Policy",
  updated: "Last updated: June 2024",
  intro:
    "At Rousse Shopping we respect your privacy. This policy explains what data we collect when you use our online store and how we use it.",
  sections: [
    {
      heading: "Data we collect",
      paragraphs: [
        "When you register or reserve products we may store your name, email, WhatsApp number, and the items you request.",
        "We also store technical preferences such as language and, while you browse, session information on your device (cart and login).",
      ],
    },
    {
      heading: "How we use information",
      paragraphs: [
        "We use your data to manage reservations, contact you via WhatsApp, improve the catalog, and meet applicable legal obligations.",
        "We do not sell your personal information to third parties.",
      ],
    },
    {
      heading: "Retention and security",
      paragraphs: [
        "We keep information as long as needed to fulfill your order and our business obligations.",
        "We apply reasonable security measures; no internet system is 100% foolproof.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        "You may request access, correction, or deletion of your data by contacting us via WhatsApp or the boutique email.",
        "If you have an account, you can sign out at any time from the store.",
      ],
    },
    {
      heading: "Contact",
      paragraphs: [
        "For privacy questions, reach us on the Contact page or via the channels listed in the footer.",
      ],
    },
  ],
};

const termsEs: LegalPageContent = {
  title: "Términos de servicio",
  updated: "Última actualización: junio 2024",
  intro:
    "Al usar Rousse Shopping aceptas estos términos. Nuestra tienda opera con apartados vía WhatsApp y recolección en boutique.",
  sections: [
    {
      heading: "Apartados y disponibilidad",
      paragraphs: [
        "Los productos se apartan al confirmar disponibilidad con la boutique por WhatsApp. El precio mostrado en línea es referencia y puede actualizarse.",
        "Los artículos se reservan por 48 horas salvo acuerdo distinto con el equipo de la tienda.",
      ],
    },
    {
      heading: "Pagos",
      paragraphs: [
        "El pago se realiza al recoger tu pedido en nuestra ubicación de 5 Señores, Oaxaca, salvo que acordemos otro método.",
        "No procesamos pagos con tarjeta dentro de este sitio web.",
      ],
    },
    {
      heading: "Cuenta de usuario",
      paragraphs: [
        "Eres responsable de mantener la confidencialidad de tu acceso. Notifícanos si sospechas uso no autorizado.",
      ],
    },
    {
      heading: "Propiedad intelectual",
      paragraphs: [
        "Imágenes, textos y marca Rousse Shopping están protegidos. No está permitida su reproducción comercial sin autorización.",
      ],
    },
    {
      heading: "Limitación de responsabilidad",
      paragraphs: [
        "Hacemos esfuerzos razonables por mantener el sitio disponible, pero no garantizamos ausencia de errores o interrupciones.",
        "En la medida permitida por la ley, no somos responsables por daños indirectos derivados del uso del sitio.",
      ],
    },
    {
      heading: "Cambios",
      paragraphs: [
        "Podemos actualizar estos términos. La fecha de actualización se indica al inicio de esta página.",
      ],
    },
  ],
};

const termsEn: LegalPageContent = {
  title: "Terms of Service",
  updated: "Last updated: June 2024",
  intro:
    "By using Rousse Shopping you accept these terms. Our store operates with WhatsApp reservations and in-boutique pickup.",
  sections: [
    {
      heading: "Reservations and availability",
      paragraphs: [
        "Products are reserved after availability is confirmed with the boutique via WhatsApp. Online prices are reference and may be updated.",
        "Items are held for 48 hours unless otherwise agreed with the store team.",
      ],
    },
    {
      heading: "Payments",
      paragraphs: [
        "Payment is made when you pick up your order at our 5 Señores, Oaxaca location, unless we agree on another method.",
        "We do not process card payments within this website.",
      ],
    },
    {
      heading: "User account",
      paragraphs: [
        "You are responsible for keeping your login confidential. Notify us if you suspect unauthorized use.",
      ],
    },
    {
      heading: "Intellectual property",
      paragraphs: [
        "Images, copy, and the Rousse Shopping brand are protected. Commercial reproduction is not allowed without permission.",
      ],
    },
    {
      heading: "Limitation of liability",
      paragraphs: [
        "We make reasonable efforts to keep the site available but do not guarantee it is error-free or uninterrupted.",
        "To the extent permitted by law, we are not liable for indirect damages from use of the site.",
      ],
    },
    {
      heading: "Changes",
      paragraphs: [
        "We may update these terms. The update date is shown at the top of this page.",
      ],
    },
  ],
};

const contactEs = {
  title: "Contacto y ubicación",
  subtitle: "Visítanos en boutique o escríbenos por WhatsApp.",
};

const contactEn = {
  title: "Contact & location",
  subtitle: "Visit us in store or message us on WhatsApp.",
};

export function getPrivacyContent(locale: Locale): LegalPageContent {
  return locale === "en" ? privacyEn : privacyEs;
}

export function getTermsContent(locale: Locale): LegalPageContent {
  return locale === "en" ? termsEn : termsEs;
}

export function getContactHeadings(locale: Locale) {
  return locale === "en" ? contactEn : contactEs;
}
