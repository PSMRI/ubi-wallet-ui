import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { checkBackendHealth, showMaintenancePage } from './utils/healthCheck';

const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(new URL('./../public/sw.js', import.meta.url))
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  }
};

const renderApp = () => {
  const container = document.getElementById('root');
  const root = createRoot(container);
  
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
  
  // Register service worker after app renders successfully
  registerServiceWorker();
};

// Initialize app with health check
(async () => {
  const isHealthy = await checkBackendHealth();
  
  if (isHealthy) {
    renderApp();
  } else {
    showMaintenancePage();
  }
})();