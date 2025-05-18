import React from 'react'
import { ZustandExplorer } from './ZustandExplorer'
import { useAIChatStore } from '../../../stores/ai-chat.store'
import { usePGliteStore } from '../../../stores/pglite.store'
import { useThemeStore } from '../../../stores/theme.store'
import type { StoreApi } from 'zustand'

export function ZustandExplorerExample() {
  // Create the stores array to pass to ZustandExplorer
  const stores = [
    {
      name: 'AI Chat Store',
      // Cast the store to StoreApi<unknown> to match the expected type
      store: useAIChatStore as unknown as StoreApi<unknown>,
      // Cast the initial state to Record<string, unknown>
      initialState: useAIChatStore.getState() as unknown as Record<string, unknown>
    },
    {
      name: 'PgLite Store',
      store: usePGliteStore as unknown as StoreApi<unknown>,
      initialState: usePGliteStore.getState() as unknown as Record<string, unknown>
    },
    {
      name: 'Theme Store',
      store: useThemeStore as unknown as StoreApi<unknown>,
      initialState: useThemeStore.getState() as unknown as Record<string, unknown>
    }
  ]

  return (
    <div style={{ padding: '20px' }}>
      <h2>Zustand Explorer Demo</h2>
      <p>
        This component visualizes all Zustand stores in real-time.
        Select a store from the dropdown and explore its state.
      </p>
      <div style={{ marginTop: '20px' }}>
        <ZustandExplorer
          stores={stores}
          height="600px"
          theme="system"
          expandDepth={2}
        />
      </div>
    </div>
  )
} 