import { useMutation } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { usePGliteStore } from '@/stores/pglite.store'
import { createLogger } from '@/lib/logger'

const logger = createLogger('usePGliteInit')

/**
 * Hook for initializing and managing PGliteDB with TanStack Query
 */
export function usePGliteInitialization() {
  const [internalError, setInternalError] = useState<Error | null>(null)

  // Mutation for initializing the database
  const initMutation = useMutation({
    mutationFn: async () => {
      logger.info('Starting PGlite initialization via mutation')
      const { initializeDB } = usePGliteStore.getState()

      try {
        // Add small delay before initialization to ensure clean state
        await new Promise(resolve => setTimeout(resolve, 100))
        await initializeDB()
        return usePGliteStore.getState()
      } catch (err) {
        logger.error('Mutation error during initialization:', err)
        const error = err instanceof Error ? err : new Error('Unknown initialization error')
        setInternalError(error)
        throw error
      }
    },
    retry: 1, // Only retry once automatically
    retryDelay: 1000, // Wait 1 second between retries
    onError: (error) => {
      logger.error('Failed to initialize PGlite:', error)
      setInternalError(error instanceof Error ? error : new Error(String(error)))
    }
  })

  // Function to initialize the database - memoized to prevent rerenders
  const initialize = useCallback(async () => {
    try {
      // Clear any previous errors
      setInternalError(null)

      // Run the mutation to initialize
      logger.info('Starting initialization')
      const result = await initMutation.mutateAsync()
      logger.info('Initialization completed successfully')

      return result
    } catch (error) {
      logger.error('Error in initialize function:', error)
      const errorObj = error instanceof Error ? error : new Error('Unknown error during initialization')
      setInternalError(errorObj)
      throw errorObj
    }
  }, [initMutation.mutateAsync])

  return {
    initialize,
    db: usePGliteStore.getState().db,
    error: internalError || initMutation.error || usePGliteStore.getState().error,
    isInitializing: initMutation.isPending,
    isError: !!internalError || initMutation.isError || !!usePGliteStore.getState().error,
    isSuccess: initMutation.isSuccess && !internalError && usePGliteStore.getState().db !== null,
    retry: initialize
  }
} 