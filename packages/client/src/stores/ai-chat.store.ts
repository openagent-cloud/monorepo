import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { aiService } from '@/lib/ai.service'
import type { ChatMessage } from '@/components/features/chat-ui/ChatInterface'
import type { ErrorAnalysisResult, ErrorPayload } from '@/lib/ai.service'
import { createLogger } from '@/lib/logger'

const logger = createLogger('aiChatStore')

// Generate a unique message ID
const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

interface AIAnalysisState {
  // Chat state
  messages: ChatMessage[]
  isSendingMessage: boolean

  // Error analysis state
  currentAnalysis: ErrorAnalysisResult | null
  isAnalyzing: boolean
  analysisError: string | null
  analysisProgress: number

  // UI state
  activeTab: 'analysis' | 'chat'

  // Completion indicators
  hasRootCauseAnalysis: boolean
  hasSolutionSteps: boolean
  hasRelatedDocs: boolean
  hasPackages: boolean
  hasGithubIssues: boolean

  // Actions
  sendMessage: (message: string, errorContext?: {
    errorName: string
    errorMessage: string
    rootCause?: string
    explanation?: string
  }) => Promise<void>

  setActiveTab: (tab: 'analysis' | 'chat') => void

  analyzeError: (error: ErrorPayload,
    onAction: (actionType: string, payload?: string | ErrorPayload | null) => void
  ) => Promise<void>

  resetAnalysis: () => void

  // Add a new method to initialize the chat with a welcome message
  initializeChat: (errorName: string, errorMessage: string, rootCause?: string, explanation?: string) => void

  // Add solution management method
  updateSolution: (index: number, updates: { completed?: boolean }) => void
}

