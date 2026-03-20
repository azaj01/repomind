import { beforeEach, describe, expect, it, vi } from "vitest";

const { getProfileMock, getRepoMock } = vi.hoisted(() => ({
    getProfileMock: vi.fn(),
    getRepoMock: vi.fn(),
}));

vi.mock("@/components/ProfileLoader", () => ({
    ProfileLoader: () => null,
}));

vi.mock("@/components/RepoLoader", () => ({
    RepoLoader: () => null,
}));

vi.mock("@/lib/github", () => ({
    getProfile: getProfileMock,
    getRepo: getRepoMock,
}));

import { generateMetadata } from "./page";

describe("chat metadata", () => {
    beforeEach(() => {
        getProfileMock.mockReset();
        getRepoMock.mockReset();
    });

    it("uses a generic landing preview when no query is provided", async () => {
        const metadata = await generateMetadata({
            searchParams: Promise.resolve({}),
        });

        expect(metadata.title).toBe("Chat");
        expect(metadata.robots?.index).toBe(false);
        expect(metadata.robots?.follow).toBe(true);
        expect(metadata.openGraph?.images?.[0]?.url).toContain("type=marketing");
        expect(metadata.openGraph?.images?.[0]?.url).toContain("variant=home");
    });

    it("builds profile metadata and honors the prompt intent", async () => {
        getProfileMock.mockResolvedValue({
            login: "ada",
            name: "Ada Lovelace",
            bio: "Pioneer of computing and the first programmer.",
            public_repos: 7,
            followers: 1234,
            following: 9,
        });

        const metadata = await generateMetadata({
            searchParams: Promise.resolve({
                q: "ada",
                prompt: "please show architecture flow",
            }),
        });

        expect(metadata.title).toBe("Ada Lovelace (@ada) Architecture");
        expect(metadata.description).toContain("Pioneer of computing");
        expect(metadata.description).toContain("explore projects, skills, and contributions");
        expect(metadata.openGraph?.images?.[0]?.url).toContain("type=profile");
        expect(metadata.openGraph?.images?.[0]?.url).toContain("username=ada");
        expect(metadata.openGraph?.images?.[0]?.url).toContain("mode=architecture");
    });

    it("builds repo metadata and biases the card from the prompt intent", async () => {
        getRepoMock.mockResolvedValue({
            description: "Secure APIs for teams.",
            stargazers_count: 321,
            forks_count: 45,
            language: "TypeScript",
        });

        const metadata = await generateMetadata({
            searchParams: Promise.resolve({
                q: "acme/widget",
                prompt: "review security risks",
            }),
        });

        expect(metadata.title).toBe("acme/widget Security");
        expect(metadata.description).toContain("Surface risks");
        expect(metadata.description).toContain("Secure APIs for teams.");
        expect(metadata.openGraph?.images?.[0]?.url).toContain("type=repo");
        expect(metadata.openGraph?.images?.[0]?.url).toContain("owner=acme");
        expect(metadata.openGraph?.images?.[0]?.url).toContain("repo=widget");
        expect(metadata.openGraph?.images?.[0]?.url).toContain("mode=security");
    });
});
