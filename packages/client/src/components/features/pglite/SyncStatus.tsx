import { useMemo } from 'react'
import { usePGliteStore } from '../../../stores/pglite.store'
import { createLogger } from '../../../lib/logger'

const logger = createLogger('SyncStatus')

/**
 * A component that displays the current sync status and provides controls
 * for starting and stopping synchronization
 */
export function SyncStatus() {
  const { isSyncing, syncState, error } = usePGliteStore()

  // Determine the current sync status and appropriate UI elements
  const { statusText, statusColor, icon } = useMemo(() => {
    if (error) {
      logger.error('Sync error:', error)
      return {
        statusText: 'Sync Error',
        statusColor: 'text-red-500 bg-red-50 border-red-200',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      }
    }

    if (syncState.isInitialSyncComplete) {
      return {
        statusText: 'Synced',
        statusColor: 'text-green-500 bg-green-50 border-green-200',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      }
    }

    if (isSyncing) {
      return {
        statusText: 'Syncing...',
        statusColor: 'text-blue-500 bg-blue-50 border-blue-200',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )
      }
    }

    return {
      statusText: 'Offline',
      statusColor: 'text-gray-500 bg-gray-50 border-gray-200',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      )
    }
  }, [isSyncing, syncState.isInitialSyncComplete, error])

  return (
    <div className={`px-3 py-1 rounded-full border flex items-center space-x-1.5 ${statusColor}`}>
      {icon}
      <span className="text-xs font-medium">{statusText}</span>
    </div>
  )
} 