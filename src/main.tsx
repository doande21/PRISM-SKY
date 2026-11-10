import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure any stale mobile service workers or CacheStorage from previous builds are purged
if (typeof window !== 'undefined') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
  }
  if ('caches' in window) {
    caches.keys().then(keys => {
      keys.forEach(key => caches.delete(key));
    });
  }
}

createRoot(document.getElementById('root')!).render(<App />);
