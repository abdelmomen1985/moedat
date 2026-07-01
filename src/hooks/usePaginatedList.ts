import { useState } from 'react';

export function usePaginatedList<T>(items: T[], pageSize = 8) {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  const loadMore = () => setVisibleCount((count) => count + pageSize);

  return { visibleItems, hasMore, loadMore };
}
