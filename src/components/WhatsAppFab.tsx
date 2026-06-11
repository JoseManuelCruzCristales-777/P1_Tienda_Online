import { MessageCircle } from "lucide-react";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { buildStoreWhatsAppUrl, openWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const iconStroke = "stroke-[1.5]";

export function WhatsAppFab() {
  const { t, locale } = useI18n();
  const url = buildStoreWhatsAppUrl(locale);

  return (
    <button
      type="button"
      onClick={() => openWhatsApp(url)}
      aria-label={t("whatsapp_fab_aria")}
      title={t("whatsapp_fab_aria")}
      className={cn(
        "bottom-safe fixed right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full sm:right-6",
        "bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)]",
        "transition-transform hover:scale-105 hover:bg-[#1ebe5d] active:scale-95",
        "md:right-8",
      )}
    >
      <MessageCircle aria-hidden className={cn("size-7", iconStroke)} />
    </button>
  );
}
