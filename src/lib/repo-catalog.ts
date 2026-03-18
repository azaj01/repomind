import fs from "node:fs";
import path from "node:path";
import { unstable_cache, revalidateTag } from "next/cache";
import { revalidatePath } from "next/cache";

export const REPO_CATALOG_CACHE_TAG = "repo-catalog";

const REPO_LIMIT = 7600;
const TOPIC_INDEX_LIMIT = 2000;
const TOPIC_MIN_REPO_COUNT = 20;
const TOPIC_REPO_LIST_LIMIT = 50;

export type RepoTier = 'all-time' | 'yearly' | '6-month' | 'monthly' | 'weekly';

export interface CatalogRepoEntry {
  owner: string;
  repo: string;
  stars: number;
  description: string | null;
  topics: string[];
  language: string | null;
  tier?: RepoTier;
  rank?: number;
  trendingScore?: number;
}

interface CatalogData {
  curatedRepos: CatalogRepoEntry[];
  curatedRepoKeys: string[];
  indexableTopics: string[];
}

function isCatalogRepoEntry(value: unknown): value is CatalogRepoEntry {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<CatalogRepoEntry>;

  return (
    typeof item.owner === "string" &&
    typeof item.repo === "string" &&
    typeof item.stars === "number" &&
    Array.isArray(item.topics)
  );
}

function normalizeRepo(entry: CatalogRepoEntry): CatalogRepoEntry {
  return {
    owner: entry.owner.trim(),
    repo: entry.repo.trim(),
    stars: entry.stars,
    description: entry.description,
    topics: entry.topics
      .filter((topic): topic is string => typeof topic === "string" && topic.trim().length > 0)
      .map((topic) => topic.toLowerCase()),
    language: entry.language,
    tier: entry.tier,
    rank: entry.rank,
    trendingScore: entry.trendingScore,
  };
}

function toRepoKey(owner: string, repo: string): string {
  return `${owner.toLowerCase()}/${repo.toLowerCase()}`;
}

function buildCatalogData(repos: CatalogRepoEntry[]): CatalogData {
  console.log(`[Catalog] Building catalog data from ${repos.length} input repos...`);
  const deduped: CatalogRepoEntry[] = [];
  const seenRepoKeys = new Set<string>();

  for (const repo of repos) {
    const normalized = normalizeRepo(repo);
    if (!normalized.owner || !normalized.repo) continue;

    const key = toRepoKey(normalized.owner, normalized.repo);
    if (seenRepoKeys.has(key)) continue;

    seenRepoKeys.add(key);
    deduped.push(normalized);
  }

  console.log(`[Catalog] Total deduped repos: ${deduped.length}`);

  const curatedRepos = deduped.slice(0, REPO_LIMIT);
  const curatedRepoKeys = curatedRepos.map((repo) => toRepoKey(repo.owner, repo.repo));

  const topicBuckets: Record<string, CatalogRepoEntry[]> = {};
  const topicFrequency: Record<string, { allTime: number; trending: number }> = {};

  for (const repo of curatedRepos) {
    const uniqueTopics = new Set(repo.topics);
    const isTrending = repo.tier === 'weekly' || repo.tier === 'monthly' || repo.tier === '6-month';

    for (const topic of uniqueTopics) {
      if (!topicBuckets[topic]) {
        topicBuckets[topic] = [];
        topicFrequency[topic] = { allTime: 0, trending: 0 };
      }
      topicBuckets[topic].push(repo);
      
      if (repo.tier === 'all-time') {
        topicFrequency[topic].allTime++;
      }
      if (isTrending) {
        topicFrequency[topic].trending++;
      }
    }
  }

  // Topic Strategy: 1500 Trending + 500 Stable
  const topicsByCount = Object.entries(topicBuckets)
    .sort((a, b) => b[1].length - a[1].length);
  
  console.log(`[Catalog] Top 10 topics by repo count:`, topicsByCount.slice(0, 10).map(([t, rs]) => `${t} (${rs.length})`));

  const eligibleTopics = topicsByCount
    .filter(([, reposForTopic]) => reposForTopic.length >= TOPIC_MIN_REPO_COUNT)
    .map(([topic]) => topic);
  
  console.log(`[Catalog] Found ${eligibleTopics.length} eligible topics (>=${TOPIC_MIN_REPO_COUNT} repos).`);

  const stableTopics = [...eligibleTopics]
    .sort((a, b) => topicFrequency[b].allTime - topicFrequency[a].allTime)
    .slice(0, 500);

  const remainingTopics = eligibleTopics.filter(t => !stableTopics.includes(t));
  
  const trendingTopics = remainingTopics
    .sort((a, b) => topicFrequency[b].trending - topicFrequency[a].trending)
    .slice(0, 1500);

  const indexableTopics = [...stableTopics, ...trendingTopics].sort();

  return {
    curatedRepos,
    curatedRepoKeys,
    indexableTopics,
  };
}

