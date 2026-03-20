import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { OgCard, resolveOgCardSpec } from "@/lib/og-card";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const CACHE_CONTROL = "public, s-maxage=86400, stale-while-revalidate=604800";

export async function GET(req: NextRequest) {
    try {
        const spec = resolveOgCardSpec(new URL(req.url).searchParams, req.url);

        return new ImageResponse(
            <OgCard spec={spec} />,
            {
                width: 1200,
                height: 630,
                headers: {
                    "Cache-Control": CACHE_CONTROL,
                },
            }
        );
    } catch (error) {
        console.error("Failed to generate OG image:", error);

        return new Response("Failed to generate the image", {
            status: 500,
            headers: {
                "Cache-Control": "no-cache",
            },
        });
    }
}

