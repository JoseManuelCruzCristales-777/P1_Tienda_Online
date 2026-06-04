import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Clock, Mail, MapPin, MessageCircle } from "lucide-react";

import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { homeSearch } from "@/lib/home-search";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { getContactHeadings } from "@/lib/legal/content";
import {
  formatStoreAddress,
  STORE_EMAIL,
  STORE_FACEBOOK_URL,
  STORE_INSTAGRAM_URL,
  STORE_MAPS_URL,
} from "@/lib/store-config";
import {
  buildStoreWhatsAppUrl,
  formatWhatsAppDisplayNumber,
  openWhatsApp,
} from "@/lib/whatsapp";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto — Rousse Shopping" },
      { name: "description", content: "Ubicación, horarios y WhatsApp de Rousse Shopping en Oaxaca." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t, locale } = useI18n();
  const headings = getContactHeadings(locale);
  const whatsappUrl = buildStoreWhatsAppUrl(locale);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <div className="mx-auto w-full max-w-container-max px-margin-mobile py-4 md:px-margin-desktop">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-on-surface-variant">
          <Link to="/" search={homeSearch} className="transition-colors hover:text-primary">
            {t("legal_home")}
          </Link>
          <ChevronRight aria-hidden className="size-4 stroke-[1.5]" />
          <span className="font-medium text-primary">{t("footer_contact")}</span>
        </nav>
      </div>

      <main className="mx-auto w-full max-w-container-max flex-grow px-margin-mobile pb-stack-lg md:px-margin-desktop">
        <div className="mb-10 max-w-2xl">
          <h1 className="font-headline-xl text-headline-xl text-primary">{headings.title}</h1>
          <p className="mt-2 font-body-md text-body-md text-on-surface-variant">{headings.subtitle}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-surface-container-highest bg-surface p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MapPin className="size-5 stroke-[1.5]" aria-hidden />
            </div>
            <h2 className="font-headline-md text-headline-md text-primary">{t("footer_location")}</h2>
            <p className="mt-2 font-body-md text-on-surface-variant">{formatStoreAddress(locale)}</p>
            <a
              href={STORE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
            >
              {t("contact_open_maps")}
            </a>
          </div>

          <div className="rounded-xl border border-surface-container-highest bg-surface p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Clock className="size-5 stroke-[1.5]" aria-hidden />
            </div>
            <h2 className="font-headline-md text-headline-md text-primary">{t("footer_hours_title")}</h2>
            <p className="mt-2 font-body-md text-on-surface-variant">{t("footer_hours")}</p>
            <p className="mt-2 text-sm text-on-surface-variant/80">{t("contact_hours_note")}</p>
          </div>

          <div className="rounded-xl border border-surface-container-highest bg-surface p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Mail className="size-5 stroke-[1.5]" aria-hidden />
            </div>
            <h2 className="font-headline-md text-headline-md text-primary">{t("footer_email")}</h2>
            <a
              href={`mailto:${STORE_EMAIL}`}
              className="mt-2 inline-block font-body-md text-primary hover:underline"
            >
              {STORE_EMAIL}
            </a>
          </div>

          <div className="rounded-xl border border-[#25D366]/30 bg-[#25D366]/5 p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]/20 text-[#25D366]">
              <MessageCircle className="size-5 stroke-[1.5]" aria-hidden />
            </div>
            <h2 className="font-headline-md text-headline-md text-primary">{t("footer_whatsapp")}</h2>
            <p className="mt-2 font-body-md text-on-surface-variant">{formatWhatsAppDisplayNumber()}</p>
            <p className="mt-2 text-sm text-on-surface-variant/80">{t("contact_whatsapp_hint")}</p>
            <button
              type="button"
              onClick={() => openWhatsApp(whatsappUrl)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-[#25D366] bg-[#25D366] py-3 font-label-md text-sm text-white transition-colors hover:bg-[#1ebe5d] md:w-auto md:px-8"
            >
              <MessageCircle className="size-4" aria-hidden />
              {t("contact_whatsapp_btn")}
            </button>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-on-surface-variant">
          {t("contact_legal_hint")}{" "}
          <Link to="/legal/privacidad" className="text-primary hover:underline">
            {t("footer_privacy")}
          </Link>
          {" · "}
          <Link to="/legal/terminos" className="text-primary hover:underline">
            {t("footer_terms")}
          </Link>
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
