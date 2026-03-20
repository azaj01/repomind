import Link from "next/link";
import JsonLdScript from "@/components/JsonLdScript";
import SeoVisual from "@/components/seo/SeoVisual";
import type { SeoPageDefinition } from "@/lib/seo-pages";
import {
  buildBreadcrumbStructuredData,
  buildFaqStructuredData,
  buildSoftwareApplicationStructuredData,
} from "@/lib/structured-data";

type SeoLandingPageProps = {
  page: SeoPageDefinition;
};

export default function SeoLandingPage({ page }: SeoLandingPageProps) {
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore" },
    { name: page.h1, path: `/${page.slug}` },
  ];

  const breadcrumbSchema = buildBreadcrumbStructuredData(breadcrumbItems);
  const faqSchema = buildFaqStructuredData(page.faq);
  const softwareSchema = buildSoftwareApplicationStructuredData({
    name: `RepoMind ${page.title}`,
    description: page.metaDescription,
    path: `/${page.slug}`,
    featureList: page.sections.map((section) => section.title),
  });

  return (
    <main className="min-h-screen bg-[#09090b] text-white px-6 py-20">
      {page.schemaTypes.includes("SoftwareApplication") && <JsonLdScript data={softwareSchema} />}
      {page.schemaTypes.includes("FAQPage") && <JsonLdScript data={faqSchema} />}
      {page.schemaTypes.includes("BreadcrumbList") && <JsonLdScript data={breadcrumbSchema} />}

      <div className="mx-auto max-w-5xl">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-zinc-400 flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/explore" className="hover:text-white transition-colors">Explore</Link>
          <span>/</span>
          <span className="text-zinc-200">{page.title}</span>
        </nav>

        <header className="mb-12">
          <p className="text-cyan-300 text-xs uppercase tracking-[0.2em] mb-4">
            {page.primaryIntent}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">{page.h1}</h1>
          <p className="text-zinc-300 text-lg leading-relaxed max-w-3xl">{page.lead}</p>
        </header>

        <section className="mb-12">
          <SeoVisual
            variant={page.visualVariant}
            ariaLabel={`${page.title} visual workflow`}
            sizeMode="wide"
            animate
            priority="high"
          />
        </section>

        <section className="space-y-6 mb-14">
          {page.sections.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 md:p-8"
            >
              <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-zinc-300 leading-relaxed mb-3">
                  {paragraph}
                </p>
              ))}
              {section.bullets && section.bullets.length > 0 && (
                <ul className="space-y-2 mt-4">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="text-zinc-300 flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </section>

        <section className="mb-14 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-5">
            {page.faq.map((item) => (
              <article key={item.question} className="border-b border-white/10 pb-4 last:border-0">
                <h3 className="text-lg font-medium mb-2">{item.question}</h3>
                <p className="text-zinc-300 leading-relaxed">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-2">Take the Next Step</h2>
          <p className="text-zinc-400 mb-6">
            Continue with a workflow that matches your analysis goal.
          </p>
          <div className="flex flex-wrap gap-3">
            {page.ctaTargets.map((cta) => (
              <Link
                key={`${page.slug}-${cta.href}-${cta.label}`}
                href={cta.href}
                className={
                  cta.style === "primary"
                    ? "px-5 py-3 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition-colors"
                    : "px-5 py-3 rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-900 transition-colors"
                }
              >
                {cta.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
