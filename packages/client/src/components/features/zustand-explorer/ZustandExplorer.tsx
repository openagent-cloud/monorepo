import React, { useState, useEffect, useRef, useMemo } from 'react'
import type { StoreApi } from 'zustand'
import { cn } from '../../../lib/utils'

type StoreData = {
  name: string
  store: StoreApi<unknown>
  initialState: Record<string, unknown>
}

type ZustandExplorerProps = {
  stores: StoreData[]
  width?: string | number
  height?: string | number
  theme?: 'light' | 'dark' | 'system'
  expandDepth?: number
  className?: string
}

const DEFAULT_EXPAND_DEPTH = 2

export function ZustandExplorer({
  stores,
  width = '100%',
  height = '500px',
  theme = 'system',
  expandDepth = DEFAULT_EXPAND_DEPTH,
  className = '',
}: ZustandExplorerProps) {
  const [activeStore, setActiveStore] = useState<string>(stores[0]?.name || '')
  const [searchQuery, setSearchQuery] = useState('')
  const [timeTravel, setTimeTravel] = useState<{
    enabled: boolean
    history: { state: Record<string, unknown>; timestamp: number }[]
    currentIndex: number
  }>({
    enabled: false,
    history: [],
    currentIndex: -1,
  })

  const containerRef = useRef<HTMLDivElement>(null)

  const currentTheme = useMemo(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme
  }, [theme])

  const selectedStore = useMemo(() => {
    return stores.find(store => store.name === activeStore)
  }, [stores, activeStore])

  const storeState = useStoreState(selectedStore?.store)

  // Add current state to history when timeTravel is enabled
  useEffect(() => {
    if (timeTravel.enabled && storeState && selectedStore) {
      setTimeTravel(prev => {
        // Only add new state if it's different from the last one
        const lastState = prev.history[prev.history.length - 1]?.state
        if (!lastState || JSON.stringify(lastState) !== JSON.stringify(storeState)) {
          const newHistory = [
            ...prev.history,
            {
              state: storeState as Record<string, unknown>,
              timestamp: Date.now()
            }
          ]

          return {
            ...prev,
            history: newHistory,
            currentIndex: newHistory.length - 1
          }
        }
        return prev
      })
    }
  }, [storeState, timeTravel.enabled, selectedStore])

  // Apply time travel state
  useEffect(() => {
    if (
      timeTravel.enabled &&
      timeTravel.history.length > 0 &&
      timeTravel.currentIndex >= 0 &&
      timeTravel.currentIndex < timeTravel.history.length &&
      selectedStore
    ) {
      const historyState = timeTravel.history[timeTravel.currentIndex].state
      selectedStore.store.setState(historyState)
    }
  }, [timeTravel.currentIndex, selectedStore, timeTravel.enabled, timeTravel.history])

  // Filter state by search query
  const filteredState = useMemo(() => {
    if (!searchQuery || !storeState) return storeState

    const searchLower = searchQuery.toLowerCase()

    const filterObject = (obj: unknown): unknown => {
      if (typeof obj !== 'object' || obj === null) return obj

      const result: Record<string, unknown> = {}

      for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
        const keyLower = key.toLowerCase()

        if (keyLower.includes(searchLower)) {
          result[key] = value
          continue
        }

        if (typeof value === 'object' && value !== null) {
          const filteredValue = filterObject(value)
          if (typeof filteredValue === 'object' && filteredValue !== null && Object.keys(filteredValue as Record<string, unknown>).length > 0) {
            result[key] = filteredValue
          }
        } else if (
          (typeof value === 'string' && value.toLowerCase().includes(searchLower)) ||
          (typeof value === 'number' && value.toString().includes(searchQuery))
        ) {
          result[key] = value
        }
      }

      return result
    }

    if (typeof storeState !== 'object' || storeState === null) {
      return storeState
    }

    return filterObject(storeState)
  }, [storeState, searchQuery])

  // Reset time travel when switching stores
  useEffect(() => {
    if (timeTravel.enabled) {
      setTimeTravel({
        enabled: false,
        history: [],
        currentIndex: -1,
      })
    }
  }, [activeStore])

  const resetTimeTravel = () => {
    if (selectedStore) {
      // Reset to initial state
      selectedStore.store.setState(selectedStore.initialState)
      setTimeTravel({
        enabled: false,
        history: [],
        currentIndex: -1,
      })
    }
  }

  const toggleTimeTravel = () => {
    if (!timeTravel.enabled && selectedStore) {
      // Enable time travel and initialize with current state
      setTimeTravel({
        enabled: true,
        history: [{
          state: storeState as Record<string, unknown>,
          timestamp: Date.now()
        }],
        currentIndex: 0,
      })
    } else {
      resetTimeTravel()
    }
  }

  const timeTravelTo = (index: number) => {
    if (
      timeTravel.enabled &&
      timeTravel.history.length > 0 &&
      index >= 0 &&
      index < timeTravel.history.length
    ) {
      setTimeTravel(prev => ({
        ...prev,
        currentIndex: index,
      }))
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground',
        currentTheme === 'dark' ? 'dark' : '',
        className
      )}
      style={{
        width,
        height,
      }}
    >
      <div className="flex items-center justify-between border-b bg-muted px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-primary">
            Zustand Explorer
          </span>
          <select
            value={activeStore}
            onChange={e => setActiveStore(e.target.value)}
            className="rounded-md border bg-background px-2 py-1 text-sm"
          >
            {stores.map(store => (
              <option key={store.name} value={store.name}>
                {store.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="search"
            placeholder="Search state..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-[180px] rounded-md border bg-background px-2 py-1 text-sm"
          />
          <button
            onClick={toggleTimeTravel}
            className={cn(
              "rounded-md border px-2 py-1 text-sm",
              timeTravel.enabled
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground"
            )}
          >
            {timeTravel.enabled ? 'Disable Time Travel' : 'Enable Time Travel'}
          </button>
          {timeTravel.enabled && (
            <button
              onClick={resetTimeTravel}
              className="rounded-md border bg-background px-2 py-1 text-sm"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {timeTravel.enabled && timeTravel.history.length > 0 && (
          <div className="border-b bg-muted px-4 py-2 overflow-x-auto">
            <div className="flex items-center gap-2">
              {timeTravel.history.map((entry, index) => (
                <div
                  key={entry.timestamp}
                  onClick={() => timeTravelTo(index)}
                  className={cn(
                    "h-4 w-2 cursor-pointer rounded-sm transition-all",
                    index === timeTravel.currentIndex
                      ? "bg-primary"
                      : "bg-border"
                  )}
                  title={new Date(entry.timestamp).toLocaleTimeString()}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto p-4">
          {filteredState ? (
            <JsonTree
              data={filteredState}
              expandDepth={expandDepth}
              searchQuery={searchQuery}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No store selected or store is empty
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Custom hook to subscribe to store changes
function useStoreState(store?: StoreApi<unknown>) {
  const [state, setState] = useState<unknown>(null)

  useEffect(() => {
    if (!store) {
      setState(null)
      return
    }

    setState(store.getState())

    const unsubscribe = store.subscribe(newState => {
      // Cast to Record<string, unknown> because we know it's an object
      setState(newState as Record<string, unknown>)
    })

    return unsubscribe
  }, [store])

  return state
}

// JsonTree component to render nested JSON data
type JsonTreeProps = {
  data: unknown
  expandDepth: number
  level?: number
  path?: string
  searchQuery?: string
}

function JsonTree({
  data,
  expandDepth,
  level = 0,
  path = '',
  searchQuery = '',
}: JsonTreeProps) {
  const [expanded, setExpanded] = useState(level < expandDepth)

  // Automatically expand nodes that match search query
  useEffect(() => {
    if (
      searchQuery &&
      !expanded &&
      typeof data === 'object' &&
      data !== null
    ) {
      const searchLower = searchQuery.toLowerCase()

      // Check if any child key or value matches the search
      const hasMatch = Object.entries(data as Record<string, unknown>).some(([key, value]) => {
        const keyMatches = key.toLowerCase().includes(searchLower)
        const valueMatches =
          (typeof value === 'string' && value.toLowerCase().includes(searchLower)) ||
          (typeof value === 'number' && value.toString().includes(searchQuery))

        return keyMatches || valueMatches
      })

      if (hasMatch) {
        setExpanded(true)
      }
    }
  }, [searchQuery, expanded, data])

  if (data === null) {
    return <span className="text-muted-foreground">null</span>
  }

  if (data === undefined) {
    return <span className="text-muted-foreground">undefined</span>
  }

  if (typeof data !== 'object') {
    if (typeof data === 'string') {
      return <span className="text-green-600 dark:text-green-400">"{data}"</span>
    }
    if (typeof data === 'number') {
      return <span className="text-blue-600 dark:text-blue-400">{data}</span>
    }
    if (typeof data === 'boolean') {
      return <span className="text-purple-600 dark:text-purple-400">{data.toString()}</span>
    }
    if (typeof data === 'function') {
      return <span className="text-muted-foreground">[Function]</span>
    }
    return <span>{String(data)}</span>
  }

  const isArray = Array.isArray(data)
  const isEmpty = Object.keys(data).length === 0

  if (isEmpty) {
    return <span>{isArray ? '[]' : '{}'}</span>
  }

  return (
    <div className="relative">
      <div
        onClick={() => setExpanded(!expanded)}
        className="inline-flex cursor-pointer items-center"
      >
        <span
          className="mr-1 inline-block transition-transform"
          style={{
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
          }}
        >
          ▶
        </span>
        <span>
          {isArray ? '[' : '{'}
          {!expanded && (
            <span className="text-muted-foreground">
              {isArray
                ? `Array(${Object.keys(data).length})`
                : Object.keys(data).length > 0
                  ? '...'
                  : ''}
            </span>
          )}
          {!expanded && (isArray ? ']' : '}')}
        </span>
      </div>

      {expanded && (
        <div className="ml-2 border-l border-dashed border-border pl-5">
          {Object.entries(data).map(([key, value], index, array) => (
            <div key={key} className="relative">
              <span>
                {isArray ? (
                  <span className="text-muted-foreground">{key}: </span>
                ) : (
                  <span className="text-pink-600 dark:text-pink-400">"{key}": </span>
                )}
                <JsonTree
                  data={value}
                  expandDepth={expandDepth}
                  level={level + 1}
                  path={path ? `${path}.${key}` : key}
                  searchQuery={searchQuery}
                />
                {index < array.length - 1 && ','}
              </span>
            </div>
          ))}
          <div>{isArray ? ']' : '}'}</div>
        </div>
      )}
    </div>
  )
} 