export const useAIChatStore = create<AIAnalysisState>()(
  persist(
    (set, get) => ({
      // Initial state
      messages: [],
      isSendingMessage: false,

      currentAnalysis: null,
      isAnalyzing: false,
      analysisError: null,
      analysisProgress: 0,

      activeTab: 'analysis',

      hasRootCauseAnalysis: false,
      hasSolutionSteps: false,
      hasRelatedDocs: false,
      hasPackages: false,
      hasGithubIssues: false,

      // Set active tab
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Initialize chat with a welcome message if empty
      initializeChat: (errorName, errorMessage, rootCause, explanation) => {
        const { messages } = get()

        // Only add welcome message if no messages exist
        if (messages.length === 0) {
          const welcomeMessage = rootCause && explanation
            ? `I've analyzed the error "${errorName}: ${errorMessage}". ${rootCause} ${explanation}`
            : `I'm here to help you with the error "${errorName}: ${errorMessage}". What would you like to know?`

          set({
            messages: [
              {
                role: 'assistant',
                content: welcomeMessage,
                status: 'complete',
                timestamp: new Date(),
                messageId: generateMessageId()
              }
            ]
          })
        }
      },

      // Send a message to the chat
      sendMessage: async (message, errorContext) => {
        const { messages } = get()

        if (!message.trim() || get().isSendingMessage) return

        // Add user message to state
        const newMessages: ChatMessage[] = [
          ...messages,
          {
            role: 'user',
            content: message,
            timestamp: new Date(),
            messageId: generateMessageId()
          }
        ]

        // Create a unique message ID for the assistant's response
        const assistantMessageId = generateMessageId()

        // Update state with user message and loading indicator
        set({
          messages: [
            ...newMessages,
            {
              role: 'assistant',
              content: '',
              status: 'loading',
              timestamp: new Date(),
              messageId: assistantMessageId
            }
          ],
          isSendingMessage: true
        })

        try {
          // Create system context with error details if available
          const systemContext = errorContext
            ? `You are helping debug a JavaScript/TypeScript error:
Error Name: ${errorContext.errorName}
Error Message: ${errorContext.errorMessage}
${errorContext.rootCause ? `Root Cause: ${errorContext.rootCause}` : ''}
${errorContext.explanation ? `Explanation: ${errorContext.explanation}` : ''}

Your task is to assist the user with understanding and fixing this error.
Be concise and helpful, providing code examples when appropriate.`
            : 'You are a helpful AI assistant.'

          // Format chat history for AI service
          const chatHistory = get().messages
            .filter(msg => msg.role !== 'system' && msg.status !== 'loading')
            .map(msg => ({
              role: msg.role as 'user' | 'assistant',
              content: msg.content
            }))

          // Add user's new message to history
          chatHistory.push({
            role: 'user',
            content: message
          })

          // Use streaming API instead of waiting for full response
          await aiService.getChatCompletionStream(
            {
              messages: [
                { role: 'system', content: systemContext },
                ...chatHistory
              ],
              temperature: 0.7
            },
            // This callback will be called for each token received
            (token, isDone) => {
              // Use functional update to ensure atomic operations and avoid race conditions
              set(state => {
                // Find assistant's message index
                const assistantMessageIndex = state.messages.findIndex(
                  msg => msg.messageId === assistantMessageId
                )

                if (assistantMessageIndex === -1) return state

                // Create updated messages array
                const updatedMessages = [...state.messages]
                const currentMessage = updatedMessages[assistantMessageIndex]

                updatedMessages[assistantMessageIndex] = {
                  ...currentMessage,
                  content: currentMessage.content + token,
                  status: isDone ? 'complete' : 'loading'
                }

                return {
                  messages: updatedMessages,
                  isSendingMessage: !isDone
                }
              })
            }
          )
        } catch (error) {
          logger.error('Error sending message:', error)

          // Update with error state using atomic update
          set(state => {
            const assistantMessageIndex = state.messages.findIndex(
              msg => msg.messageId === assistantMessageId
            )

            if (assistantMessageIndex === -1) return { isSendingMessage: false }

            const updatedMessages = [...state.messages]
            updatedMessages[assistantMessageIndex] = {
              role: 'assistant',
              content: 'Sorry, I encountered an error while processing your question. Please try again.',
              status: 'error',
              timestamp: new Date(),
              messageId: assistantMessageId
            }

            return {
              messages: updatedMessages,
              isSendingMessage: false
            }
          })
        }
      },

      // Analyze an error
      analyzeError: async (error, onAction) => {
        // Reset state before starting
        set({
          isAnalyzing: true,
          analysisProgress: 0,
          analysisError: null,
          currentAnalysis: null,
          hasRootCauseAnalysis: false,
          hasSolutionSteps: false,
          hasRelatedDocs: false,
          hasPackages: false,
          hasGithubIssues: false
        })

        try {
          // Track analysis progress with atomic updates
          const trackAnalysisProgress = (partialResult: Partial<ErrorAnalysisResult>) => {
            // Use atomic updates to prevent race conditions
            set(state => {
              // If we get stream complete signal, set everything to 100%
              if (partialResult.streamComplete) {
                return {
                  analysisProgress: 100,
                  currentAnalysis: partialResult as ErrorAnalysisResult,
                  hasRootCauseAnalysis: !!partialResult.rootCause,
                  hasSolutionSteps: !!partialResult.solutions?.length,
                  hasRelatedDocs: !!partialResult.relatedDocs?.length,
                  hasPackages: !!partialResult.packages?.length,
                  hasGithubIssues: !!partialResult.githubIssues?.length
                }
              }

              // Update progress based on what data we have
              let progress = state.analysisProgress

              // Determine progress based on what fields are present
              if (partialResult.progressPercentage) {
                progress = partialResult.progressPercentage
              } else {
                // Calculate progress based on which parts of the analysis are complete
                let completedSections = 0
                const totalSections = 5 // rootCause, explanation, solutions, docs, packages

                if (partialResult.rootCause) completedSections++
                if (partialResult.solutions?.length) completedSections++
                if (partialResult.relatedDocs?.length) completedSections++
                if (partialResult.packages?.length) completedSections++
                if (partialResult.eli5) completedSections++

                progress = Math.min(95, (completedSections / totalSections) * 100)
              }

              // Update state with current analysis data and flags
              return {
                analysisProgress: progress,
                currentAnalysis: {
                  ...(state.currentAnalysis || {}),
                  ...partialResult
                } as ErrorAnalysisResult,
                hasRootCauseAnalysis: !!partialResult.rootCause || state.hasRootCauseAnalysis,
                hasSolutionSteps: !!partialResult.solutions?.length || state.hasSolutionSteps,
                hasRelatedDocs: !!partialResult.relatedDocs?.length || state.hasRelatedDocs,
                hasPackages: !!partialResult.packages?.length || state.hasPackages
              }
            })

            // Notify parent of updates
            onAction('analysis-update')
          }

          // Initial analysis
          await aiService.analyzeInitialErrorAnalysis(error, trackAnalysisProgress)

          // Fetch additional data
          try {
            const enhancedResult = await aiService.fetchAdditionalErrorData(error)

            // Update GitHub issues atomically if available
            if (enhancedResult.githubIssues?.length) {
              set(state => {
                if (!state.currentAnalysis) return state

                return {
                  currentAnalysis: {
                    ...state.currentAnalysis,
                    githubIssues: enhancedResult.githubIssues
                  },
                  hasGithubIssues: true
                }
              })

              // Notify parent of update
              onAction('analysis-update')
            }
          } catch (enhancementErr) {
            logger.error('Error fetching additional data:', enhancementErr)
            set({ hasGithubIssues: true })
          }

        } catch (err) {
          logger.error('Error analyzing error:', err)

          // Set error state
          set({
            analysisError: err instanceof Error ? err.message : 'Unable to analyze this error',
            isAnalyzing: false
          })

          // Notify parent
          onAction('analysis-error', {
            name: error.name,
            message: err instanceof Error ? err.message : String(err),
            stack: error.stack
          })
        } finally {
          // Ensure analysis is marked complete
          set({ isAnalyzing: false })
        }
      },

      // Reset analysis state
      resetAnalysis: () => set({
        currentAnalysis: null,
        messages: [],
        analysisError: null,
        hasRootCauseAnalysis: false,
        hasSolutionSteps: false,
        hasRelatedDocs: false,
        hasPackages: false,
        hasGithubIssues: false,
        analysisProgress: 0
      }),

      // Update solution with atomic update
      updateSolution: (index, updates) => {
        set(state => {
          if (!state.currentAnalysis?.solutions) return state

          const updatedSolutions = [...state.currentAnalysis.solutions]

          if (index < 0 || index >= updatedSolutions.length) {
            logger.error(`Invalid solution index: ${index}`)
            return state
          }

          updatedSolutions[index] = {
            ...updatedSolutions[index],
            ...updates
          }

          return {
            currentAnalysis: {
              ...state.currentAnalysis,
              solutions: updatedSolutions
            }
          }
        })
      }
    }),
    {
      name: 'ai-chat-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        // Only persist messages to avoid storage size issues
        messages: state.messages
      })
    }
  )
) 