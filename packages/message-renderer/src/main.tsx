import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// This file is for development only and is not included in the library build
const rootElement = document.getElementById('root')

if (!rootElement) {
  const div = document.createElement('div')
  div.id = 'root'
  document.body.appendChild(div)
}

createRoot(rootElement || document.getElementById('root')!).render(
  <StrictMode>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <App />
    </div>
  </StrictMode>,
)
