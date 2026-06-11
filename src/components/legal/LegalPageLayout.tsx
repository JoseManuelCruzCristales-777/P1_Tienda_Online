import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { homeSearch } from "@/lib/home-search";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { LegalPageContent } from "@/lib/legal/content";

type LegalPageLayoutProps = {
  breadcrumb: string;
  content: LegalPageContent;
  children?: ReactNode;
};

export function LegalPageLayout({ breadcrumb, content, children }: LegalPageLayoutProps) {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <div className="mx-auto w-full max-w-container-max px-margin-mobile py-4 md:px-margin-desktop">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1 text-sm text-on-surface-variant"
        >
          <Link to="/" search={homeSearch} className="transition-colors hover:text-primary">
            {t("legal_home")}
          </Link>
          <ChevronRight aria-hidden className="size-4 stroke-[1.5]" />
          <span className="font-medium text-primary">{breadcrumb}</span>
        </nav>
      </div>

      <main className="mx-auto w-full max-w-3xl flex-grow px-margin-mobile pb-stack-lg md:px-margin-desktop">
        <article className="prose-rousse">
          <h1 className="font-headline-xl text-headline-xl text-primary">{content.title}</h1>
          <p className="mt-2 text-sm text-on-surface-variant">{content.updated}</p>
          {content.intro ? (
            <p className="mt-6 font-body-md text-body-md leading-relaxed text-on-surface-variant">
              {content.intro}
            </p>
          ) : null}

          {content.sections.map((section) => (
            <section key={section.heading} className="mt-8">
              <h2 className="font-headline-md text-headline-md text-primary">{section.heading}</h2>
              <div className="mt-3 flex flex-col gap-3">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="font-body-md text-body-md leading-relaxed text-on-surface-variant"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}

          {children}
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
