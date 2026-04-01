'use client';

import { Github, RefreshCw, Clock, Settings } from 'lucide-react';

interface HeaderProps {
  lastUpdate: Date | null;
  autoRefresh: boolean;
  onAutoRefreshChange: (value: boolean) => void;
  onRefresh: () => void;
}

export function Header({ lastUpdate, autoRefresh, onAutoRefreshChange, onRefresh }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-900 dark:bg-white rounded-lg">
              <Github className="w-6 h-6 text-white dark:text-gray-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                GitHub Monitor
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                AI · Agent · Claw · Skill · 智能体
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {lastUpdate && (
              <div className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>更新于 {lastUpdate.toLocaleTimeString('zh-CN')}</span>
              </div>
            )}

            <button
              onClick={onRefresh}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="刷新"
            >
              <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => onAutoRefreshChange(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 relative"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">自动刷新</span>
            </label>
          </div>
        </div>
      </div>
    </header>
  );
}
