import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { authMock, isAdminUserMock, getAnalyticsDetailsMock } = vi.hoisted(() => ({
    authMock: vi.fn(),
    isAdminUserMock: vi.fn(),
    getAnalyticsDetailsMock: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
    auth: authMock,
}));

vi.mock("@/lib/admin-auth", () => ({
    isAdminUser: isAdminUserMock,
}));

vi.mock("@/lib/analytics", () => ({
    getAnalyticsDetails: getAnalyticsDetailsMock,
}));

import { GET } from "@/app/api/admin/stats/details/route";

describe("GET /api/admin/stats/details", () => {
    beforeEach(() => {
        authMock.mockReset();
        isAdminUserMock.mockReset();
        getAnalyticsDetailsMock.mockReset();

        getAnalyticsDetailsMock.mockResolvedValue({
            activeUsers24h: 0,
            recentVisitors: [],
            loggedInUsers: [],
        });
    });

    it("returns 403 for non-admin users", async () => {
        authMock.mockResolvedValue({ user: { id: "u_1" } });
        isAdminUserMock.mockReturnValue(false);

        const response = await GET(new NextRequest("http://localhost/api/admin/stats/details"));
        expect(response.status).toBe(403);
        expect(getAnalyticsDetailsMock).not.toHaveBeenCalled();
    });

    it("uses default limits of 10 when params are absent", async () => {
        authMock.mockResolvedValue({ user: { id: "u_1" } });
        isAdminUserMock.mockReturnValue(true);

        const response = await GET(new NextRequest("http://localhost/api/admin/stats/details"));
        expect(response.status).toBe(200);
        expect(getAnalyticsDetailsMock).toHaveBeenCalledWith({
            visitorLimit: 10,
            loggedInLimit: 10,
            includeSelection: true,
            includeFunnel: true,
            includeFalsePositiveReview: true,
            includeKvHistory: true,
        });
    });

    it("clamps custom limits to route bounds", async () => {
        authMock.mockResolvedValue({ user: { id: "u_1" } });
        isAdminUserMock.mockReturnValue(true);

        const response = await GET(
            new NextRequest("http://localhost/api/admin/stats/details?visitorLimit=999&loggedInLimit=0")
        );
        expect(response.status).toBe(200);
        expect(getAnalyticsDetailsMock).toHaveBeenCalledWith({
            visitorLimit: 100,
            loggedInLimit: 1,
            includeSelection: true,
            includeFunnel: true,
            includeFalsePositiveReview: true,
            includeKvHistory: true,
        });
    });
});
