export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-gray-500 dark:text-gray-400">加载中...</p>
    </div>
  );
}
