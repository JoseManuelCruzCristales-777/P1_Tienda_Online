import { createFileRoute } from "@tanstack/react-router";

import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { getTermsContent } from "@/lib/legal/content";

export const Route = createFileRoute("/legal/terminos")({
  head: () => ({
    meta: [
      { title: "Términos de servicio — Rousse Shopping" },
      { name: "description", content: "Términos de servicio y apartados en boutique." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const { locale } = useI18n();
  const content = getTermsContent(locale);

  return <LegalPageLayout breadcrumb={content.title} content={content} />;
}
