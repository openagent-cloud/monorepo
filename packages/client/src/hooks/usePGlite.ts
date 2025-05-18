import { useEffect } from 'react'
import { PGlite } from '@electric-sql/pglite'
import { usePGliteStore } from '../stores/pglite.store'

export interface UsePGliteOptions {
  autoSync?: boolean
  syncDelay?: number
}

export function usePGlite(options: UsePGliteOptions = {}): {
  db: PGlite | null
  isInitialized: boolean
  isInitializing: boolean
  isSyncing: boolean
  isInitialSyncComplete: boolean
  error: Error | null
  serverUrl: string
  setServerUrl: (url: string) => void
  startSync: () => Promise<void>
  stopSync: () => Promise<void>
} {
  const {
    db,
    isInitialized,
    isInitializing,
    isSyncing,
    syncState,
    error,
    serverUrl,
    initializeDB,
    startSync,
    stopSync,
    setServerUrl
  } = usePGliteStore()

  const { autoSync = true, syncDelay = 500 } = options

  // Initialize the database when the hook is first used
  useEffect(() => {
    if (!isInitialized && !isInitializing) {
      initializeDB()
    }
  }, [isInitialized, isInitializing, initializeDB])

  // Start sync after initialization if autoSync is enabled
  useEffect(() => {
    if (autoSync && isInitialized && !isSyncing && db) {
      const timer = setTimeout(() => {
        startSync()
      }, syncDelay)

      return () => clearTimeout(timer)
    }
  }, [autoSync, isInitialized, isSyncing, db, startSync, syncDelay])

  // Clean up sync on unmount
  useEffect(() => {
    return () => {
      if (isSyncing) {
        stopSync()
      }
    }
  }, [isSyncing, stopSync])

  return {
    db,
    isInitialized,
    isInitializing,
    isSyncing,
    isInitialSyncComplete: syncState.isInitialSyncComplete,
    error,
    serverUrl,
    setServerUrl,
    startSync,
    stopSync
  }
} 