const getCatalogDataInternal = async (): Promise<CatalogData> => {
    try {
      console.log(`[Catalog] NODE_ENV: ${process.env.NODE_ENV}`);
      const dataPath = path.join(process.cwd(), "public", "data", "top-repos.json");
      console.log(`[Catalog] Loading data from: ${dataPath}`);
      if (!fs.existsSync(dataPath)) {
        console.warn("[Catalog] Data file not found.");
        return buildCatalogData([]);
      }

      const fileContent = await fs.promises.readFile(dataPath, "utf8");
      const parsed = JSON.parse(fileContent) as unknown;
      const repos = Array.isArray(parsed) ? parsed.filter(isCatalogRepoEntry) : [];
      console.log(`[Catalog] Parsed ${repos.length} valid repo entries.`);

      return buildCatalogData(repos);
    } catch (error) {
      console.error("Failed to load repo catalog data:", error);
      return buildCatalogData([]);
    }
};

const getCatalogDataCached = unstable_cache(
  getCatalogDataInternal,
  ["repo-catalog-data-v2"],
  {
    revalidate: false, // No auto-revalidation, handled manually
    tags: [REPO_CATALOG_CACHE_TAG],
  }
);

export async function getCatalogData(): Promise<CatalogData> {
  // Always fetch fresh in development
  if (process.env.NODE_ENV === "development") {
    return getCatalogDataInternal();
  }
  return getCatalogDataCached();
}

/**
 * Manually refresh the repository catalog cache.
 */
export async function refreshCatalogCache() {
  revalidateTag(REPO_CATALOG_CACHE_TAG, "max");
}

export async function getCuratedRepos(tier?: RepoTier): Promise<CatalogRepoEntry[]> {
  const data = await getCatalogData();
  if (tier) {
    return data.curatedRepos.filter(repo => repo.tier === tier);
  }
  return data.curatedRepos;
}

export async function isCuratedRepo(owner: string, repo: string): Promise<boolean> {
  const data = await getCatalogData();
  const key = toRepoKey(owner, repo);
  return data.curatedRepoKeys.includes(key);
}

export async function getReposForTopic(topic: string): Promise<CatalogRepoEntry[]> {
  const data = await getCatalogData();
  const normalizedTopic = topic.toLowerCase();
  const repos = data.curatedRepos.filter((repo) => repo.topics.includes(normalizedTopic));
  repos.sort((a, b) => b.stars - a.stars);
  return repos.slice(0, TOPIC_REPO_LIST_LIMIT);
}

export async function getIndexableTopics(): Promise<string[]> {
  const data = await getCatalogData();
  return data.indexableTopics;
}

export async function isIndexableTopic(topic: string): Promise<boolean> {
  const data = await getCatalogData();
  return data.indexableTopics.includes(topic.toLowerCase());
}

export async function getCatalogStats() {
  const data = await getCatalogData();
  const tierCounts: Record<string, number> = {
    'all-time': 0,
    'yearly': 0,
    '6-month': 0,
    'monthly': 0,
    'weekly': 0,
  };

  data.curatedRepos.forEach(repo => {
    if (repo.tier) tierCounts[repo.tier]++;
  });

  return {
    totalRepos: data.curatedRepos.length,
    totalTopics: data.indexableTopics.length,
    tierCounts
  };
}
