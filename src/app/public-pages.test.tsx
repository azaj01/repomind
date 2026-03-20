import { describe, expect, it } from "vitest";
import { metadata as aboutMetadata } from "./about/page";
import { metadata as faqMetadata } from "./faq/page";
import { metadata as privacyMetadata } from "./privacy/page";
import { metadata as termsMetadata } from "./terms/page";
import { generateMetadata as generateComingSoonMetadata } from "./coming-soon/page";

describe("public information page metadata", () => {
    it("adds branded OG previews to the about page", () => {
        expect(aboutMetadata.title).toBe("About");
        expect(aboutMetadata.openGraph?.images?.[0]?.url).toContain("type=marketing");
        expect(aboutMetadata.openGraph?.images?.[0]?.url).toContain("variant=about");
    });

    it("adds branded OG previews to the FAQ page", () => {
        expect(faqMetadata.title).toBe("FAQ");
        expect(faqMetadata.openGraph?.images?.[0]?.url).toContain("type=marketing");
        expect(faqMetadata.openGraph?.images?.[0]?.url).toContain("variant=faq");
    });

    it("adds branded OG previews to privacy and terms pages", () => {
        expect(privacyMetadata.title).toBe("Privacy Policy");
        expect(privacyMetadata.openGraph?.images?.[0]?.url).toContain("type=marketing");
        expect(privacyMetadata.openGraph?.images?.[0]?.url).toContain("variant=privacy");

        expect(termsMetadata.title).toBe("Terms of Service");
        expect(termsMetadata.openGraph?.images?.[0]?.url).toContain("type=marketing");
        expect(termsMetadata.openGraph?.images?.[0]?.url).toContain("variant=terms");
    });

    it("builds a dynamic coming soon card for the requested feature", async () => {
        const metadata = await generateComingSoonMetadata({
            searchParams: Promise.resolve({ feature: "security-scanner" }),
        });

        expect(metadata.title).toBe("Security Scanner Coming Soon");
        expect(metadata.robots?.index).toBe(false);
        expect(metadata.openGraph?.images?.[0]?.url).toContain("type=marketing");
        expect(metadata.openGraph?.images?.[0]?.url).toContain("variant=coming-soon");
        expect(metadata.openGraph?.images?.[0]?.url).toContain("title=Security+Scanner+Coming+Soon");
    });
});
