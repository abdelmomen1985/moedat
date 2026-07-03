import { useEffect } from 'react';

/**
 * Set the browser tab title. Automatically prepends the site name
 * and restores the previous title on unmount.
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = `${title} | المعدات`;
    return () => { document.title = prev; };
  }, [title]);
}
