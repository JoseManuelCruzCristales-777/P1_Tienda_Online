import { createFileRoute } from "@tanstack/react-router";

import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { getPrivacyContent } from "@/lib/legal/content";

export const Route = createFileRoute("/legal/privacidad")({
  head: () => ({
    meta: [
      { title: "Política de privacidad — Rousse Shopping" },
      { name: "description", content: "Política de privacidad de Rousse Shopping." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { locale } = useI18n();
  const content = getPrivacyContent(locale);

  return <LegalPageLayout breadcrumb={content.title} content={content} />;
}
