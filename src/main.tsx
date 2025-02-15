// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { PageProvider } from './hooks/usePage'
import { AuthProvider } from './hooks/useAuth';
import { ConfigProvider } from './hooks/useConfig';

// Disable default zoom shortcuts (Ctrl++, Ctrl--, Ctrl+=)
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=')) {
    e.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <ConfigProvider>

  <AuthProvider>
    <PageProvider>
      <App />
    </PageProvider>
  </AuthProvider>
  </ConfigProvider>
  // </React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
