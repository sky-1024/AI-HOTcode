'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RepoCard } from '@/components/repo-card';
import { SummaryModal } from '@/components/summary-modal';
import { Header } from '@/components/header';
import { LoadingSpinner } from '@/components/loading-spinner';
import type { Repository } from '@/types';

interface WatchedData {
  organizations: Repository[];
  developers: Repository[];
}

export default function Home() {
  const [trendingRepos, setTrendingRepos] = useState<Repository[]>([]);
  const [newRepos, setNewRepos] = useState<Repository[]>([]);
  const [watchedData, setWatchedData] = useState<WatchedData>({ organizations: [], developers: [] });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedKeyword, setSelectedKeyword] = useState<string>('all');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [organizations, setOrganizations] = useState<string[]>([]);
  const [developers, setDevelopers] = useState<string[]>([]);
  const [summaryRepo, setSummaryRepo] = useState<Repository | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const fetchData = async (force = false) => {
    try {
      const qs = force ? '?force=true' : '';
      const [trendingRes, newRes, watchedRes, configRes] = await Promise.all([
        fetch(`/api/trending${qs}`),
        fetch(`/api/new${qs}`),
        fetch(`/api/watched${qs}`),
        fetch('/api/config'),
      ]);
      
      const trendingData = await trendingRes.json();
      const newData = await newRes.json();
      const watchedData = await watchedRes.json();
      const configData = await configRes.json();
      
      setTrendingRepos(trendingData.data || []);
      setNewRepos(newData.data || []);
      setWatchedData({
        organizations: watchedData.organizations || [],
        developers: watchedData.developers || [],
      });
      setKeywords(configData.keywords || []);
      setOrganizations(configData.organizations || []);
      setDevelopers(configData.developers || []);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => fetchData(false), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const filterRepos = (repos: Repository[]) => {
    if (selectedKeyword === 'all') return repos;
    return repos.filter(repo => 
      repo.matched_keywords?.includes(selectedKeyword)
    );
  };

  const handleCardClick = (repo: Repository, e: React.MouseEvent) => {
    e.preventDefault();
    setSummaryRepo(repo);
    setSummaryOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header 
        lastUpdate={lastUpdate}
        autoRefresh={autoRefresh}
        onAutoRefreshChange={setAutoRefresh}
        onRefresh={() => fetchData(true)}
      />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedKeyword('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedKeyword === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              全部
            </button>
            {keywords.map(kw => (
              <button
                key={kw}
                onClick={() => setSelectedKeyword(kw)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedKeyword === kw
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {kw}
              </button>
            ))}
          </div>
        )}

        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="trending">热门项目</TabsTrigger>
            <TabsTrigger value="new">最新项目</TabsTrigger>
            <TabsTrigger value="watched">关注</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trending">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filterRepos(trendingRepos).map(repo => (
                <RepoCard
                  key={repo.id}
                  repo={repo}
                  onClick={(e) => handleCardClick(repo, e)}
                />
              ))}
            </div>
            {filterRepos(trendingRepos).length === 0 && (
              <div className="text-center py-12 text-gray-500">
                暂无匹配的热门项目
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="new">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filterRepos(newRepos).map(repo => (
                <RepoCard
                  key={repo.id}
                  repo={repo}
                  onClick={(e) => handleCardClick(repo, e)}
                />
              ))}
            </div>
            {filterRepos(newRepos).length === 0 && (
              <div className="text-center py-12 text-gray-500">
                暂无匹配的新项目
              </div>
            )}
          </TabsContent>

          <TabsContent value="watched">
            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">权威大机构</h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">({organizations.length} 个组织)</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {organizations.map(org => (
                    <a
                      key={org}
                      href={`https://github.com/${org}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                    >
                      {org}
                    </a>
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {watchedData.organizations.map(repo => (
                    <RepoCard
                      key={repo.id}
                      repo={repo}
                      badge={repo._source}
                      badgeColor="purple"
                      onClick={(e) => handleCardClick(repo, e)}
                    />
                  ))}
                </div>
                {watchedData.organizations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    暂无 AI 相关项目
                  </div>
                )}
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">热门开发者</h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">({developers.length} 位开发者)</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {developers.map(dev => (
                    <a
                      key={dev}
                      href={`https://github.com/${dev}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                    >
                      {dev}
                    </a>
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {watchedData.developers.map(repo => (
                    <RepoCard
                      key={repo.id}
                      repo={repo}
                      badge={repo._source}
                      badgeColor="emerald"
                      onClick={(e) => handleCardClick(repo, e)}
                    />
                  ))}
                </div>
                {watchedData.developers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    暂无 AI 相关项目
                  </div>
                )}
              </section>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <SummaryModal
        repo={summaryRepo}
        open={summaryOpen}
        onOpenChange={setSummaryOpen}
      />
    </div>
  );
}
