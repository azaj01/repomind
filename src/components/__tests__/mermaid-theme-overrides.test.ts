import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const mermaidComponentSource = readFileSync(
    path.resolve(process.cwd(), "src/components/Mermaid.tsx"),
    "utf8"
);

describe("Mermaid diagram post-render theming hooks", () => {
    it("targets Mermaid mindmap section classes for node and edge styling", () => {
        expect(mermaidComponentSource).toContain("g.mindmap-node");
        expect(mermaidComponentSource).toContain("section-edge-");
        expect(mermaidComponentSource).toContain("--mindmap-branch-1-fill");
    });

    it("forces xychart background transparency and themed plot colors", () => {
        expect(mermaidComponentSource).toContain("rect.background");
        expect(mermaidComponentSource).toContain("--xychart-text");
        expect(mermaidComponentSource).toContain("--xychart-axis");
        expect(mermaidComponentSource).toContain("--xychart-bar");
        expect(mermaidComponentSource).toContain("--xychart-line");
    });
});
