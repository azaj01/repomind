import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { OgCard, resolveOgCardSpec } from "@/lib/og-card";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const CACHE_CONTROL = "public, s-maxage=604800, stale-while-revalidate=86400";

const FONT_URL_BOLD = "https://github.com/google/fonts/raw/main/ofl/montserrat/static/Montserrat-Bold.ttf";
const FONT_URL_REGULAR = "https://github.com/google/fonts/raw/main/ofl/montserrat/static/Montserrat-Regular.ttf";

export async function GET(req: NextRequest) {
    try {
        const spec = resolveOgCardSpec(new URL(req.url).searchParams, req.url);

        // Fetch fonts with error handling
        const fontData = await Promise.all([
            fetch(new URL(FONT_URL_BOLD), { cache: 'force-cache' }).then(res => res.ok ? res.arrayBuffer() : null).catch(() => null),
            fetch(new URL(FONT_URL_REGULAR), { cache: 'force-cache' }).then(res => res.ok ? res.arrayBuffer() : null).catch(() => null)
        ]);

        const boldData = fontData[0];
        const regularData = fontData[1];

        const fonts = [];
        if (boldData) {
            fonts.push({
                name: "Montserrat",
                data: boldData,
                weight: 700 as const,
                style: "normal" as const,
            });
        }
        if (regularData) {
            fonts.push({
                name: "Montserrat",
                data: regularData,
                weight: 400 as const,
                style: "normal" as const,
            });
        }

        return new ImageResponse(
            <OgCard spec={spec} />,
            {
                width: 1200,
                height: 630,
                fonts: fonts.length > 0 ? fonts : undefined,
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

