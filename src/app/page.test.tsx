import { describe, expect, it, vi } from "vitest";

vi.mock("./HomeClient", () => ({
    default: () => null,
}));

import { metadata } from "./page";

describe("home page metadata", () => {
    it("uses intent-led metadata for repository analysis workflows", () => {
        expect(metadata.title).toBe("GitHub Repository Analysis, AI Code Review & Security Scanning");
        expect(metadata.description).toContain("Analyze GitHub repositories with full-context AI");
        expect(metadata.openGraph?.title).toBe("GitHub Repository Analysis, AI Code Review & Security Scanning | RepoMind");
        expect(metadata.twitter?.title).toBe("GitHub Repository Analysis, AI Code Review & Security Scanning | RepoMind");
        expect(metadata.openGraph?.images?.[0]?.url).toContain("type=marketing");
        expect(metadata.openGraph?.images?.[0]?.url).toContain("variant=home");
        expect(metadata.twitter?.images?.[0]).toContain("type=marketing");
        expect(metadata.twitter?.images?.[0]).toContain("variant=home");
    });
});
