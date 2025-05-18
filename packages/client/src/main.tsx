import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'
import { createLogger } from './lib/logger'
import { ErrorBoundary } from './components/features/error-ui/ErrorBoundary'
import { PGliteErrorBoundary } from './components/features/pglite/PGliteErrorBoundary'
import { PGliteProvider } from './components/features/pglite/PGliteProvider'

// Create logger for the main entry point
const logger = createLogger('Main')

// Create a new React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds
      refetchOnWindowFocus: false
    }
  }
})

// Wrap the app with all required providers
const root = document.getElementById('root')

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          {/* PGlite error boundary handles database initialization */}
          <PGliteErrorBoundary>
            {/* PGliteProvider makes the DB available to child components */}
            <PGliteProvider>
              <App />
            </PGliteProvider>
          </PGliteErrorBoundary>
        </QueryClientProvider>
      </ErrorBoundary>
    </React.StrictMode>
  )
} else {
  logger.error('Root element not found')
}
