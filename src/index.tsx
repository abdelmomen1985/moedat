import React from 'react';
import './index.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { registerServiceWorker } from './utils/serviceWorkerRegistration';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
// Register service worker for PWA support
// Note: The actual sw.js file must be placed in the public/ directory
registerServiceWorker({
  onSuccess: (registration) => {
    console.log('[Almoedat] App is ready for offline use');
  },
  onUpdate: (registration) => {
    console.log('[Almoedat] New version available');
    // Dispatch custom event for UpdatePrompt component
    window.dispatchEvent(
      new CustomEvent('sw-update-available', {
        detail: registration
      })
    );
  },
  onError: (error) => {
    console.log(
      '[Almoedat] SW registration failed (expected in dev):',
      error.message
    );
  }
});