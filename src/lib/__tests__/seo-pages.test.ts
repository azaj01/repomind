import { describe, expect, it } from "vitest";
import { getAllSeoPages } from "@/lib/seo-pages";
import { getSeoPageMetadata } from "@/lib/seo-page-route";

describe("SEO page system", () => {
  it("defines eight high-intent SEO pages with required contract fields", () => {
    const pages = getAllSeoPages();

    expect(pages).toHaveLength(8);
    for (const page of pages) {
      expect(page.slug).toBeTruthy();
      expect(page.title).toBeTruthy();
      expect(page.metaDescription.length).toBeGreaterThan(40);
      expect(page.h1).toBeTruthy();
      expect(page.primaryIntent).toBeTruthy();
      expect(page.sections.length).toBeGreaterThanOrEqual(3);
      expect(page.faq.length).toBeGreaterThanOrEqual(2);
      expect(page.schemaTypes).toEqual(expect.arrayContaining(["SoftwareApplication", "FAQPage", "BreadcrumbList"]));
      expect(page.ctaTargets.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("builds unique canonical metadata for each SEO page", () => {
    const pages = getAllSeoPages();
    const canonicals = new Set<string>();
    const titles = new Set<string>();

    for (const page of pages) {
      const metadata = getSeoPageMetadata(page.slug);
      const canonical = metadata.alternates?.canonical;
      expect(typeof canonical).toBe("string");
      expect((canonical as string).startsWith("/")).toBe(true);
      expect(canonicals.has(canonical as string)).toBe(false);
      canonicals.add(canonical as string);

      const title = typeof metadata.title === "string" ? metadata.title : metadata.title?.toString() ?? "";
      expect(titles.has(title)).toBe(false);
      titles.add(title);
    }
  });
});
