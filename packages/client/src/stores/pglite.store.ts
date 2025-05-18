import { create } from 'zustand'
import { PGlite } from '@electric-sql/pglite'
import { electricSync } from '@electric-sql/pglite-sync'
import { live } from '@electric-sql/pglite/live'
import type { PGliteWithExtensions } from '../types/electric'
import { createLogger } from '../lib/logger'

// Create a logger instance for the PGlite store
const logger = createLogger('PGlite')

// Connect to electric - use environment variable or fallback to default
const ELECTRIC_URL = import.meta.env.VITE_ELECTRIC_URL
logger.info('Using Electric URL:', ELECTRIC_URL)

// Simplified PGlite configuration - reduced complexity
const PGLITE_CONFIG = {
  dataDir: 'idb://electric-stack-db-v2', // New DB name to avoid corruption
  // Include both required extensions
  extensions: {
    live: live,
    electric: electricSync()
  }
}

// Core store state
interface PGliteState {
  db: PGliteWithExtensions | null
  isInitialized: boolean
  isInitializing: boolean
  isSyncing: boolean
  syncState: {
    isInitialSyncComplete: boolean
    unsubscribe: (() => Promise<void>) | null
  }
  error: Error | null
  serverUrl: string
  initializeDB: () => Promise<void>
  startSync: () => Promise<void>
  stopSync: () => Promise<void>
  resetDB: () => Promise<void>
}

// Global variable to track sync attempts and prevent concurrent operations
let syncInProgress = false
let syncTimeout: ReturnType<typeof setTimeout> | null = null

