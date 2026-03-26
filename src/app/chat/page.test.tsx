import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/ProfileLoader", () => ({
    ProfileLoader: () => null,
}));

vi.mock("@/components/RepoLoader", () => ({
    RepoLoader: () => null,
}));

import { generateMetadata } from "./page";

describe("chat metadata", () => {
    it("uses a generic landing preview when no query is provided", async () => {
        const metadata = await generateMetadata({
            searchParams: Promise.resolve({}),
        });

        expect(metadata.title).toBe("Chat");
        expect(metadata.robots?.index).toBe(false);
        expect(metadata.robots?.follow).toBe(true);
        expect(metadata.openGraph?.images?.[0]?.url).toBe("/og/homepage.png");
    });

    it("builds profile metadata and honors the prompt intent", async () => {
        const metadata = await generateMetadata({
            searchParams: Promise.resolve({
                q: "ada",
                prompt: "please show architecture flow",
            }),
        });

        expect(metadata.title).toBe("@ada Architecture");
        expect(metadata.description).toContain("Generate architecture flowcharts");
        expect(metadata.description).toContain("Explore projects, skills, and contributions");
        expect(metadata.openGraph?.images?.[0]?.url).toBe("/og/homepage.png");
    });

    it("builds repo metadata and biases the card from the prompt intent", async () => {
        const metadata = await generateMetadata({
            searchParams: Promise.resolve({
                q: "acme/widget",
                prompt: "review security risks",
            }),
        });

        expect(metadata.title).toBe("acme/widget Security");
        expect(metadata.description).toContain("Surface risks");
        expect(metadata.description).toContain("Ask about architecture");
        expect(metadata.openGraph?.images?.[0]?.url).toBe("/og/homepage.png");
    });
});
