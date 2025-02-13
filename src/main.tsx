import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Disable default zoom shortcuts (Ctrl++, Ctrl--, Ctrl+=)
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=')) {
    e.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <App />
  // {/* </React.StrictMode>, */}
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
