import React, { useEffect, useState } from 'react'
import { PGliteProvider as ElectricPGliteProvider } from '@electric-sql/pglite-react'
import { usePGliteStore } from '@/stores/pglite.store'
import { createLogger } from '@/lib/logger'

const logger = createLogger('PGliteProvider')

type PGliteProviderProps = {
  children: React.ReactNode
}

/**
 * Wrapper component to provide the PGlite database instance to the application
 * through React context, enabling hooks like useLiveQuery to work
 */
export function PGliteProvider({ children }: PGliteProviderProps) {
  const { db, isInitialized } = usePGliteStore()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (isInitialized && db) {
      logger.info('PGlite database initialized, making provider ready')
      setIsReady(true)
    }
  }, [db, isInitialized])

  // If the database isn't ready yet, don't render anything that would
  // try to use it. The PGliteErrorBoundary will handle showing a loader.
  if (!isReady || !db) {
    return null
  }

  // Bypass TypeScript's type checking for the ElectricPGliteProvider
  // This is necessary because there's a mismatch between our PGlite type and what the provider expects
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ProviderComponent = ElectricPGliteProvider as any

  return (
    <ProviderComponent db={db}>
      {children}
    </ProviderComponent>
  )
} 