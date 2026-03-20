import type { SeoVisualVariant } from "@/components/seo/SeoVisual";

export type SeoSchemaType =
  | "SoftwareApplication"
  | "FAQPage"
  | "BreadcrumbList";

export type SeoSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type SeoFaqItem = {
  question: string;
  answer: string;
};

export type SeoCtaTarget = {
  label: string;
  href: string;
  style?: "primary" | "secondary";
};

export type SeoPageDefinition = {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  lead: string;
  primaryIntent: string;
  sections: SeoSection[];
  faq: SeoFaqItem[];
  schemaTypes: SeoSchemaType[];
  ctaTargets: SeoCtaTarget[];
  visualVariant: SeoVisualVariant;
};

export const SEO_PAGE_DEFINITIONS: Record<string, SeoPageDefinition> = {
  "github-code-analyzer": {
    slug: "github-code-analyzer",
    title: "GitHub Code Analyzer",
    metaDescription:
      "Analyze public GitHub repositories with full-file context. Understand architecture, behavior, and risk faster with RepoMind.",
    h1: "GitHub Code Analyzer for Fast Repository Understanding",
    lead:
      "RepoMind helps teams evaluate unfamiliar repositories with context-aware AI analysis across architecture, code behavior, and risk hotspots.",
    primaryIntent: "github code analyzer",
    visualVariant: "analysis-workflow",
    schemaTypes: ["SoftwareApplication", "FAQPage", "BreadcrumbList"],
    sections: [
      {
        title: "Why teams need a GitHub code analyzer",
        paragraphs: [
          "Repository onboarding is slow when engineers need to reconstruct architecture from scattered files. A code analyzer should reduce that cognitive load, not increase it.",
          "RepoMind focuses on practical understanding: what the system does, where logic lives, and where engineering risk accumulates.",
        ],
      },
      {
        title: "How RepoMind analyzes repositories",
        paragraphs: [
          "You start with a repository URL. RepoMind loads high-value files, maps structure, and returns architecture context you can use immediately.",
          "Agentic CAG gives the model full-file context where needed, which helps preserve dependency and control-flow relationships.",
        ],
        bullets: [
          "Architecture summaries for faster onboarding",
          "Context-aware code review insights",
          "Security signal surfacing with triage context",
        ],
      },
      {
        title: "When to use it",
        paragraphs: [
          "Use this workflow during due diligence, onboarding, incident retros, and pre-adoption evaluation of open-source dependencies.",
          "If the goal is faster understanding with fewer blind spots, a context-first analyzer outperforms snippet-only workflows.",
        ],
      },
    ],
    faq: [
      {
        question: "Can I analyze public repositories without cloning?",
        answer:
          "Yes. RepoMind can analyze public GitHub repositories directly from URL input for architecture and code understanding workflows.",
      },
      {
        question: "How is this different from snippet-based retrieval?",
        answer:
          "RepoMind uses context-aware file selection so analysis preserves system-level relationships instead of relying only on disconnected chunks.",
      },
    ],
    ctaTargets: [
      { label: "Analyze a Repository", href: "/chat", style: "primary" },
      { label: "GitHub Repository Analysis", href: "/github-repository-analysis", style: "secondary" },
      { label: "AI Code Review Tool", href: "/ai-code-review-tool", style: "secondary" },
    ],
  },
  "typescript-code-analyzer": {
    slug: "typescript-code-analyzer",
    title: "TypeScript Code Analyzer",
    metaDescription:
      "Analyze TypeScript repositories with full-context AI. Understand modules, dependency paths, and implementation risk quickly.",
    h1: "TypeScript Code Analyzer for Large Repositories",
    lead:
      "TypeScript projects often hide complexity in framework boundaries, shared utilities, and inferred types. RepoMind makes those relationships visible fast.",
    primaryIntent: "typescript code analyzer",
    visualVariant: "analysis-workflow",
    schemaTypes: ["SoftwareApplication", "FAQPage", "BreadcrumbList"],
    sections: [
      {
        title: "What slows TypeScript onboarding",
        paragraphs: [
          "Type inference and layered abstractions are powerful, but they make unfamiliar codebases harder to reason about quickly.",
          "RepoMind helps trace from entrypoint to implementation without losing context between files.",
        ],
      },
      {
        title: "TypeScript-focused analysis outputs",
        paragraphs: [
          "You get architecture and code behavior summaries tied to actual repository structure so teams can move from guessing to informed review.",
        ],
        bullets: [
          "Dependency path awareness across modules",
          "Hotspot mapping for complex business logic",
          "Context-rich prompts for follow-up review",
        ],
      },
      {
        title: "Best-fit teams and workflows",
        paragraphs: [
          "Engineering teams evaluating internal services or open-source TypeScript packages can use this workflow to shorten onboarding and reduce review latency.",
        ],
      },
    ],
    faq: [
      {
        question: "Does it work for Next.js and Node TypeScript codebases?",
        answer:
          "Yes. The workflow supports TypeScript repositories across common server and frontend patterns by following repository structure and dependencies.",
      },
      {
        question: "Can this help with architecture reviews?",
        answer:
          "Yes. It is designed to surface architecture and logic flow quickly so reviewers can reason about implementation decisions with context.",
      },
    ],
    ctaTargets: [
      { label: "Analyze TypeScript Repo", href: "/chat", style: "primary" },
      { label: "Repository Analysis", href: "/github-repository-analysis", style: "secondary" },
      { label: "Security Scanner", href: "/security-scanner", style: "secondary" },
    ],
  },
  "nodejs-security-scanner": {
    slug: "nodejs-security-scanner",
    title: "Node.js Security Scanner",
    metaDescription:
      "Scan Node.js repositories for actionable security risks. Prioritize findings with repository context and remediation guidance.",
    h1: "Node.js Security Scanner for Context-Aware Risk Triage",
    lead:
      "RepoMind helps teams identify and prioritize Node.js security risks with code-context detail that improves remediation speed.",
    primaryIntent: "nodejs security scanner",
    visualVariant: "security-workflow",
    schemaTypes: ["SoftwareApplication", "FAQPage", "BreadcrumbList"],
    sections: [
      {
        title: "Security scanning without alert fatigue",
        paragraphs: [
          "High-volume alert streams can slow teams down. RepoMind focuses on findings that are easier to verify and prioritize.",
          "The result is faster triage and clearer remediation sequencing.",
        ],
      },
      {
        title: "Node.js-oriented workflow",
        paragraphs: [
          "For Node.js repositories, RepoMind inspects code and dependency surfaces and maps findings into a reviewable security narrative.",
        ],
        bullets: [
          "Actionable findings with severity framing",
          "Context-aware remediation guidance",
          "Faster prioritization for engineering teams",
        ],
      },
      {
        title: "Where this fits in delivery",
        paragraphs: [
          "Use it before release milestones, during due diligence, and in recurring repository health checks for critical services.",
        ],
      },
    ],
    faq: [
      {
        question: "Is this a replacement for every security tool?",
        answer:
          "No. It is designed to improve repository-level understanding and prioritization, and can complement existing security programs.",
      },
      {
        question: "Can I use this on open-source Node.js projects?",
        answer:
          "Yes. Public repositories are supported and can be analyzed for architecture and risk context.",
      },
    ],
    ctaTargets: [
      { label: "Start Node.js Security Scan", href: "/chat", style: "primary" },
      { label: "Security Scanner", href: "/security-scanner", style: "secondary" },
      { label: "Repository Risk Analysis", href: "/repository-risk-analysis", style: "secondary" },
    ],
  },
  "open-source-security-scanner": {
    slug: "open-source-security-scanner",
    title: "Open Source Security Scanner",
    metaDescription:
      "Evaluate open-source repositories with context-aware security scanning and prioritize fixes with confidence.",
    h1: "Open Source Security Scanner for Faster Risk Decisions",
    lead:
      "Before adopting an open-source dependency, teams need clarity on architecture, maintenance signals, and security posture. RepoMind helps surface that quickly.",
    primaryIntent: "open source security scanner",
    visualVariant: "security-workflow",
    schemaTypes: ["SoftwareApplication", "FAQPage", "BreadcrumbList"],
    sections: [
      {
        title: "Open-source risk needs context",
        paragraphs: [
          "Dependency decisions are not only about CVE counts. Teams need implementation context to decide what is acceptable in production environments.",
        ],
      },
      {
        title: "How RepoMind supports due diligence",
        paragraphs: [
          "RepoMind combines repository understanding with security signal analysis so teams can assess adoption risk with more confidence.",
        ],
        bullets: [
          "Repository architecture snapshot",
          "Security finding prioritization",
          "Faster review handoff to maintainers and stakeholders",
        ],
      },
      {
        title: "Decision support for adoption",
        paragraphs: [
          "Use this page’s workflow when deciding whether to integrate, fork, or avoid an unfamiliar dependency.",
        ],
      },
    ],
    faq: [
      {
        question: "Can this help during open-source package evaluation?",
        answer:
          "Yes. It is designed to support repository-level due diligence with architecture and security context.",
      },
      {
        question: "Does it require private repo access?",
        answer:
          "Public repository analysis works directly from URL input. Private repository support can be handled through authenticated workflows.",
      },
    ],
    ctaTargets: [
      { label: "Evaluate an Open Source Repo", href: "/chat", style: "primary" },
      { label: "GitHub Repository Analysis", href: "/github-repository-analysis", style: "secondary" },
      { label: "Compare Workflows", href: "/compare", style: "secondary" },
    ],
  },
  "repository-risk-analysis": {
    slug: "repository-risk-analysis",
    title: "Repository Risk Analysis",
    metaDescription:
      "Assess repository risk across architecture complexity, implementation hotspots, and security exposure with RepoMind.",
    h1: "Repository Risk Analysis for Engineering and Security Teams",
    lead:
      "RepoMind helps teams reason about repository risk before major integration or migration decisions with practical, context-aware outputs.",
    primaryIntent: "repository risk analysis",
    visualVariant: "trust-signal",
    schemaTypes: ["SoftwareApplication", "FAQPage", "BreadcrumbList"],
    sections: [
      {
        title: "What repository risk includes",
        paragraphs: [
          "Risk is multidimensional: architecture complexity, critical path fragility, dependency exposure, and reviewability under delivery pressure.",
        ],
      },
      {
        title: "Risk analysis workflow in RepoMind",
        paragraphs: [
          "RepoMind provides architecture and security perspectives in one workflow so teams can identify likely hotspots and mitigation priorities.",
        ],
        bullets: [
          "Complexity visibility across modules",
          "Security and implementation risk indicators",
          "Prioritized next actions for teams",
        ],
      },
      {
        title: "Operational use cases",
        paragraphs: [
          "Use this workflow during acquisition diligence, vendor evaluation, major refactors, and onboarding of mission-critical dependencies.",
        ],
      },
    ],
    faq: [
      {
        question: "Is repository risk analysis only for security teams?",
        answer:
          "No. Engineering leadership, platform teams, and due diligence stakeholders can all use repository risk analysis outputs.",
      },
      {
        question: "Can this reduce onboarding time?",
        answer:
          "Yes. By surfacing hotspots and architecture paths quickly, teams spend less time on manual discovery before making decisions.",
      },
    ],
    ctaTargets: [
      { label: "Run Repository Risk Analysis", href: "/chat", style: "primary" },
      { label: "Security Scanner", href: "/security-scanner", style: "secondary" },
      { label: "AI Code Review Tool", href: "/ai-code-review-tool", style: "secondary" },
    ],
  },
  "static-analysis-vs-repomind": {
    slug: "static-analysis-vs-repomind",
    title: "Static Analysis vs RepoMind",
    metaDescription:
      "Compare traditional static analysis and RepoMind’s context-aware workflow for repository understanding and security prioritization.",
    h1: "Static Analysis vs RepoMind: Context Depth and Actionability",
    lead:
      "Static analysis tools and context-aware repository analysis solve different problems. This comparison clarifies when each is most useful.",
    primaryIntent: "static analysis vs repomind",
    visualVariant: "comparison-grid",
    schemaTypes: ["SoftwareApplication", "FAQPage", "BreadcrumbList"],
    sections: [
      {
        title: "What static analysis does well",
        paragraphs: [
          "Traditional static analysis is effective for policy checks, known pattern detection, and broad automated guardrails.",
        ],
      },
      {
        title: "Where context-aware analysis helps",
        paragraphs: [
          "RepoMind complements rule-driven tools by adding architecture and behavior context, which improves triage and review decisions.",
        ],
        bullets: [
          "Repository-wide reasoning instead of snippet-only context",
          "Faster understanding of dependency and logic paths",
          "Practical outputs for engineering review workflows",
        ],
      },
      {
        title: "How to combine both approaches",
        paragraphs: [
          "Use static analysis for broad baseline controls and RepoMind for deep interpretation, prioritization, and action planning.",
        ],
      },
    ],
    faq: [
      {
        question: "Is RepoMind intended to replace static analysis?",
        answer:
          "No. It is best used alongside static analysis when teams need deeper repository context for review and prioritization.",
      },
      {
        question: "Which workflow is better for architecture understanding?",
        answer:
          "Context-aware repository analysis is generally stronger for architecture interpretation because it focuses on file relationships and control flow.",
      },
    ],
    ctaTargets: [
      { label: "Compare in Practice", href: "/chat", style: "primary" },
      { label: "Repository Analysis Workflow", href: "/github-repository-analysis", style: "secondary" },
      { label: "Security Scanner Workflow", href: "/security-scanner", style: "secondary" },
    ],
  },
  "repomind-vs-sonarqube": {
    slug: "repomind-vs-sonarqube",
    title: "RepoMind vs SonarQube",
    metaDescription:
      "See how RepoMind compares with SonarQube for repository understanding, review context, and actionable prioritization.",
    h1: "RepoMind vs SonarQube for Repository Understanding",
    lead:
      "SonarQube and RepoMind can be complementary. This page outlines where each tool provides stronger value by workflow type.",
    primaryIntent: "repomind vs sonarqube",
    visualVariant: "comparison-grid",
    schemaTypes: ["SoftwareApplication", "FAQPage", "BreadcrumbList"],
    sections: [
      {
        title: "SonarQube strengths",
        paragraphs: [
          "SonarQube is widely used for code quality policy and rule-based scanning in CI workflows.",
        ],
      },
      {
        title: "RepoMind strengths",
        paragraphs: [
          "RepoMind focuses on context-aware repository understanding and practical analysis outputs across architecture, review, and security workflows.",
        ],
        bullets: [
          "High-context repository analysis",
          "Workflow-oriented actionability",
          "Fast onboarding for unfamiliar codebases",
        ],
      },
      {
        title: "Selection guidance",
        paragraphs: [
          "For teams already running rule-based checks, RepoMind can fill interpretation and prioritization gaps when deeper context is required.",
        ],
      },
    ],
    faq: [
      {
        question: "Can teams use SonarQube and RepoMind together?",
        answer:
          "Yes. A common pattern is policy and baseline checks in SonarQube, with RepoMind used for deep context and prioritization.",
      },
      {
        question: "Does RepoMind provide architecture understanding?",
        answer:
          "Yes. It is designed to help teams understand architecture and logic flow quickly across unfamiliar repositories.",
      },
    ],
    ctaTargets: [
      { label: "Try RepoMind Workflow", href: "/chat", style: "primary" },
      { label: "AI Code Review Tool", href: "/ai-code-review-tool", style: "secondary" },
      { label: "Read Comparison Hub", href: "/compare", style: "secondary" },
    ],
  },
  "repomind-vs-snyk": {
    slug: "repomind-vs-snyk",
    title: "RepoMind vs Snyk",
    metaDescription:
      "Compare RepoMind and Snyk across repository context, security prioritization, and engineering actionability.",
    h1: "RepoMind vs Snyk: Security Context and Prioritization",
    lead:
      "Snyk is a strong security platform. RepoMind helps teams add repository-level context so findings are easier to prioritize and resolve.",
    primaryIntent: "repomind vs snyk",
    visualVariant: "comparison-grid",
    schemaTypes: ["SoftwareApplication", "FAQPage", "BreadcrumbList"],
    sections: [
      {
        title: "Where Snyk fits",
        paragraphs: [
          "Snyk provides broad security scanning and governance capabilities that many organizations rely on in production workflows.",
        ],
      },
      {
        title: "Where RepoMind adds value",
        paragraphs: [
          "RepoMind provides context-aware repository analysis that can strengthen remediation planning and engineering triage.",
        ],
        bullets: [
          "Repository architecture context",
          "Action-ready analysis outputs",
          "Security + code understanding in one workflow",
        ],
      },
      {
        title: "Decision framing",
        paragraphs: [
          "Teams can use Snyk for broad security coverage and RepoMind to accelerate deep-dive interpretation and implementation planning.",
        ],
      },
    ],
    faq: [
      {
        question: "Is this a one-or-the-other choice?",
        answer:
          "Not necessarily. Many teams can combine both workflows to get broad security coverage and richer repository context.",
      },
      {
        question: "What does RepoMind improve in security workflows?",
        answer:
          "It improves context for triage and remediation planning by connecting findings with repository structure and behavior.",
      },
    ],
    ctaTargets: [
      { label: "Start Security Workflow", href: "/chat", style: "primary" },
      { label: "Security Scanner", href: "/security-scanner", style: "secondary" },
      { label: "Compare Workflows", href: "/compare", style: "secondary" },
    ],
  },
};

export function getSeoPageBySlug(slug: string): SeoPageDefinition | null {
  return SEO_PAGE_DEFINITIONS[slug] ?? null;
}

export function getAllSeoPages(): SeoPageDefinition[] {
  return Object.values(SEO_PAGE_DEFINITIONS);
}
