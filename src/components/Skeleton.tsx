export function SkeletonCard() {
  return (
    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-6 animate-pulse">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-3"></div>
      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-2"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-48 mb-4"></div>
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  );
}

export function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

