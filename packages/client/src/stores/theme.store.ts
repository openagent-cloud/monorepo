import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'system'

type ThemeState = {
  themeMode: ThemeMode
  isDarkMode: boolean
  toggleTheme: () => void
  setThemeMode: (mode: ThemeMode) => void
}

// Check if user prefers dark mode
const prefersDarkMode = () =>
  window.matchMedia?.('(prefers-color-scheme: dark)').matches || false

// Apply dark class to the body element based on isDarkMode
const applyThemeToDOM = (isDark: boolean) => {
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Create theme store with localStorage persistence
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // Default to system preference
      themeMode: 'system',

      // Calculate if dark mode is active based on theme mode
      isDarkMode: prefersDarkMode(),

      // Toggle between light, dark, and system modes
      toggleTheme: () => {
        const currentMode = get().themeMode
        let newMode: ThemeMode = 'light'

        if (currentMode === 'light') newMode = 'dark'
        else if (currentMode === 'dark') newMode = 'system'

        const isDark = newMode === 'system' ? prefersDarkMode() : newMode === 'dark'
        applyThemeToDOM(isDark)

        set({
          themeMode: newMode,
          isDarkMode: isDark
        })
      },

      // Set a specific theme mode
      setThemeMode: (mode: ThemeMode) => {
        const isDark = mode === 'system' ? prefersDarkMode() : mode === 'dark'
        applyThemeToDOM(isDark)

        set({
          themeMode: mode,
          isDarkMode: isDark
        })
      }
    }),
    {
      name: 'theme-storage',
      // Apply theme when rehydrating from storage
      onRehydrateStorage: () => (state) => {
        if (state) {
          const isDark = state.themeMode === 'system'
            ? prefersDarkMode()
            : state.themeMode === 'dark'

          applyThemeToDOM(isDark)
          state.isDarkMode = isDark
        }
      }
    }
  )
)

// Set up listener for system preference changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      const { themeMode, setThemeMode } = useThemeStore.getState()

      // Only update if the theme is set to "system"
      if (themeMode === 'system') {
        setThemeMode('system')
      }
    })
} 