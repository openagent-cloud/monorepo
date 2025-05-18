import { useState, useEffect, useRef } from 'react'
import { createLogger } from '@/lib/logger'
import { useThemeStore } from '@/stores/theme.store'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Moon, Sun, Monitor, Check, Copy, AlertTriangle, RefreshCw, Github, Zap, ChevronDown, ChevronUp, Code, Terminal, XCircle, Database, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AIAnalysis, AIAnalyzerToggle, isAIAnalysisEnabled } from '@/components/features/ai-analyzer/AIAnalyzer'
import type { ErrorPayload } from '@/components/features/ai-analyzer/AIAnalyzer'
import { ZustandExplorer } from '../zustand-explorer'
import { useAIChatStore } from '@/stores/ai-chat.store'
import { usePGliteStore } from '@/stores/pglite.store'
import type { StoreApi } from 'zustand'

const logger = createLogger('ErrorDisplay')

// This can be sourced from the package.json or environment variables in a real implementation
const APP_VERSION = '1.0.0'

// Track if there's an active API request currently running
let apiRequestInProgress = false

type ErrorDisplayProps = {
  error: Error
  reset?: () => void
}

// Add a custom tooltip component that wraps the shadcn/ui tooltip with our custom styling
type CustomTooltipProps = {
  content: React.ReactNode
  children: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  variant?: "default" | "info" | "success" | "warning" | "error"
}

