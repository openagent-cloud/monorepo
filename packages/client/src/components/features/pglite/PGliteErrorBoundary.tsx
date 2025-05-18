import React, { useEffect, useState, useRef } from 'react'
import { ErrorDisplay } from '@/components/features/error-ui/ErrorDisplay'
import { usePGliteInitialization } from '@/lib/hooks/usePGliteInitialization'
import { createLogger } from '@/lib/logger'
import { PreLoader } from '../fancy-preloader/PreLoader'
import { usePGliteStore } from '@/stores/pglite.store'

const logger = createLogger('PGliteErrorBoundary')

type PGliteErrorBoundaryProps = {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * A specialized boundary for handling PGlite database errors
 * Uses React Query under the hood for retries and state management
 */
export function PGliteErrorBoundary({ children, fallback }: PGliteErrorBoundaryProps) {
  const [loading, setLoading] = useState(true)
  const [initAttempts, setInitAttempts] = useState(0)
  const maxAttempts = 2

  const { initialize, error, isError, retry } = usePGliteInitialization()
  const resetDB = usePGliteStore(state => state.resetDB)
  const initAttemptedRef = useRef(false)

  const [loadingSteps] = useState([
    { id: 'db', label: 'Initializing database', isComplete: false }
  ])

  useEffect(() => {
    // Only initialize once and track with a ref to prevent multiple initialization attempts
    const initDb = async () => {
      if (initAttemptedRef.current) return

      initAttemptedRef.current = true
      setLoading(true)

      try {
        // First, let's clear any potentially corrupted databases
        if (initAttempts > 0) {
          logger.info(`Attempt ${initAttempts + 1}: Clearing DB before initialization`)
          try {
            await resetDB()
            await new Promise(resolve => setTimeout(resolve, 1000)) // Wait for cleanup
          } catch (err) {
            logger.warn('Failed to reset database, continuing anyway', err)
          }
        }

        // Now initialize
        logger.info(`Starting database initialization (attempt ${initAttempts + 1})`)
        await initialize()
        logger.info('Database initialization successful')
        setLoading(false)
      } catch (err) {
        logger.error('Database initialization failed with error:', err)

        // If we haven't reached max attempts, try again
        if (initAttempts < maxAttempts) {
          logger.info(`Will retry initialization (attempt ${initAttempts + 1} of ${maxAttempts})`)
          initAttemptedRef.current = false
          setInitAttempts(prev => prev + 1)
        } else {
          logger.error(`Failed after ${maxAttempts} attempts, giving up`)
          setLoading(false)
        }
      }
    }

    initDb()
  }, [initialize, initAttempts, resetDB])

  // While loading, show a spinner or custom loading UI
  if (loading) {
    return (
      <PreLoader
        steps={loadingSteps}
        isComplete={false}
      />
    )
  }

  // If there's an error, show the error display
  if (isError) {
    // Use custom fallback if provided
    if (fallback) {
      return <>{fallback}</>
    }

    // Otherwise use the default error display
    const errorInstance = error instanceof Error
      ? error
      : new Error('Database initialization failed: ' +
        (typeof error === 'object' && error !== null ?
          JSON.stringify(error) : 'Unknown error'))

    return (
      <ErrorDisplay
        error={errorInstance}
        reset={() => {
          // Reset the init status on retry
          initAttemptedRef.current = false
          setLoading(true)
          setInitAttempts(0)
          retry()
        }}
      />
    )
  }

  // No error, render children
  return <>{children}</>
} 