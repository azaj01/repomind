import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { authMock, generateAnswerStreamMock } = vi.hoisted(() => ({
    authMock: vi.fn(),
    generateAnswerStreamMock: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
    auth: authMock,
}));

vi.mock("@/app/actions", () => ({
    generateAnswerStream: generateAnswerStreamMock,
}));

import { POST } from "@/app/api/chat/repo/route";

describe("POST /api/chat/repo", () => {
    beforeEach(() => {
        authMock.mockReset();
        generateAnswerStreamMock.mockReset();
    });

    it("returns 401 for unauthenticated users", async () => {
        authMock.mockResolvedValue(null);

        const request = new NextRequest("http://localhost/api/chat/repo", {
            method: "POST",
            body: JSON.stringify({
                query: "What does this repo do?",
                repoDetails: { owner: "owner", repo: "repo" },
                filePaths: [],
                history: [],
                modelPreference: "flash",
            }),
            headers: {
                "content-type": "application/json",
            },
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(401);
        expect(body).toEqual({ error: "Unauthorized" });
        expect(generateAnswerStreamMock).not.toHaveBeenCalled();
    });

    it("returns INVALID_SESSION when user exists without id", async () => {
        authMock.mockResolvedValue({
            user: { name: "User", email: "user@example.com" },
        });

        const request = new NextRequest("http://localhost/api/chat/repo", {
            method: "POST",
            body: JSON.stringify({
                query: "What does this repo do?",
                repoDetails: { owner: "owner", repo: "repo" },
                filePaths: [],
                history: [],
                modelPreference: "flash",
            }),
            headers: {
                "content-type": "application/json",
            },
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(401);
        expect(body).toEqual({
            error: "Unauthorized",
            code: "INVALID_SESSION",
        });
        expect(generateAnswerStreamMock).not.toHaveBeenCalled();
    });
});
