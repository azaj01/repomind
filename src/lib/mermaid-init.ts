import mermaid from "mermaid";
import { APP_FONT_STACK } from "@/lib/design-tokens";

export const MERMAID_THEME_VARIABLES = {
    primaryColor: '#18181b', // zinc-900
    primaryTextColor: '#e4e4e7', // zinc-200
    primaryBorderColor: '#3f3f46', // zinc-700
    lineColor: '#a1a1aa', // zinc-400
    secondaryColor: '#27272a', // zinc-800
    tertiaryColor: '#27272a', // zinc-800
    mainBkg: '#18181b',
    rowOdd: '#27272a',
    rowEven: '#1f1f23',
    attributeBackgroundColorOdd: '#27272a',
    attributeBackgroundColorEven: '#1f1f23',
    nodeBorder: '#3f3f46',
    nodeTextColor: '#e4e4e7',
    textColor: '#e4e4e7',
    fontFamily: APP_FONT_STACK,
} as const;

export const MERMAID_THEME_CSS = `
    .label, .label text, .nodeLabel, .edgeLabel, .cluster-label, text {
        font-family: ${APP_FONT_STACK} !important;
    }
    .label {
        fill: #e4e4e7 !important;
    }
    .edgeLabel {
        background: #18181b !important;
        padding: 2px 6px !important;
        border-radius: 6px !important;
    }
    .edgeLabel rect {
        fill: #18181b !important;
        opacity: 0.95 !important;
        stroke: #3f3f46 !important;
    }
    .node rect,
    .node polygon,
    .node circle,
    .node ellipse {
        fill: #18181b !important;
        stroke: #3f3f46 !important;
    }
    .mindmap .node:nth-of-type(6n + 1) rect,
    .mindmap .node:nth-of-type(6n + 1) circle {
        fill: #1f2937 !important;
        stroke: #60a5fa !important;
    }
    .mindmap .node:nth-of-type(6n + 2) rect,
    .mindmap .node:nth-of-type(6n + 2) circle {
        fill: #172554 !important;
        stroke: #38bdf8 !important;
    }
    .mindmap .node:nth-of-type(6n + 3) rect,
    .mindmap .node:nth-of-type(6n + 3) circle {
        fill: #0f766e !important;
        stroke: #34d399 !important;
    }
    .mindmap .node:nth-of-type(6n + 4) rect,
    .mindmap .node:nth-of-type(6n + 4) circle {
        fill: #4c1d95 !important;
        stroke: #a78bfa !important;
    }
    .mindmap .node:nth-of-type(6n + 5) rect,
    .mindmap .node:nth-of-type(6n + 5) circle {
        fill: #78350f !important;
        stroke: #f59e0b !important;
    }
    .mindmap .node:nth-of-type(6n + 6) rect,
    .mindmap .node:nth-of-type(6n + 6) circle {
        fill: #7f1d1d !important;
        stroke: #f87171 !important;
    }
    .xychart .plot,
    .xychart .background {
        fill: transparent !important;
    }
    .xychart text,
    .xychart .axisLabel,
    .xychart .titleText {
        fill: #e4e4e7 !important;
    }
    .xychart .axis line,
    .xychart .axis path,
    .xychart .tick line {
        stroke: #52525b !important;
    }
    .xychart .bar-plot rect,
    .xychart .bar {
        fill: #60a5fa !important;
        stroke: #60a5fa !important;
    }
    .xychart .line-plot path,
    .xychart .line {
        stroke: #22d3ee !important;
    }
    .er .entityBox {
        fill: #18181b !important;
        stroke: #3f3f46 !important;
    }
    .er .entityBox rect,
    .er .labelBkg rect,
    .er .relationshipLabelBox,
    .er .relationshipLabelBox rect {
        fill: #27272a !important;
        opacity: 1 !important;
    }
    .er g.row-rect-odd path,
    .er g.row-rect-odd rect,
    .er g.row-rect-even path,
    .er g.row-rect-even rect {
        opacity: 1 !important;
    }
    .er g.row-rect-odd path,
    .er g.row-rect-odd rect {
        fill: #27272a !important;
    }
    .er g.row-rect-even path,
    .er g.row-rect-even rect {
        fill: #1f1f23 !important;
    }
    .er .label,
    .er .label text,
    .er text {
        fill: #e4e4e7 !important;
    }
`;

/**
 * Centralized Mermaid initialization
 * Ensures consistent theme and configuration across all components
 */
export const initMermaid = () => {
    mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        securityLevel: 'strict', // Prevent XSS attacks by enabling HTML sanitization
        suppressErrorRendering: true, // Prevent default error message from appearing at bottom of screen
        flowchart: {
            htmlLabels: false,
            useMaxWidth: true,
            curve: "basis",
            nodeSpacing: 55,
            rankSpacing: 60,
        },
        sequence: {
            useMaxWidth: true,
            actorMargin: 70,
            messageMargin: 52,
            boxMargin: 12,
        },
        themeVariables: MERMAID_THEME_VARIABLES,
        themeCSS: MERMAID_THEME_CSS,
    });
};
