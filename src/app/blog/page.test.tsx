import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/Footer", () => ({
    default: () => null,
}));

import { metadata } from "./page";

describe("blog index metadata", () => {
    it("uses the blog marketing OG card", () => {
        expect(metadata.title).toBe("Insights");
        expect(metadata.description).toContain("Agentic CAG");
        expect(metadata.openGraph?.title).toBe("RepoMind Insights");
        expect(metadata.openGraph?.images?.[0]?.url).toContain("type=marketing");
        expect(metadata.openGraph?.images?.[0]?.url).toContain("variant=blog");
    });
});
