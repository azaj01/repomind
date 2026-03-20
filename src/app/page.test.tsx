import { describe, expect, it, vi } from "vitest";

vi.mock("./HomeClient", () => ({
    default: () => null,
}));

import { metadata } from "./page";

describe("home page metadata", () => {
    it("uses the landing page hero art and branded copy", () => {
        expect(metadata.title).toBe("AI-Powered Code Intelligence");
        expect(metadata.description).toContain("GitHub repositories and developer profiles");
        expect(metadata.openGraph?.title).toBe("AI-Powered Code Intelligence | RepoMind");
        expect(metadata.twitter?.title).toBe("AI-Powered Code Intelligence | RepoMind");
        expect(metadata.openGraph?.images?.[0]?.url).toContain("type=marketing");
        expect(metadata.openGraph?.images?.[0]?.url).toContain("variant=home");
        expect(metadata.twitter?.images?.[0]).toContain("type=marketing");
        expect(metadata.twitter?.images?.[0]).toContain("variant=home");
    });
});