const CustomTooltip = ({
  content,
  children,
  side = "bottom",
  align = "center",
  variant = "default"
}: CustomTooltipProps) => {
  // Get variant-specific styles
  const getVariantStyles = () => {
    switch (variant) {
      case "info":
        return "bg-[#f0f7ff]/95 dark:bg-[#172338]/95 border-[#e0edff]/80 dark:border-[#234780]/50 text-[#1c64f2] dark:text-[#93c5fd]"
      case "success":
        return "bg-[#f0fdf4]/95 dark:bg-[#132f1c]/95 border-[#dcfce7]/80 dark:border-[#16532d]/50 text-[#15803d] dark:text-[#86efac]"
      case "warning":
        return "bg-[#fffbeb]/95 dark:bg-[#362917]/95 border-[#fef3c7]/80 dark:border-[#854d0e]/50 text-[#b45309] dark:text-[#fcd34d]"
      case "error":
        return "bg-[#fef2f2]/95 dark:bg-[#3c1212]/95 border-[#fee2e2]/80 dark:border-[#9b1c1c]/50 text-[#dc2626] dark:text-[#fca5a5]"
      default:
        return "bg-white/95 dark:bg-black/90 border-[#f0f0f0]/70 dark:border-[#333]/40 text-[#334155] dark:text-[#e2e8f0]"
    }
  }

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className={cn(
            "relative font-medium text-xs px-3 py-2 backdrop-blur-md",
            getVariantStyles(),
            "border shadow-[0_5px_21px_-5px_rgba(0,0,0,0.1),0_3px_8px_-2px_rgba(0,0,0,0.05)]",
            "dark:shadow-[0_5px_21px_-5px_rgba(0,0,0,0.2),0_3px_8px_-2px_rgba(0,0,0,0.15)]",
            "rounded-lg transform-gpu",
            "animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-50 data-[state=closed]:zoom-out-95",
            "data-[state=closed]:slide-out-to-bottom-1",
            "data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=open]:slide-in-from-bottom-1",
            "data-[side=bottom]:slide-in-from-top-1",
            "data-[side=top]:slide-in-from-bottom-1",
            "data-[side=right]:slide-in-from-left-1",
            "data-[side=left]:slide-in-from-right-1",
            "after:content-[''] after:absolute after:w-2 after:h-2 after:rotate-45 after:bg-inherit after:border-inherit after:z-[-1]",
            "after:data-[side=top]:bottom-[-4px] after:data-[side=top]:left-1/2 after:data-[side=top]:ml-[-4px] after:data-[side=top]:border-t-0 after:data-[side=top]:border-l-0",
            "after:data-[side=bottom]:top-[-4px] after:data-[side=bottom]:left-1/2 after:data-[side=bottom]:ml-[-4px] after:data-[side=bottom]:border-b-0 after:data-[side=bottom]:border-r-0",
            "after:data-[side=left]:right-[-4px] after:data-[side=left]:top-1/2 after:data-[side=left]:mt-[-4px] after:data-[side=left]:border-l-0 after:data-[side=left]:border-b-0",
            "after:data-[side=right]:left-[-4px] after:data-[side=right]:top-1/2 after:data-[side=right]:mt-[-4px] after:data-[side=right]:border-r-0 after:data-[side=right]:border-t-0",
            "filter drop-shadow-sm dark:drop-shadow-md"
          )}
        >
          <div className="flex items-center gap-1.5">
            {content}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function ErrorDisplay({ error, reset }: ErrorDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [errorTime] = useState(new Date())
  const [stackExpanded, setStackExpanded] = useState(false)
  const [codeView, setCodeView] = useState<'stack' | 'formatted'>('stack')
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null)
  const [showAIAnalysis, setShowAIAnalysis] = useState(false)
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false)
  const { themeMode, toggleTheme } = useThemeStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const aiEnabled = isAIAnalysisEnabled()
  const [showErrorNotification, setShowErrorNotification] = useState(false)
  const [aiErrorMessage, setAiErrorMessage] = useState<string | null>(null)
  const [progressValue, setProgressValue] = useState(100)
  const toastDuration = 5000 // 5 seconds until auto-dismiss

  // Add state to track API request details for error logging
  const [apiRequestTimestamp, setApiRequestTimestamp] = useState<number | null>(null)

  // Add state explorer related state
  const [showStateExplorer, setShowStateExplorer] = useState(false)
  const [activeTab, setActiveTab] = useState<'error' | 'ai' | 'state'>('error')

  // Format the elapsed time in a human-readable way with precise suffixes
  const formatElapsedTime = (startTime: Date) => {
    const elapsedMs = Date.now() - startTime.getTime()

    // Convert to seconds
    const seconds = Math.floor(elapsedMs / 1000)

    if (seconds < 60) {
      return `${seconds}s ago`
    }

    // Convert to minutes
    const minutes = Math.floor(seconds / 60)

    if (minutes < 60) {
      return `${minutes}m ago`
    }

    // Convert to hours
    const hours = Math.floor(minutes / 60)

    if (hours < 24) {
      return `${hours}h ago`
    }

    // Convert to days
    const days = Math.floor(hours / 24)
    if (days === 1) return '1 day ago'
    return `${days} days ago`
  }

  // State for real-time elapsed time display
  const [elapsedTimeText, setElapsedTimeText] = useState(formatElapsedTime(errorTime))

  // Update elapsed time every second for real-time display
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setElapsedTimeText(formatElapsedTime(errorTime))
    }, 1000)

    // Clean up interval on unmount
    return () => clearInterval(updateInterval)
  }, [errorTime])

  // Format the error name to add spaces between camel case words
  const formatErrorName = (name: string) => {
    return name.replace(/([A-Z])/g, ' $1').trim()
  }

  // Clean up error message by removing unwanted prefixes
  const cleanErrorMessage = (message: string) => {
    if (!message) return 'Unknown error'
    return message.replace('RuntimeError: ', '')
  }

  // Clean up the error stack to remove unwanted lines and prefixes
  const cleanErrorStack = (stack: string) => {
    if (!stack) return ''

    const lines = stack.split('\n')
    // Remove the first line if it contains "Aborted()" or other unwanted text
    const filteredLines = lines.filter(line => !line.includes('Aborted()'))

    // Skip the first line which is the error message
    return filteredLines.slice(1).join('\n')
  }

  const errorName = formatErrorName(error?.name || 'Error')
  const errorMessage = cleanErrorMessage(error?.message || 'An unexpected error occurred')
  const stackTraceOnly = cleanErrorStack(error?.stack || '')

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  // Watch for animations and remove them after completion
  useEffect(() => {
    if (currentAnimation) {
      const timer = setTimeout(() => setCurrentAnimation(null), 500)
      return () => clearTimeout(timer)
    }
  }, [currentAnimation])

  const copyError = () => {
    try {
      // Include both the error message and stack for complete information
      const fullError = `${errorMessage}\n${stackTraceOnly}`
      navigator.clipboard.writeText(fullError)
      setCopied(true)
      setCurrentAnimation('copy')
      logger.info('Error stack copied to clipboard')
    } catch (err) {
      logger.error('Failed to copy error stack:', err)
    }
  }

  const getActionHighlightClass = (action: string) => {
    if (currentAnimation === action) {
      return "animate-[pulse_0.5s_ease-in-out]"
    }
    return ''
  }

  // Get the appropriate theme icon based on the current mode
  const getThemeIcon = () => {
    if (themeMode === 'dark') return <Moon className="w-3.5 h-3.5" strokeWidth={2.5} />
    else if (themeMode === 'system') return <Monitor className="w-3.5 h-3.5" strokeWidth={2.5} />
    return <Sun className="w-3.5 h-3.5" strokeWidth={2.5} />
  }

  // Get tooltip text for the theme toggle button
  const getThemeTooltipText = () => {
    switch (themeMode) {
      case 'light': return 'Switch to Dark Mode'
      case 'dark': return 'Switch to System Mode'
      case 'system': return 'Switch to Light Mode'
    }
  }

  // Handle theme toggle with animation
  const handleThemeToggle = () => {
    setCurrentAnimation('theme')
    toggleTheme()
  }

  // Handle retry with animation
  const handleRetry = () => {
    if (reset) {
      setCurrentAnimation('retry')
      setTimeout(() => reset(), 300)
    }
  }

  // Ensure we clean up API request status when component unmounts
  useEffect(() => {
    return () => {
      // Reset the global state when component unmounts to prevent issues
      // with future instances of the component
      apiRequestInProgress = false
      setApiRequestTimestamp(null)
      setAiAnalysisLoading(false)
    }
  }, [])

  // Handle toggle for AI analysis with animation
  const toggleAIAnalysis = () => {
    // Only allow toggling off if already shown, or toggling on if not shown and no analysis is loading
    if (showAIAnalysis || !aiAnalysisLoading) {
      setCurrentAnimation('ai')

      // If we're toggling off, just hide the panel
      if (showAIAnalysis) {
        setShowAIAnalysis(false)
        logger.info(`AI Analysis toggled off`)
        return
      }

      // We're toggling on - check if there's already an API request in progress
      if (apiRequestInProgress) {
        logger.error('Cannot start a new AI analysis while another request is in progress')

        // Show error notification
        setAiErrorMessage('Another AI analysis request is already in progress. Please wait for it to complete.')
        setShowErrorNotification(true)
        setProgressValue(100) // Reset progress bar

        // Auto-hide notification
        const startTime = Date.now()
        const progressInterval = setInterval(() => {
          const elapsed = Date.now() - startTime
          const remaining = Math.max(0, 100 - (elapsed / toastDuration) * 100)
          setProgressValue(remaining)

          if (remaining <= 0) {
            clearInterval(progressInterval)
            setShowErrorNotification(false)
          }
        }, 50)

        return () => clearInterval(progressInterval)
      }

      // Mark that we're starting an API request and store the timestamp
      apiRequestInProgress = true
      setApiRequestTimestamp(Date.now())
      setAiAnalysisLoading(true)
      setShowAIAnalysis(true)
      logger.info(`AI Analysis toggled on`)
    }
  }

  // Handle AI action from the AIAnalysis component
  const handleAiAction = (actionType: string, actionPayload?: string | ErrorPayload | null) => {
    // Log the action for now - this would be handled by the application
    logger.info(`AI Action triggered: ${actionType}`, actionPayload)
    console.log(`AI Action triggered: ${actionType}`, actionPayload)

    // Clear loading state when analysis is complete
    if (actionType === 'analysis-complete') {
      // Mark API request as completed
      apiRequestInProgress = false
      setApiRequestTimestamp(null)
      setAiAnalysisLoading(false)
      logger.info('Analysis complete, loading state cleared')
    } else if (actionType === 'analysis-error') {
      // Mark API request as completed, even on error
      apiRequestInProgress = false
      setApiRequestTimestamp(null)
      setAiAnalysisLoading(false)
      logger.error('Analysis error, loading state cleared')

      // Hide AI analysis panel on error
      setShowAIAnalysis(false)

      // Show error notification with details
      if (actionPayload && typeof actionPayload !== 'string') {
        setAiErrorMessage(actionPayload.message || "An error occurred during analysis")
        setShowErrorNotification(true)
        setProgressValue(100) // Reset progress bar

        // Auto-hide after 5 seconds with animated progress
        const startTime = Date.now()
        const progressInterval = setInterval(() => {
          const elapsed = Date.now() - startTime
          const remaining = Math.max(0, 100 - (elapsed / toastDuration) * 100)
          setProgressValue(remaining)

          if (remaining <= 0) {
            clearInterval(progressInterval)
            setShowErrorNotification(false)
          }
        }, 50)

        // Cleanup interval if dismissed manually
        return () => clearInterval(progressInterval)
      }
    }

    // Here, we'd typically dispatch an event to the parent application
    // to handle the AI action in the context of the current conversation

    if (actionType === 'setup-openai') {
      // Show instructions for setting up OpenAI
      alert('To enable AI analysis, add your Tenant Secret key to .env file as VITE_TENANT_SECRET')
    }
  }

  // Add effect to handle API request timeouts (in case the response never returns)
  useEffect(() => {
    if (apiRequestTimestamp && apiRequestInProgress) {
      const timeoutDuration = 60000 // 1 minute timeout

      const timeoutId = setTimeout(() => {
        if (apiRequestInProgress && apiRequestTimestamp) {
          // Force reset the API request state after timeout
          apiRequestInProgress = false
          setApiRequestTimestamp(null)
          setAiAnalysisLoading(false)

          // Show timeout error
          setAiErrorMessage('The AI analysis request timed out. Please try again.')
          setShowErrorNotification(true)
          setProgressValue(100)

          // Auto-hide notification
          const startTime = Date.now()
          const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime
            const remaining = Math.max(0, 100 - (elapsed / toastDuration) * 100)
            setProgressValue(remaining)

            if (remaining <= 0) {
              clearInterval(progressInterval)
              setShowErrorNotification(false)
            }
          }, 50)

          logger.error('AI analysis request timed out after 60 seconds')
        }
      }, timeoutDuration)

      return () => clearTimeout(timeoutId)
    }
  }, [apiRequestTimestamp, toastDuration])

  // Add effect to handle progress bar animation
  useEffect(() => {
    let progressInterval: NodeJS.Timeout | null = null

    if (showErrorNotification) {
      const startTime = Date.now()
      progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const remaining = Math.max(0, 100 - (elapsed / toastDuration) * 100)
        setProgressValue(remaining)

        if (remaining <= 0) {
          if (progressInterval) clearInterval(progressInterval)
          setShowErrorNotification(false)
        }
      }, 50)
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval)
    }
  }, [showErrorNotification])

  // Prepare stores for the ZustandExplorer
  const storesList = [
    {
      name: 'AI Chat Store',
      store: useAIChatStore as unknown as StoreApi<unknown>,
      initialState: useAIChatStore.getState() as unknown as Record<string, unknown>
    },
    {
      name: 'PGlite Store',
      store: usePGliteStore as unknown as StoreApi<unknown>,
      initialState: usePGliteStore.getState() as unknown as Record<string, unknown>
    },
    {
      name: 'Theme Store',
      store: useThemeStore as unknown as StoreApi<unknown>,
      initialState: useThemeStore.getState() as unknown as Record<string, unknown>
    }
  ]

  // Toggle state explorer
  const toggleStateExplorer = () => {
    if (!showStateExplorer) {
      setShowStateExplorer(true)
      setActiveTab('state')
    } else {
      setShowStateExplorer(false)
      setActiveTab('error')
    }
  }

  // Determine active tab styling
  const getTabClass = (tab: 'error' | 'ai' | 'state') => {
    return cn(
      "flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors",
      activeTab === tab
        ? "border-primary text-primary"
        : "border-transparent hover:border-border text-muted-foreground hover:text-foreground"
    )
  }

  // Handle tab changes
  const handleTabChange = (tab: 'error' | 'ai' | 'state') => {
    setActiveTab(tab)
    // Don't auto-trigger AI analysis when switching to the AI tab
    // Only update state explorer if needed
    if (tab === 'state' && !showStateExplorer) {
      setShowStateExplorer(true)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#fafafa]/90 dark:bg-[#090909]/90 backdrop-blur-md font-sans py-8">
      <div
        ref={containerRef}
        className="w-full max-w-[min(900px,95vw)] bg-white dark:bg-[#171717] rounded-2xl shadow-[0_10px_40px_-5px_rgba(0,0,0,0.15),0_5px_20px_-5px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_-5px_rgba(0,0,0,0.5),0_8px_20px_-5px_rgba(0,0,0,0.4)] border border-[#f0f0f0]/90 dark:border-[#262626]/70 max-h-[90vh] overflow-auto scrollbar-thin"
      >
        {/* Error notification for AI analysis errors */}
        {showErrorNotification && aiErrorMessage && (
          <div className="absolute top-4 right-4 z-50 max-w-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg p-3 shadow-lg animate-in fade-in slide-in-from-top-5">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">AI Analysis Error</h3>
                <div className="mt-1 text-sm text-red-700 dark:text-red-300">
                  {aiErrorMessage}
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-6 px-2 bg-transparent border-red-300 dark:border-red-800/50 text-red-700 dark:text-red-300 hover:bg-red-50/50 dark:hover:bg-red-900/20"
                    onClick={() => setShowErrorNotification(false)}
                  >
                    Dismiss
                  </Button>
                  <span className="text-xs text-red-500/70 dark:text-red-400/70">
                    {Math.ceil(progressValue / 20)}s
                  </span>
                </div>
                <div className="h-1 w-full bg-red-200 dark:bg-red-800/30 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-red-500 dark:bg-red-600 rounded-full transition-all duration-100 ease-linear"
                    style={{ width: `${progressValue}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error header - sticky at the top */}
        <div className="bg-gradient-to-r from-[#d42c16] via-[#e53a1e] to-[#d13a28] dark:from-[#a81c0d] dark:via-[#b72c16] dark:to-[#a32317] sticky top-0 z-10">
          <div className="px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="h-13 w-13 rounded-full hover:rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/8 dark:hover:bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-inner shadow-white/5 border border-white/20 group">
                <AlertTriangle className="h-6 w-6 text-white/90 group-hover:text-white/100" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-[#ffffffaa] text-xs uppercase tracking-wide font-medium">Error Detected</div>
                <h2 className="text-white text-xl font-semibold tracking-tight">{errorName}</h2>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2.5">
              <CustomTooltip
                content={
                  <div className="flex items-center gap-1.5">
                    {copied ?
                      <Check className="w-3 h-3" strokeWidth={2.5} /> :
                      <Copy className="w-3 h-3" strokeWidth={2.5} />
                    }
                    <span>{copied ? "Copied Successfully" : "Copy Error Details"}</span>
                  </div>
                }
                side="bottom"
                variant={copied ? "success" : "default"}
              >
                <Button
                  onClick={copyError}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "w-8 h-8 rounded-full border flex items-center justify-center hover:-translate-y-0.5 hover:shadow",
                    copied
                      ? "bg-[#10b981]/90 border-[#10b981]/30 text-white hover:bg-[#10b981]/95 hover:border-[#10b981]/40"
                      : "bg-white/15 border-white/20 text-white hover:bg-white/25 hover:border-white/30",
                    getActionHighlightClass('copy')
                  )}
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                  ) : (
                    <Copy className="w-3.5 h-3.5" strokeWidth={2.5} />
                  )}
                </Button>
              </CustomTooltip>

              <CustomTooltip
                content={
                  <div className="flex items-center gap-1.5">
                    {themeMode === 'light' && <Sun className="w-3 h-3" strokeWidth={2.5} />}
                    {themeMode === 'dark' && <Moon className="w-3 h-3" strokeWidth={2.5} />}
                    {themeMode === 'system' && <Monitor className="w-3 h-3" strokeWidth={2.5} />}
                    <span>{getThemeTooltipText()}</span>
                  </div>
                }
                side="bottom"
              >
                <Button
                  onClick={handleThemeToggle}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "w-8 h-8 rounded-full border border-white/20 bg-white/15 text-white hover:bg-white/25 hover:border-white/30 flex items-center justify-center hover:-translate-y-0.5 hover:shadow",
                    getActionHighlightClass('theme')
                  )}
                >
                  {getThemeIcon()}
                </Button>
              </CustomTooltip>

              {reset && (
                <CustomTooltip
                  content={
                    <div className="flex items-center gap-1.5">
                      <RefreshCw className="w-3 h-3" strokeWidth={2.5} />
                      <span>Retry Operation</span>
                    </div>
                  }
                  side="bottom"
                  variant="warning"
                >
                  <Button
                    onClick={handleRetry}
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "w-8 h-8 rounded-full border border-white/20 bg-white/15 text-white hover:bg-white/25 hover:border-white/30 flex items-center justify-center hover:-translate-y-0.5 hover:shadow",
                      getActionHighlightClass('retry')
                    )}
                  >
                    <RefreshCw className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </Button>
                </CustomTooltip>
              )}

              {/* Add a State Explorer toggle button */}
              <CustomTooltip
                content="Explore Application State"
                variant="info"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleStateExplorer}
                  className={getActionHighlightClass('state')}
                >
                  <Database className="h-5 w-5" />
                </Button>
              </CustomTooltip>
            </div>
          </div>
        </div>

        {/* Add the tabbed interface */}
        <div className="border-b border-border">
          <div className="flex">
            <button
              className={getTabClass('error')}
              onClick={() => handleTabChange('error')}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Error Details
            </button>

            {aiEnabled && (
              <button
                className={getTabClass('ai')}
                onClick={() => handleTabChange('ai')}
              >
                <Zap className="mr-2 h-4 w-4" />
                AI Analysis
              </button>
            )}

            <button
              className={getTabClass('state')}
              onClick={() => handleTabChange('state')}
            >
              <Database className="mr-2 h-4 w-4" />
              State Explorer
            </button>
          </div>
        </div>

        {/* Main content area - not independently scrollable */}
        <div>
          {/* Error message */}
          {activeTab === 'error' && (
            <div className="p-5 border-b border-[#f0f0f0] dark:border-[#222]">
              <div className="bg-[#fef2f2] dark:bg-[#2c1212] text-[#b91c1c] dark:text-[#fca5a5] p-4 font-medium rounded-lg border border-[#fee2e2]/50 dark:border-[#581818]/50 shadow-sm relative">
                {errorMessage}

                {/* AI Toggle button - only shown if API key is configured */}
                {aiEnabled && (
                  <AIAnalyzerToggle
                    showAIAnalysis={showAIAnalysis}
                    onToggle={toggleAIAnalysis}
                    animationClass={getActionHighlightClass('ai')}
                    isLoading={aiAnalysisLoading}
                    onCancel={() => {
                      setAiAnalysisLoading(false)
                      logger.info('AI Analysis cancelled by user')
                      console.log('AI Analysis cancelled by user')
                    }}
                  />
                )}
              </div>
              <div className="flex justify-between items-center mt-3">
                <div className="text-[#64748b] dark:text-[#94a3b8] text-xs font-medium">
                  <span>Occurred {elapsedTimeText}</span>
                  <span className="inline-block mx-2 text-[#cbd5e1] dark:text-[#475569]">•</span>
                  <span className="font-mono text-[0.625rem] bg-[#f8fafc] dark:bg-[#1e293b] px-2 py-0.5 rounded">
                    {errorTime.toISOString().replace('T', ' ').substring(0, 19)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Stack view toggle controls */}
                  <div className="flex justify-end mt-3 mb-2">
                    <div className="flex bg-[#f8fafc] dark:bg-[#1e293b] p-0.5 rounded-md border border-[#e2e8f0] dark:border-[#334155]">
                      <CustomTooltip content="Parsed Stack View" side="top" variant="info">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCodeView('formatted')}
                          className={cn(
                            "h-6 rounded-l-md rounded-r-none border-0 flex items-center justify-center px-2.5",
                            codeView === 'formatted'
                              ? "bg-white dark:bg-[#0f172a] text-[#0f172a] dark:text-[#e2e8f0] shadow-sm"
                              : "bg-transparent text-[#64748b] dark:text-[#94a3b8] hover:text-[#1e293b] dark:hover:text-[#e2e8f0]"
                          )}
                        >
                          <Terminal className="w-3.5 h-3.5 mr-1.5" strokeWidth={2} />
                        </Button>
                      </CustomTooltip>

                      <CustomTooltip content="Raw Stack View" side="top" variant="info">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCodeView('stack')}
                          className={cn(
                            "h-6 rounded-r-md rounded-l-none border-0 flex items-center justify-center px-2.5",
                            codeView === 'stack'
                              ? "bg-white dark:bg-[#0f172a] text-[#0f172a] dark:text-[#e2e8f0] shadow-sm"
                              : "bg-transparent text-[#64748b] dark:text-[#94a3b8] hover:text-[#1e293b] dark:hover:text-[#e2e8f0]"
                          )}
                        >
                          <Code className="w-3.5 h-3.5 mr-1.5" strokeWidth={2} />
                        </Button>
                      </CustomTooltip>
                    </div>
                  </div>
                  <button
                    className="text-xs text-[#64748b] dark:text-[#94a3b8] hover:text-[#475569] dark:hover:text-[#cbd5e1] font-medium flex items-center gap-1.5 px-2 py-1 rounded hover:bg-[#f1f5f9]/80 dark:hover:bg-[#1e293b]/50"
                    onClick={() => setStackExpanded(!stackExpanded)}
                  >
                    {stackExpanded ? 'Hide details' : 'Show details'}
                    {stackExpanded ?
                      <ChevronUp className="w-3.5 h-3.5" strokeWidth={2.5} /> :
                      <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.5} />
                    }
                  </button>
                </div>
              </div>

              {/* Stack trace display */}
              {stackExpanded && (
                <>


                  {/* Stack content display */}
                  <div className="mt-2">
                    {codeView === 'stack' ? (
                      /* Raw stack view */
                      <div className="relative">
                        <pre className="p-4 rounded-lg bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#e2e8f0] text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all scrollbar-thin">
                          {stackTraceOnly || 'No stack trace available'}
                        </pre>
                      </div>
                    ) : (
                      /* Parsed/formatted stack view */
                      <div className="relative">
                        <div className="p-4 rounded-lg bg-[#f8fafc] dark:bg-[#0f172a] text-xs overflow-x-auto scrollbar-thin">
                          {stackTraceOnly ? (
                            stackTraceOnly.split('\n').map((line, index) => {
                              // Skip empty lines
                              if (!line.trim()) {
                                return null;
                              }

                              // Parse the stack trace line
                              const atMatch = line.match(/at (.+) \((.+)\)/) || line.match(/at (.+)/);

                              if (!atMatch) {
                                return (
                                  <div
                                    key={index}
                                    className="text-[#64748b] dark:text-[#94a3b8] font-mono py-0.5"
                                  >
                                    {line}
                                  </div>
                                );
                              }

                              // Extract function name and file path
                              const functionName = atMatch[1]?.trim() || 'anonymous';
                              let filePath = atMatch[2] || '';
                              let lineInfo = '';
                              let isNative = false;

                              if (filePath) {
                                isNative = filePath.includes('[native code]');
                                const fileMatch = filePath.match(/(.+):(\d+):(\d+)$/);

                                if (fileMatch) {
                                  filePath = fileMatch[1];
                                  lineInfo = `:${fileMatch[2]}:${fileMatch[3]}`;
                                }
                              } else if (functionName.includes(':')) {
                                // Handle format like 'at /path/to/file.js:10:20'
                                const fileMatch = functionName.match(/(.+):(\d+):(\d+)$/);

                                if (fileMatch) {
                                  filePath = fileMatch[1];
                                  lineInfo = `:${fileMatch[2]}:${fileMatch[3]}`;

                                  return (
                                    <div key={index} className="font-mono py-0.5 flex flex-wrap items-baseline">
                                      <span className="text-[#64748b] dark:text-[#94a3b8] mr-1">at</span>
                                      <span className="text-[#dc2626] dark:text-[#ef4444] mr-1">anonymous</span>
                                      <span className="text-[#0f766e] dark:text-[#14b8a6] break-all">
                                        {filePath}
                                        <span className="text-[#6366f1] dark:text-[#818cf8]">{lineInfo}</span>
                                      </span>
                                    </div>
                                  );
                                }
                              }

                              // Default display for normal stack frame
                              return (
                                <div key={index} className="font-mono py-0.5 flex flex-wrap items-baseline">
                                  <span className="text-[#64748b] dark:text-[#94a3b8] mr-1">at</span>
                                  <span className="text-[#0369a1] dark:text-[#38bdf8] mr-1">{functionName}</span>
                                  {(filePath || isNative) && (
                                    <>
                                      <span className="text-[#64748b] dark:text-[#94a3b8] mx-1">in</span>
                                      {isNative ? (
                                        <span className="text-[#a16207] dark:text-[#fcd34d]">[native code]</span>
                                      ) : (
                                        <span className="text-[#0f766e] dark:text-[#14b8a6] break-all">
                                          {filePath}
                                          <span className="text-[#6366f1] dark:text-[#818cf8]">{lineInfo}</span>
                                        </span>
                                      )}
                                    </>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-[#64748b] dark:text-[#94a3b8] italic">
                              No stack trace available
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* AI Analysis panel */}
          {activeTab === 'ai' && (
            <div className="p-0">
              {showAIAnalysis ? (
                <AIAnalysis
                  errorName={error.name}
                  errorMessage={error.message}
                  stackTrace={error.stack || ''}
                  onAction={handleAiAction}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="mb-4">
                    <Sparkles className="w-12 h-12 text-blue-500 dark:text-blue-400 mb-2 mx-auto" />
                    <h3 className="text-lg font-semibold mb-1">AI Error Analysis</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Get detailed insights into this error with AI assistance
                    </p>
                  </div>
                  <Button
                    onClick={toggleAIAnalysis}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start Analysis
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* State Explorer panel */}
          {activeTab === 'state' && showStateExplorer && (
            <div className="p-4">
              <ZustandExplorer
                stores={storesList}
                height="500px"
                theme={themeMode}
                expandDepth={4}
                className="border border-border"
              />
            </div>
          )}
        </div>

        {/* Footer - sticky at the bottom */}
        <div className="bg-[#f9fafb] dark:bg-[#111] border-t border-[#f0f0f0] dark:border-[#222] px-5 py-3 flex justify-center items-center sticky bottom-0">
          <CustomTooltip
            content={
              <div className="flex items-center gap-1.5">
                <Github className="w-3 h-3" strokeWidth={2.5} />
                <span>View Project on GitHub</span>
              </div>
            }
            side="top"
            variant="info"
          >
            <a
              href="https://github.com/tyzoo/electric-stack-template"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center hover:text-[#0f172a] dark:hover:text-white"
            >
              <div className="flex items-center gap-1.5 py-1 px-3 rounded-full hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b]">
                <Zap className="w-3.5 h-3.5 text-[#2563eb] group-hover:text-[#3b82f6] dark:group-hover:text-[#60a5fa]" strokeWidth={2.5} />
                <p className="text-xs text-[#64748b] dark:text-[#94a3b8] group-hover:text-[#334155] dark:group-hover:text-[#e2e8f0] font-medium">
                  Electric Stack Template <span className="opacity-60">v{APP_VERSION}</span>
                </p>
                <Github className="w-3.5 h-3.5 text-[#64748b] dark:text-[#94a3b8] group-hover:text-[#334155] dark:group-hover:text-[#e2e8f0]" strokeWidth={2.5} />
              </div>
            </a>
          </CustomTooltip>
        </div>
      </div>
    </div>
  )
} 