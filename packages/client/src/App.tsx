import { useEffect, useState } from 'react'
import { BlogList } from './components/features/blogs/BlogList'
import { CreateBlogForm } from './components/features/blogs/CreateBlogForm'
import { CreateCommentForm } from './components/features/blogs/CreateCommentForm'
import { usePGliteStore } from './stores/pglite.store'
import { SyncStatus } from './components/features/pglite/SyncStatus'
import { createLogger } from './lib/logger'
import { PreLoader } from './components/features/fancy-preloader/PreLoader'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ZustandExplorerModal } from '@/components/features/zustand-explorer/ZustandExplorerModal'
import './index.css'

// Create a logger for the App component
const logger = createLogger('App')

export default function App() {
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null)
  const [loadingSteps, setLoadingSteps] = useState([
    { id: 'db', label: 'Initializing database', isComplete: false },
    { id: 'schema', label: 'Setting up schema', isComplete: false },
    { id: 'sync', label: 'Syncing with server', isComplete: false }
  ])
  const [isAppReady, setIsAppReady] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [showSyncToast, setShowSyncToast] = useState(false)

  const {
    initializeDB,
    error: storeError,
    syncState,
    isSyncing,
  } = usePGliteStore()

  // Initialize the database
  useEffect(() => {
    const initialize = async () => {
      try {
        // Step 1: Initialize DB if needed
        await initializeDB()
        // Update loading step for database
        setLoadingSteps(steps =>
          steps.map(step => step.id === 'db' ? { ...step, isComplete: true } : step)
        )
        // Update loading step for schema
        setLoadingSteps(steps =>
          steps.map(step => step.id === 'schema' ? { ...step, isComplete: true } : step)
        )
      } catch (err) {
        logger.error('Failed to initialize:', err)
        setError(err instanceof Error ? err : new Error('Initialization failed'))
      }
    }
    initialize()
  }, [initializeDB])

  // Monitor sync state
  useEffect(() => {
    // Log the sync state change for debugging
    logger.info(`Sync state change - isInitialSyncComplete: ${syncState.isInitialSyncComplete}, isSyncing: ${isSyncing}`)

    if (syncState.isInitialSyncComplete) {
      // Update loading step for sync
      setLoadingSteps(steps =>
        steps.map(step => step.id === 'sync' ? { ...step, isComplete: true } : step)
      )

      // Set app as ready
      setIsAppReady(true)

      // Show sync toast
      setShowSyncToast(true)

      logger.info('Initial sync complete, application ready')
    } else if (isSyncing) {
      // Update the sync step status to show it's in progress but not complete
      logger.info('Sync in progress...')

      // Ensure previous steps are marked as complete
      setLoadingSteps(steps =>
        steps.map(step =>
          step.id === 'sync'
            ? { ...step, isComplete: false }
            : { ...step, isComplete: true }
        )
      )
    }
  }, [syncState.isInitialSyncComplete, isSyncing])

  // Handle store errors
  useEffect(() => {
    if (storeError) {
      setError(storeError)
    }
  }, [storeError])

  useEffect(() => {
    // Set timeout to auto-dismiss the sync success toast after 5 seconds
    if (showSyncToast) {
      const timer = setTimeout(() => {
        setShowSyncToast(false)
      }, 5000) // 5 seconds

      return () => clearTimeout(timer)
    }
  }, [showSyncToast])

  const handleRetry = () => {
    window.location.reload()
  }

  if (!isAppReady || error) {
    return (
      <PreLoader
        steps={loadingSteps}
        isComplete={isAppReady}
        error={error}
        onRetry={handleRetry}
      />
    )
  }

  return (
    <>
      {/* Success toast when sync completes */}
      {showSyncToast ? (
        <Alert
          className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 max-w-md shadow-lg"
          onClick={() => setShowSyncToast(false)}
        >
          <AlertTitle className="text-green-600 dark:text-green-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Success
          </AlertTitle>
          <AlertDescription className="text-sm text-gray-700 dark:text-gray-300">
            Your local-first database is ready and synced!
          </AlertDescription>
        </Alert>
      ) : null}
      <div className="bg-gray-50 min-h-screen">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Electric Blog</h1>
                <p className="text-sm text-gray-500">Local-first blog powered by ElectricSQL</p>
                <div className="mt-2 flex items-center space-x-2">
                  <SyncStatus />
                  <span className="text-xs text-gray-400">
                    {syncState.isInitialSyncComplete ? 'Changes sync automatically' : 'Waiting for sync...'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">Tech Stack Demo:</div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">
                    ↓ Postgres → Electric → React
                  </div>
                  <div className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs">
                    ↑ React → NestJS → Postgres
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <ZustandExplorerModal />

        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <BlogList
                onSelectBlog={setSelectedBlogId}
                selectedBlogId={selectedBlogId}
              />
            </div>

            <div className="space-y-6">
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Create New Post</h2>
                  <div className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded">
                    ↑ API Write
                  </div>
                </div>
                <CreateBlogForm />
              </div>

              {selectedBlogId && (
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Add Comment</h2>
                    <div className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded">
                      ↑ API Write
                    </div>
                  </div>
                  <CreateCommentForm blogId={selectedBlogId} />
                </div>
              )}

              <div className="bg-white p-5 rounded-lg shadow-sm border-t-4 border-blue-500">
                <h3 className="font-semibold mb-2">Local-First Architecture</h3>
                <ul className="text-sm space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">⟳</span>
                    <span>Changes sync bidirectionally between client and server</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">📱</span>
                    <span>Data available offline in local PGlite database</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">⚡</span>
                    <span>Reading is ultra-fast from local database</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">🔄</span>
                    <span>Writing goes through REST API to ensure consistency</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