export const usePGliteStore = create<PGliteState>((set, get) => ({
  db: null,
  isInitialized: false,
  isInitializing: false,
  isSyncing: false,
  syncState: {
    isInitialSyncComplete: false,
    unsubscribe: null
  },
  error: null,
  serverUrl: `${ELECTRIC_URL}/v1/shape`,

  initializeDB: async () => {
    const { isInitialized, isInitializing } = get()
    if (isInitialized || isInitializing) {
      logger.debug('PGlite already initialized or initializing, skipping initialization')
      return
    }

    set({ isInitializing: true, error: null })
    logger.info('Starting PGlite initialization')

    try {
      // First, clear local storage to prevent corruption
      try {
        await get().resetDB()
        logger.info('Successfully reset database before initialization')
      } catch (resetError) {
        logger.warn('Failed to reset database, continuing with initialization', resetError)
      }

      // Simplified initialization - single approach with timeout
      logger.info('Initializing PGlite database')

      // Add a small delay to ensure all resources are ready
      await new Promise(resolve => setTimeout(resolve, 500))

      // Use the simpler create method only - not multiple approaches
      const db = await PGlite.create(PGLITE_CONFIG) as unknown as PGliteWithExtensions

      logger.info('PGlite database object created successfully')

      // Create schema
      logger.info('Creating database schema')
      try {
        await db.transaction(async (tx) => {
          // Create blogs table
          await tx.exec(`
            CREATE TABLE IF NOT EXISTS blogs (
              id TEXT PRIMARY KEY,
              title TEXT NOT NULL,
              content TEXT NOT NULL,
              published BOOLEAN DEFAULT false,
              author_id INTEGER NOT NULL,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            );
          `)

          // Create comments table
          await tx.exec(`
            CREATE TABLE IF NOT EXISTS comments (
              id TEXT PRIMARY KEY,
              content TEXT NOT NULL,
              blog_id TEXT NOT NULL,
              author_id INTEGER NOT NULL,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL,
              FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE
            );
          `)

          // Create necessary indexes
          await tx.exec('CREATE INDEX IF NOT EXISTS idx_comments_blog_id ON comments(blog_id);')
          await tx.exec('CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);')
        })
      } catch (schemaError) {
        logger.error('Error creating schema:', schemaError)
        // Continue anyway, tables might already exist
      }

      set({
        db,
        isInitialized: true,
        isInitializing: false,
        error: null
      })

      logger.info('PGlite database initialized successfully')

      // Delay sync start to ensure initialization is complete
      setTimeout(async () => {
        const { startSync } = get()
        try {
          await startSync()
        } catch (syncError) {
          logger.error('Error starting sync after init:', syncError)
          // Don't fail initialization if sync fails
        }
      }, 1000)

    } catch (error) {
      const err = error as Error
      logger.error('PGlite initialization failed:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      })

      set({
        isInitializing: false,
        error: error instanceof Error ? error : new Error('PGlite initialization failed')
      })
    }
  },

  startSync: async () => {
    const { db, isInitialized, isSyncing, serverUrl } = get()

    if (!db || !isInitialized || isSyncing) {
      logger.debug('Skipping sync - conditions not met:', {
        hasDb: !!db,
        isInitialized,
        isSyncing
      })
      return
    }

    // Prevent concurrent sync operations
    if (syncInProgress) {
      logger.warn('Sync already in progress, skipping duplicate request')
      return
    }

    syncInProgress = true
    set({ isSyncing: true })
    logger.info('Starting sync with ElectricSQL')

    try {
      // Define sync shapes with safe error handling
      const shapes = {
        blogs: {
          shape: { url: serverUrl, params: { table: 'blogs' } },
          table: 'blogs',
          primaryKey: ['id']
        },
        comments: {
          shape: { url: serverUrl, params: { table: 'comments' } },
          table: 'comments',
          primaryKey: ['id']
        }
      }

      // Clear any existing timeout
      if (syncTimeout) {
        clearTimeout(syncTimeout)
        syncTimeout = null
      }

      // Add a timeout safety to make sure initial sync completes
      syncTimeout = setTimeout(() => {
        // If after 10 seconds sync hasn't completed, manually set it as complete
        if (get().isSyncing && !get().syncState.isInitialSyncComplete) {
          logger.warn('Sync timeout reached - forcing sync completion state')

          try {
            set(state => ({
              syncState: {
                ...state.syncState,
                isInitialSyncComplete: true
              }
            }))
          } catch (setError) {
            logger.error('Error updating sync state:', setError)
          }

          syncInProgress = false
        }
      }, 10000)

      // Start sync with improved error handling
      const syncResult = await db.electric.syncShapesToTables({
        shapes,
        key: 'electric-app-sync',
        onInitialSync: () => {
          try {
            logger.info('Initial sync completed')
            logger.info('Sync data received, updating UI state')

            // Clear the timeout since we don't need it anymore
            if (syncTimeout) {
              clearTimeout(syncTimeout)
              syncTimeout = null
            }

            // Mark sync as complete in state
            set(state => ({
              syncState: {
                ...state.syncState,
                isInitialSyncComplete: true
              }
            }))

            syncInProgress = false

            // Now try to debug by logging that we've completed the state update
            logger.info('State updated: isInitialSyncComplete = true')
          } catch (callbackError) {
            logger.error('Error in onInitialSync callback:', callbackError)
            syncInProgress = false
          }
        }
      }).catch(syncError => {
        logger.error('Error during syncShapesToTables:', syncError)
        syncInProgress = false
        // Return a dummy sync result with an empty unsubscribe function
        return {
          unsubscribe: async () => {
            logger.info('Called dummy unsubscribe function')
          }
        }
      })

      // Safely update state with unsubscribe function
      try {
        set(state => ({
          syncState: {
            ...state.syncState,
            unsubscribe: syncResult.unsubscribe
          }
        }))
      } catch (setError) {
        logger.error('Error updating syncState:', setError)
      }

      logger.info('ElectricSQL sync started successfully')
    } catch (error) {
      const err = error as Error
      logger.error('Sync failed:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      })

      // Ensure syncInProgress is reset
      syncInProgress = false

      // Clear any existing timeout
      if (syncTimeout) {
        clearTimeout(syncTimeout)
        syncTimeout = null
      }

      set({
        isSyncing: false,
        error: error instanceof Error ? error : new Error('Sync failed')
      })
    }
  },

  stopSync: async () => {
    const { syncState } = get()

    // Clear any pending sync timeout
    if (syncTimeout) {
      clearTimeout(syncTimeout)
      syncTimeout = null
    }

    // Reset the sync flag
    syncInProgress = false

    if (syncState.unsubscribe) {
      try {
        logger.info('Stopping ElectricSQL sync')
        await syncState.unsubscribe()
        logger.info('ElectricSQL sync stopped successfully')
      } catch (error) {
        const err = error as Error
        logger.error('Error stopping sync:', {
          name: err.name,
          message: err.message,
          stack: err.stack
        })
      }

      set({
        isSyncing: false,
        syncState: {
          isInitialSyncComplete: false,
          unsubscribe: null
        }
      })
    } else {
      logger.debug('No active sync to stop')
    }
  },

  // Reset database to clean state
  resetDB: async () => {
    logger.info('Resetting PGlite database')
    const { db, stopSync } = get()

    // Reset sync state
    syncInProgress = false
    if (syncTimeout) {
      clearTimeout(syncTimeout)
      syncTimeout = null
    }

    // Stop syncing first if active
    if (get().isSyncing) {
      logger.info('Stopping sync before reset')
      await stopSync()
    }

    // Close the existing connection if it exists
    if (db) {
      try {
        logger.info('Closing existing database connection')
        if (typeof db.close === 'function') {
          await db.close()
          logger.debug('Database connection closed successfully')
        }
      } catch (err) {
        logger.error('Error closing database:', err)
      }
    }

    // Reset the store state
    set({
      db: null,
      isInitialized: false,
      isInitializing: false,
      error: null
    })

    // Clear IndexedDB storage
    try {
      const dbNames = ['electric-stack-db', 'electric-stack-db-v2']

      for (const dbName of dbNames) {
        logger.info(`Attempting to delete IndexedDB database: ${dbName}`)
        await new Promise<void>((resolve, reject) => {
          const req = indexedDB.deleteDatabase(dbName)
          req.onsuccess = () => resolve()
          req.onerror = () => reject(new Error(`Failed to delete database ${dbName}`))
        })
      }

      logger.info('Successfully deleted IndexedDB storage')
    } catch (err) {
      logger.error('Error deleting database:', err)
    }
  }
}))
