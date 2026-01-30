const getHealthUrl = () => {
  const baseUrl = process.env.WALLET_APP_API_URL || '';
  const trimmed = baseUrl.replace(/\/+$/, '');
  const healthUrl = `${trimmed}/api/health`;
  console.log('Health check URL:', healthUrl);
  return healthUrl;
};

export const showMaintenancePage = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.warn('Root element not found');
    return;
  }

  console.log('Displaying maintenance page...');
  
  rootElement.innerHTML = `
    <div style="text-align:center;padding-top:60px;font-family:Arial;background-color:#ffffff;min-height:100vh;">
      <h1 style="color:#333;font-size:2em;margin-bottom:20px;">🚧 Maintenance in progress</h1>
      <p style="color:#666;font-size:1.2em;">Our backend services are temporarily unavailable.</p>
      <p style="color:#999;font-size:0.9em;margin-top:40px;">Please refresh the page to try again.</p>
    </div>
  `;
  
  console.log('Maintenance page displayed');
};

export const checkBackendHealth = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const healthUrl = getHealthUrl();
    if (!healthUrl || healthUrl === '/api/health') {
      console.warn('WALLET_APP_API_URL environment variable is not set');
      return false;
    }
    
    console.log('Checking backend health...');
    const response = await fetch(healthUrl, { signal: controller.signal });
    
    if (!response.ok) {
      console.warn(`Health check failed with status: ${response.status}`);
      return false;
    }
    
    const text = await response.text();
    console.log('Health check response:', text);
    
    if (text.trim().toUpperCase() !== 'OK') {
      console.warn('Health check returned unexpected response:', text);
      return false;
    }
    
    console.log('Backend is healthy');
    return true;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('Health check timed out after 3 seconds - backend may be unavailable');
    } else {
      console.warn('Health check failed:', error.message);
    }
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
};
