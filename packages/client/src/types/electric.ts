import { PGlite } from '@electric-sql/pglite'

// Definition for live query options
export interface LiveQueryOptions<T> {
  db: PGliteWithExtensions
  enabled?: boolean
  onSuccess?: (data: T[]) => void
  onError?: (error: Error) => void
}

// Definition for what LiveQuery returns
export interface LiveQueryResults<T> extends Array<T> {
  fields: { name: string; dataTypeID: number }[]
  unsubscribe: () => Promise<void>
  refresh: () => Promise<void>
}

// Shape configuration interface
export interface ElectricShape {
  shape: {
    url: string
    params?: Record<string, unknown>
  }
  table: string
  primaryKey: string[]
}

// Type for the result of sync operations
export interface SyncShapeToTableResult {
  unsubscribe: () => Promise<void>
}

// Type for sync options
export interface SyncShapeToTableOptions {
  shape: {
    url: string
    params?: Record<string, unknown>
  }
  table: string
  primaryKey: string[]
  shapeKey?: string
}

// Type for syncing multiple shapes
export interface SyncShapesToTablesOptions {
  shapes: Record<string, ElectricShape>
  key: string
  onInitialSync?: () => void
  useCopy?: boolean
  initialInsertMethod?: string
}

// Define the Electric extension namespace
export interface ElectricNamespace {
  // Metadata initialization
  initMetadataTables: () => Promise<void>

  // For single table sync
  syncShapeToTable: (options: SyncShapeToTableOptions) => Promise<SyncShapeToTableResult>

  // For multi-table sync
  syncShapesToTables: (config: SyncShapesToTablesOptions) => Promise<{ unsubscribe: () => Promise<void> }>

  // For unsubscribing
  deleteSubscription: (key: string) => Promise<void>
}

// Define the Live extension namespace
export interface LiveNamespace {
  query: <T>(
    sql: string,
    params?: unknown[],
    options?: LiveQueryOptions<T>
  ) => LiveQueryResults<T>
  // Required by electric-sql/pglite-react
  changes: unknown
  incrementalQuery: unknown
}

// Define the PGlite type with extensions
export interface PGliteWithExtensions extends PGlite {
  electric: ElectricNamespace
  live: LiveNamespace
}

// Re-export the useLiveQuery type with correct arguments
export type UseLiveQueryFn = <T>(
  sql: string,
  params?: unknown[],
  options?: LiveQueryOptions<T>
) => LiveQueryResults<T> 