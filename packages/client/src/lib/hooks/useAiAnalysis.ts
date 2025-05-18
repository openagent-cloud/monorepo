import { useMutation } from '@tanstack/react-query'
import { aiService } from '@/lib/ai.service'
import type { ErrorAnalysisResult, ErrorPayload, ChatCompletionParams } from '@/lib/ai.service'

/**
 * Hook for analyzing errors with AI using TanStack Query
 */
export function useErrorAnalysis() {
  const analyzeErrorMutation = useMutation({
    mutationFn: async (error: ErrorPayload) => {
      return aiService.analyzeInitialErrorAnalysis(error)
    },
    onError: (error) => {
      console.error('Error analyzing error:', error)
    }
  })

  const fetchAdditionalDataMutation = useMutation({
    mutationFn: async (error: ErrorPayload) => {
      return aiService.fetchAdditionalErrorData(error)
    },
    onError: (error) => {
      console.error('Error fetching additional data:', error)
    }
  })

  /**
   * Analyze an error with streaming progress updates
   */
  const analyzeErrorWithProgress = async (
    error: ErrorPayload,
    onProgressUpdate?: (partialResult: ErrorAnalysisResult) => void
  ) => {
    try {
      return await aiService.analyzeInitialErrorAnalysis(error, onProgressUpdate)
    } catch (err) {
      console.error('Error in analyzeErrorWithProgress:', err)
      throw err
    }
  }

  return {
    analyzeError: analyzeErrorMutation.mutateAsync,
    isAnalyzing: analyzeErrorMutation.isPending,
    analysisError: analyzeErrorMutation.error,
    analysisData: analyzeErrorMutation.data,

    fetchAdditionalData: fetchAdditionalDataMutation.mutateAsync,
    isFetchingAdditionalData: fetchAdditionalDataMutation.isPending,
    additionalDataError: fetchAdditionalDataMutation.error,
    additionalData: fetchAdditionalDataMutation.data,

    // Special method for streaming progress
    analyzeErrorWithProgress
  }
}

/**
 * Hook for AI chat completions using TanStack Query
 */
export function useAiChat() {
  const chatCompletionMutation = useMutation({
    mutationFn: async (params: ChatCompletionParams) => {
      return aiService.getChatCompletion(params)
    },
    onError: (error) => {
      console.error('Error getting chat completion:', error)
    }
  })

  return {
    sendMessage: chatCompletionMutation.mutateAsync,
    isSending: chatCompletionMutation.isPending,
    error: chatCompletionMutation.error,
    data: chatCompletionMutation.data
  }
} 