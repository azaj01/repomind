import { beforeEach, describe, expect, it, vi } from "vitest";

const {
    getRepoMock,
    isCuratedRepoMock,
    getCachedRepoUnavailableMock,
} = vi.hoisted(() => ({
    getRepoMock: vi.fn(),
    isCuratedRepoMock: vi.fn(),
    getCachedRepoUnavailableMock: vi.fn(),
}));

vi.mock("@/lib/github", () => ({
    getRepo: getRepoMock,
    getRepoFullContext: vi.fn(),
    getErrorStatus: vi.fn(),
}));

vi.mock("@/lib/repo-catalog", () => ({
    isCuratedRepo: isCuratedRepoMock,
}));

vi.mock("@/lib/cache", () => ({
    cacheRepoUnavailable: vi.fn(),
    getCachedRepoUnavailable: getCachedRepoUnavailableMock,
}));

import { generateMetadata } from "./page";

describe("repository metadata", () => {
    beforeEach(() => {
        getRepoMock.mockReset();
        isCuratedRepoMock.mockReset();
        getCachedRepoUnavailableMock.mockReset();
    });

    it("builds branded metadata for indexed repositories", async () => {
        getCachedRepoUnavailableMock.mockResolvedValue(false);
        isCuratedRepoMock.mockResolvedValue(true);
        getRepoMock.mockResolvedValue({
            description: "A fast and focused widget analyzer.",
            stargazers_count: 123,
            forks_count: 45,
            language: "TypeScript",
        });

        const metadata = await generateMetadata({
            params: Promise.resolve({ owner: "acme", repo: "widget" }),
        });

        expect(metadata.title).toBe("acme/widget");
        expect(metadata.robots?.index).toBe(true);
        expect(metadata.openGraph?.images?.[0]?.url).toBe("/og/repository-analysis.png");
    });
});
