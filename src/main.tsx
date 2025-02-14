// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { PageProvider } from './hooks/usePage'

// Disable default zoom shortcuts (Ctrl++, Ctrl--, Ctrl+=)
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=')) {
    e.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <PageProvider>
      <App />
    </PageProvider>
  // </React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
