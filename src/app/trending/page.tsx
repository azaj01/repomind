import { Suspense } from 'react';
import { Metadata } from 'next';
import { getCuratedRepos } from '@/lib/repo-catalog';
import TrendingClient from '@/components/TrendingClient';

export const metadata: Metadata = {
  title: "Explore Trending Repositories | RepoMind",
  description: "Explore this week's most trending GitHub repositories. Analyze them instantly with RepoMind's AI-driven intelligence.",
  keywords: ["trending github repos", "popular repositories", "github trends", "trending code", "repo analysis"],
  alternates: {
    canonical: '/trending',
  },
};

export default async function TrendingPage() {
  const trendingRepos = await getCuratedRepos('weekly');

  return (
    <Suspense fallback={null}>
      <TrendingClient initialRepos={trendingRepos} />
    </Suspense>
  );
}
