import { Star, GitFork, Clock, ExternalLink } from 'lucide-react';
import type { Repository } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface RepoCardProps {
  repo: Repository;
  badge?: string;
  badgeColor?: 'blue' | 'purple' | 'emerald';
  onClick?: (e: React.MouseEvent) => void;
}

const badgeColors = {
  blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
  purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' },
};

export function RepoCard({ repo, badge, badgeColor = 'blue', onClick }: RepoCardProps) {
  const timeAgo = formatDistanceToNow(new Date(repo.created_at), {
    addSuffix: true,
    locale: zhCN,
  });

  const colors = badgeColors[badgeColor];

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className="block group cursor-pointer"
    >
      <div className="h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-200 relative">
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
          <span className="text-xs text-gray-400 dark:text-gray-500">点击 AI 总结</span>
          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
        </div>

        <div className="flex items-start justify-between mb-3 pr-20">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <img
              src={repo.owner.avatar_url}
              alt={repo.owner.login}
              className="w-8 h-8 rounded-full flex-shrink-0"
            />
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {repo.full_name}
              </h3>
            </div>
          </div>
        </div>

        {repo.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {repo.description}
          </p>
        )}

        <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
          {repo.language && (
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            {repo.stargazers_count.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="w-4 h-4" />
            {repo.forks_count.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 pt-3 border-t border-gray-100 dark:border-gray-800">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            创建于 {timeAgo}
          </span>
          <div className="flex gap-1">
            {badge && (
              <span className={`px-2 py-0.5 ${colors.bg} ${colors.text} rounded text-xs font-medium`}>
                {badge}
              </span>
            )}
            {repo.matched_keywords && repo.matched_keywords.length > 0 && (
              <>
                {repo.matched_keywords.slice(0, 3).map(kw => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs"
                  >
                    {kw}
                  </span>
                ))}
              </>
            )}
          </div>
        </div>

        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {repo.topics.slice(0, 5).map(topic => (
              <span
                key={topic}
                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
