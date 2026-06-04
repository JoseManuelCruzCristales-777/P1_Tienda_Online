import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  interpolate,
  LOCALE_STORAGE_KEY,
  translations,
  type Locale,
  type TranslationKey,
} from "@/lib/i18n/translations";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return "es";
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    return stored === "en" ? "en" : "es";
  } catch {
    return "es";
  }
}

/** Actualiza el atributo lang del documento (accesibilidad + SEO). */
function applyDocumentLocale(locale: Locale) {
  if (typeof document !== "undefined") {
    document.documentElement.lang = locale;
  }
}

type I18nProviderProps = {
  children: ReactNode;
};

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>("es");

  // Hidratación del idioma guardado en el cliente
  useEffect(() => {
    const stored = readStoredLocale();
    setLocaleState(stored);
    applyDocumentLocale(stored);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
      applyDocumentLocale(next);
      // Permite que otros componentes reaccionen al cambio de idioma si hace falta
      window.dispatchEvent(new Event("locale-updated"));
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => {
      const text = translations[locale][key] ?? translations.es[key] ?? key;
      return interpolate(text, vars);
    },
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n debe usarse dentro de <I18nProvider>");
  }
  return ctx;
}
