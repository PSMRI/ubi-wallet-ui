import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const API_URL = import.meta.env.WALLET_APP_API_URL;
const HEALTH_URL = `${API_URL}/health`;

async function checkBackend() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    await fetch(HEALTH_URL, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal
    });
    clearTimeout(timeout);
    startApp();
  } catch (err) {
    // ✅ Parcel-trackable redirect
    window.location.replace(
      new URL('../public/maintenance.html', import.meta.url)
    );
  }
}

function startApp() {
  const container = document.getElementById('root');
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );

  // ✅ Parcel-compatible Service Worker registration
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register(new URL('../public/sw.js', import.meta.url))
      .then(() => console.log('Service Worker registered'))
      .catch(err => console.error('SW failed', err));
  }
}

checkBackend();
