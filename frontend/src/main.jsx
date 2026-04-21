import { createRoot } from 'react-dom/client'

async function init() {
  console.log('init: starting');
  try {
    console.log('init: importing index.css');
    await import('./index.css');
    
    console.log('init: importing App.jsx');
    const { default: App } = await import('./App.jsx');
    
    console.log('init: importing StrictMode');
    const { StrictMode } = await import('react');

    const rootElement = document.getElementById('root');
    if (!rootElement) throw new Error('Root element not found');

    console.log('init: rendering');
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log('init: render called');
  } catch (error) {
    console.error('Captured early init/render error:', error);
    document.body.innerHTML = `
      <div style="color: red; padding: 20px; font-family: sans-serif;">
        <h1 style="color: darkred;">Critical Initialization Error</h1>
        <p><strong>Message:</strong> ${error.message}</p>
        <pre style="background: #fee; padding: 10px; border: 1px solid #fcc; overflow: auto;">${error.stack}</pre>
      </div>
    `;
  }
}

init();
