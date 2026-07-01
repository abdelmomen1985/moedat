/**
 * Service Worker Registration for Almoedat PWA
 *
 * This registers the service worker if the browser supports it.
 * The actual sw.js file must be placed in the public/ directory.
 */

type SWConfig = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
};

export function registerServiceWorker(config?: SWConfig) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = '/sw.js';

      navigator.serviceWorker.
      register(swUrl).
      then((registration) => {
        console.log(
          '[SW] Service Worker registered with scope:',
          registration.scope
        );

        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New content is available; notify user
                console.log('[SW] New content available; please refresh.');
                config?.onUpdate?.(registration);
              } else {
                // Content is cached for offline use
                console.log('[SW] Content is cached for offline use.');
                config?.onSuccess?.(registration);
              }
            }
          };
        };
      }).
      catch((error) => {
        console.error('[SW] Service Worker registration failed:', error);
        config?.onError?.(error);
      });
    });
  }
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.
    then((registration) => {
      registration.unregister();
    }).
    catch((error) => {
      console.error('[SW] Unregister error:', error);
    });
  }
}