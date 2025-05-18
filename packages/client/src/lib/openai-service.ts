/**
 * DEPRECATED - Use ai.service.ts instead
 * This file is kept for reference but should not be used in new code.
 * All functionality has been migrated to ai.service.ts which provides a more
 * consistent interface with better streaming support and error handling.
 */

/*
import { createLogger } from './logger'

const logger = createLogger('openai-service')

/**
 * Check if OpenAI API key is available in the environment
 */
export function hasCredentialsForProxy(): boolean {
  const hasKey = !!import.meta.env.VITE_TENANT_SECRET

  if (!hasKey) {
    logger.info('AI Proxy/Credential API key not found. AI Analysis feature is disabled. Add VITE_TENANT_SECRET to your .env file to enable it.')
  }

  return hasKey
}

/**
 * OpenAI service for analyzing errors
 */
export async function analyzeError(
  errorName: string,
  errorMessage: string,
  stackTrace: string,
  callbacks?: {
    onToken?: (token: string) => void
    onComplete?: (fullText: string) => void
    onError?: (error: Error) => void
    model?: string
  }
): Promise<string> {
  if (!hasCredentialsForProxy()) {
    throw new Error('OpenAI API key is not configured')
  }

  const apiKey = import.meta.env.VITE_TENANT_SECRET
  const model = callbacks?.model || 'gpt-4o'

  try {
    // Prepare the prompt with error information
    const prompt = `I encountered the following error in my JavaScript/TypeScript code:
Error Name: ${errorName}
Error Message: ${errorMessage}
Stack Trace:
${stackTrace}

Please analyze this error. Explain what it means, what might have caused it, and how I can fix it. 
Include code examples if applicable.
After your explanation, include a section with debugging steps to resolve this issue.`

    // Create headers with API key
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }

    // Stream the tokens if a token callback is provided
    if (callbacks?.onToken) {
      const streamingResponse = await fetch('http://localhost:5860/proxy/openai/stream', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          stream: true
        })
      })

      if (!streamingResponse.ok) {
        const error = await streamingResponse.json().catch(() => null)
        throw new Error(`OpenAI API error: ${error?.error?.message || streamingResponse.statusText}`)
      }

      const reader = streamingResponse.body?.getReader()
      const decoder = new TextDecoder()
      let result = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n').filter(line => line.trim() !== '')

          for (const line of lines) {
            if (line.includes('[DONE]')) continue
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue

              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content
                if (content && callbacks.onToken) {
                  result += content
                  callbacks.onToken(content)
                }
              } catch {
                // Skip parse errors for non-JSON lines
              }
            }
          }
        }
      }

      if (callbacks.onComplete) {
        callbacks.onComplete(result)
      }

      return result
    } else {
      // Non-streaming response
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }]
        })
      })

      if (!response.ok) {
        const error = await response.json().catch(() => null)
        throw new Error(`OpenAI API error: ${error?.error?.message || response.statusText}`)
      }

      const data = await response.json()
      const result = data.choices?.[0]?.message?.content || 'No analysis available'

      if (callbacks?.onComplete) {
        callbacks.onComplete(result)
      }

      return result
    }
  } catch (error) {
    if (callbacks?.onError && error instanceof Error) {
      callbacks.onError(error)
    }
    throw error
  }
}
*/ 