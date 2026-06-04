import { Languages } from "lucide-react";

import { useI18n } from "@/lib/i18n/I18nProvider";
import type { Locale } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

const iconStroke = "stroke-[1.5]";

type LanguageSwitcherProps = {
  className?: string;
};

/**
 * Selector ES | EN en el header.
 * Persiste la preferencia en localStorage (rousse-locale).
 */
export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n();

  function select(next: Locale) {
    if (next !== locale) setLocale(next);
  }

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="group"
      aria-label={t("lang_switch")}
    >
      <Languages aria-hidden className={cn("size-4 text-on-surface-variant", iconStroke)} />
      {(["es", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => select(code)}
          aria-pressed={locale === code}
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide transition-colors",
            locale === code
              ? "bg-primary text-on-primary"
              : "text-on-surface-variant hover:bg-surface-container hover:text-primary",
          )}
        >
          {code === "es" ? t("lang_es") : t("lang_en")}
        </button>
      ))}
    </div>
  );
}
