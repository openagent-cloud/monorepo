import React, { useState } from 'react'
import { ZustandExplorer } from './ZustandExplorer'
import { Database, X } from 'lucide-react'
import { useAIChatStore } from '@/stores/ai-chat.store'
import { usePGliteStore } from '@/stores/pglite.store'
import { useThemeStore } from '@/stores/theme.store'
import type { StoreApi } from 'zustand'

export function ZustandExplorerModal() {
  const [isOpen, setIsOpen] = useState(false)

  // Prepare stores for the ZustandExplorer
  const stores = [
    {
      name: 'PGlite Store',
      store: usePGliteStore as unknown as StoreApi<unknown>,
      initialState: usePGliteStore.getState() as unknown as Record<string, unknown>
    },
    {
      name: 'AI Chat Store',
      store: useAIChatStore as unknown as StoreApi<unknown>,
      initialState: useAIChatStore.getState() as unknown as Record<string, unknown>
    },
    {
      name: 'Theme Store',
      store: useThemeStore as unknown as StoreApi<unknown>,
      initialState: useThemeStore.getState() as unknown as Record<string, unknown>
    }
  ]

  // Toggle the modal
  const toggleModal = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Toolbar button */}
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={toggleModal}
          className="flex items-center justify-center w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105"
          title="Toggle State Explorer"
        >
          <Database className="w-5 h-5" />
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[90vw] max-w-[1200px] h-[80vh] flex flex-col overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold flex items-center">
                <Database className="w-5 h-5 mr-2 text-blue-500" />
                State Explorer
              </h2>
              <button
                onClick={toggleModal}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-hidden p-4">
              <ZustandExplorer
                stores={stores}
                theme="system"
                height="100%"
                expandDepth={2}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
} 