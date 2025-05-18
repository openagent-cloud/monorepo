import { createLogger } from '@/lib/logger'

const logger = createLogger('AIService')

// Types for error analysis
export type ErrorPayload = {
  name: string
  message: string
  stack: string
}

export type SolutionStep = {
  title: string
  description: string
  code?: string
  completed?: boolean
}

export type RelatedDoc = {
  title: string
  url: string
}

export type GitHubIssue = {
  title: string
  url: string
  repo: string
  state: 'open' | 'closed'
  commentsCount: number
  createdAt: string
  packageName?: string
}

export type PackageInfo = {
  name: string
  version?: string
  count: number
  repoUrl?: string
  relevanceScore?: number // 0-100 score showing how likely this package is related to the error
  commonIssues?: string[] // Common issues with this package
  compatibilityInfo?: string // Information about compatibility with other packages
  relatedIssues?: GitHubIssue[] // GitHub issues related to this package and the current error
}

export type ErrorAnalysisResult = {
  rootCause: string
  explanation: string
  solutions: SolutionStep[]
  relatedDocs: RelatedDoc[]
  packages?: PackageInfo[]
  githubIssues?: GitHubIssue[] // GitHub issues related to the error (not package-specific)
  eli5?: string // Simple explanation for beginners
  streamComplete?: boolean // Flag to indicate stream completion
  progressPercentage?: number // Percentage of completion during streaming (0-100)
}

export type ChatCompletionParams = {
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }>
  temperature?: number
  stream?: boolean
}

// Common package repositories - for packages we know well, to avoid API calls
const KNOWN_REPOS: Record<string, string> = {
  'react': 'https://github.com/facebook/react',
  'react-dom': 'https://github.com/facebook/react',
  'next': 'https://github.com/vercel/next.js',
  'vue': 'https://github.com/vuejs/vue',
  'angular': 'https://github.com/angular/angular',
  'express': 'https://github.com/expressjs/express',
  'lodash': 'https://github.com/lodash/lodash',
  'axios': 'https://github.com/axios/axios',
  'redux': 'https://github.com/reduxjs/redux',
  'typescript': 'https://github.com/microsoft/TypeScript',
  'jest': 'https://github.com/facebook/jest',
  'tailwindcss': 'https://github.com/tailwindlabs/tailwindcss',
  'mui': 'https://github.com/mui/material-ui',
  '@mui/material': 'https://github.com/mui/material-ui',
  'styled-components': 'https://github.com/styled-components/styled-components',
  'webpack': 'https://github.com/webpack/webpack',
  'babel': 'https://github.com/babel/babel',
  'eslint': 'https://github.com/eslint/eslint',
  'prettier': 'https://github.com/prettier/prettier',
  '@emotion/react': 'https://github.com/emotion-js/emotion',
  '@emotion/styled': 'https://github.com/emotion-js/emotion',
  'vite': 'https://github.com/vitejs/vite',
  'rollup': 'https://github.com/rollup/rollup',
  'esbuild': 'https://github.com/evanw/esbuild'
}

// Common package issues
const COMMON_PACKAGE_ISSUES: Record<string, string[]> = {
  'react': [
    'React version conflicts with React DOM',
    'Hook rules violations',
    'Missing dependency arrays in useEffect',
    'State updates on unmounted components'
  ],
  'react-dom': [
    'Version mismatch with React core',
    'Hydration errors in server-side rendering',
    'Event handling inconsistencies'
  ],
  'next': [
    'API route handler issues',
    'Static generation vs server-side rendering conflicts',
    'Routing configuration issues',
    'Image optimization problems'
  ],
  'typescript': [
    'Type compatibility issues',
    'Missing type definitions',
    'Strict null checking problems',
    'Interface vs type alias confusion'
  ],
  'webpack': [
    'Module resolution issues',
    'Loader configuration problems',
    'Bundle size optimization issues',
    'Asset processing errors'
  ],
  'babel': [
    'Preset configuration issues',
    'Plugin conflicts',
    'Compatibility with TypeScript',
    'Transform errors for newer syntax'
  ]
}

// Common compatibility issues
const COMPATIBILITY_INFO: Record<string, string> = {
  'react': 'React 18+ requires compatible versions of react-dom and other React ecosystem packages',
  'react-dom': 'Must match exact version of React core',
  'next': 'Specific versions of Next.js may require particular React versions',
  'styled-components': 'May have issues with React 18 concurrent features',
  '@emotion/react': 'Should be used with matching @emotion/styled version',
  'webpack': 'Webpack 5 introduced breaking changes from Webpack 4',
  'babel': 'Babel 7 requires modern preset/plugin naming (@babel/*)'
}

// GitHub issue API response type
interface GitHubIssueApiResponse {
  title: string
  html_url: string
  state: 'open' | 'closed'
  comments: number
  created_at: string
  // Additional fields that might be present but we don't use directly
  body?: string
  user?: { login: string }
  number?: number
  labels?: { name: string }[]
  reactions?: Record<string, number>
}

// GitHub search API response
interface GitHubSearchApiResponse {
  items?: GitHubIssueApiResponse[]
  total_count?: number
  incomplete_results?: boolean
}

class AIService {
  private apiKey: string | null = null
  private tenantSecret: string | null = null
  private apiUrl = 'http://localhost:5860/proxy/openai/stream'
  private model = 'gpt-4'
  private cachedAnalysis: ErrorAnalysisResult | null = null

  constructor() {
    // Try to get tenant secret from environment variables
    this.tenantSecret = import.meta.env.VITE_TENANT_SECRET || null

    if (!this.tenantSecret) {
      logger.warn('Tenant secret not found. AI features will be limited to demo mode.')
    } else {
      logger.info('Tenant secret found. AI features enabled.')
    }
  }

  isEnabled(): boolean {
    // Always return true for testing purposes
    // In a production environment, this would check for a valid secret
    return true // this.tenantSecret !== null
  }

  // Fetch repository URL for a package from npm registry
  private async fetchPackageRepo(packageName: string): Promise<string | undefined> {
    // If it's a known package, return the known repo URL
    if (KNOWN_REPOS[packageName]) {
      return KNOWN_REPOS[packageName]
    }

    try {
      // Remove version information if present (e.g., @1.2.3)
      const cleanName = packageName.replace(/@[\d.]+$/, '')

      // Normalize scoped packages for the URL (e.g., @org/package -> @org%2Fpackage)
      const encodedName = encodeURIComponent(cleanName)

      const response = await fetch(`https://registry.npmjs.org/${encodedName}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        return undefined
      }

      const data = await response.json()

      // Extract repository URL
      const repo = data.repository
      if (!repo) return undefined

      if (typeof repo === 'string') return repo

      // Usually repo is an object with url property
      if (repo.url) {
        // Clean up git URLs
        let repoUrl = repo.url
          .replace(/^git\+/, '')
          .replace(/^git:\/\//, 'https://')
          .replace(/\.git$/, '')

        // Convert ssh format to https
        if (repoUrl.startsWith('git@github.com:')) {
          repoUrl = repoUrl.replace('git@github.com:', 'https://github.com/')
        }

        return repoUrl
      }

      return undefined
    } catch (error) {
      logger.error(`Error fetching repository for ${packageName}:`, error)
      return undefined
    }
  }

  // Extract NPM packages from stack trace
  private extractPackages(stackTrace: string, errorName: string, errorMessage: string): PackageInfo[] {
    // Common patterns for node_modules paths in stack traces
    const nodeModulesRegex = /node_modules\/([^/]+)\/?([^/]+)?/g
    const packageVersionRegex = /(@[\d.]+)/

    const packagesMap = new Map<string, PackageInfo>()
    const errorText = `${errorName} ${errorMessage}`.toLowerCase()

    // Match all occurrences
    let match: RegExpExecArray | null

    // Try the first pattern (node_modules/package)
    while ((match = nodeModulesRegex.exec(stackTrace)) !== null) {
      let packageName = match[1]
      const subpackage = match[2]

      // Handle scoped packages (@org/package)
      if (packageName.startsWith('@')) {
        if (subpackage) {
          packageName = `${packageName}/${subpackage}`
        }
      }

      // Extract version if present
      let version: string | undefined
      const versionMatch = packageName.match(packageVersionRegex)
      if (versionMatch) {
        version = versionMatch[1]
        packageName = packageName.replace(packageVersionRegex, '')
      }

      // Calculate an initial relevance score based on position in stack trace
      // Earlier in stack trace generally means more likely to be related to the error
      const position = match.index || 0
      const positionScore = Math.max(0, 100 - Math.min(position / 10, 75))

      // Check if package name appears in error message or name
      const nameInError = errorText.includes(packageName.toLowerCase())
      const relevanceBoost = nameInError ? 50 : 0

      // Final relevance score (capped at 100)
      const relevanceScore = Math.min(100, positionScore + relevanceBoost)

      // Get common issues and compatibility info
      const commonIssues = COMMON_PACKAGE_ISSUES[packageName]
      const compatibilityInfo = COMPATIBILITY_INFO[packageName]

      // Update package count
      if (packagesMap.has(packageName)) {
        const info = packagesMap.get(packageName)!
        info.count++
        // Increase relevance when a package appears multiple times
        info.relevanceScore = Math.min(100, (info.relevanceScore || 0) + 10)
        packagesMap.set(packageName, info)
      } else {
        packagesMap.set(packageName, {
          name: packageName,
          version,
          count: 1,
          relevanceScore,
          commonIssues,
          compatibilityInfo
        })
      }
    }

    // Convert map to array and sort by relevance score (descending), then by count
    return Array.from(packagesMap.values())
      .sort((a, b) => {
        const scoreA = a.relevanceScore || 0
        const scoreB = b.relevanceScore || 0
        if (scoreA !== scoreB) return scoreB - scoreA
        return b.count - a.count
      })
      .slice(0, 10) // Limit to top 10 packages
  }

  // Fast initial analysis without GitHub issues or package details
  // Add optional onProgressUpdate callback parameter for streaming
  async analyzeInitialErrorAnalysis(
    error: ErrorPayload,
    onProgressUpdate?: (partialResult: ErrorAnalysisResult) => void
  ): Promise<ErrorAnalysisResult> {
    logger.info('AI Service analyzeInitialErrorAnalysis called', error)
    console.log('AI Service analyzeInitialErrorAnalysis called', error)

    if (!this.tenantSecret) {
      logger.info('No tenant secret, using simulated response')
      console.log('No tenant secret, using simulated response')

      // For demo mode, simulate streaming updates
      if (onProgressUpdate) {
        const simulatedResult = this.getSimulatedErrorAnalysis(error)

        // Simulate progressive streaming by revealing parts of the result over time
        const partialResult: ErrorAnalysisResult = {
          rootCause: "",
          explanation: "",
          solutions: [],
          relatedDocs: [],
          packages: simulatedResult.packages || [] // Include packages right from the start
        }

        // First update - root cause only (25%)
        setTimeout(() => {
          partialResult.rootCause = simulatedResult.rootCause
          onProgressUpdate({ ...partialResult })
        }, 500)

        // Second update - add explanation (40%)
        setTimeout(() => {
          partialResult.explanation = simulatedResult.explanation
          onProgressUpdate({ ...partialResult })
        }, 1200)

        // Third update - add one solution (55%) 
        setTimeout(() => {
          if (simulatedResult.solutions.length > 0) {
            partialResult.solutions = [simulatedResult.solutions[0]]
          }
          onProgressUpdate({ ...partialResult })
        }, 1800)

        // Fourth update - add more solutions (70%)
        setTimeout(() => {
          if (simulatedResult.solutions.length > 1) {
            partialResult.solutions = simulatedResult.solutions.slice(0, 2)
          }
          onProgressUpdate({ ...partialResult })
        }, 2200)

        // Fifth update - all solutions (80%)
        setTimeout(() => {
          partialResult.solutions = simulatedResult.solutions
          onProgressUpdate({ ...partialResult })
        }, 2500)

        // Sixth update - docs (90%)
        setTimeout(() => {
          partialResult.relatedDocs = simulatedResult.relatedDocs
          onProgressUpdate({ ...partialResult })
        }, 3000)

        // Final update - everything (100%)
        setTimeout(() => {
          partialResult.eli5 = simulatedResult.eli5
          partialResult.githubIssues = simulatedResult.githubIssues

          // Add the streamComplete flag to signal completion
          const completeResult = {
            ...partialResult,
            streamComplete: true
          };

          onProgressUpdate(completeResult);
        }, 3500)
      }

      const result = this.getSimulatedErrorAnalysis(error)
      this.cachedAnalysis = result
      return result
    }

    // Continue with normal analysis but skip GitHub issues
    try {
      // Extract packages from the stack trace with error context
      const packages = this.extractPackages(error.stack, error.name, error.message)

      // Initialize a partial result for streaming updates
      let partialResult: ErrorAnalysisResult | null = null

      if (onProgressUpdate) {
        partialResult = {
          rootCause: "",
          explanation: "",
          solutions: [],
          relatedDocs: [],
          packages: []
        }

        // Send the first update with just the packages
        partialResult.packages = packages
        onProgressUpdate({ ...partialResult })
      }

      const systemPrompt = `You are an AI assistant specialized in analyzing JavaScript/TypeScript errors.
Analyze the provided error details and provide:
1. A concise root cause (one sentence)
2. A detailed explanation (2-3 sentences)
3. 2-3 practical solutions (with code examples)
4. Related documentation links
5. An "Explain Like I'm 5" (ELI5) explanation that uses simple language and analogies for beginners to describe the following error: ${error.message}

Format the response as a JSON object with the following structure:
{
  "rootCause": "string",
  "explanation": "string",
  "solutions": [
    {
      "title": "string",
      "description": "string",
      "code": "string" // optional
    }
  ],
  "relatedDocs": [
    {
      "title": "string",
      "url": "string"
    }
  ],
  "eli5": "string" // simple, beginner-friendly explanation using metaphors if possible
}`

      const errorDetails = `
Error Name: ${error.name}
Error Message: ${error.message}
Stack Trace: 
${error.stack}
      `

      try {
        // Configure streaming if supported and a progress callback is provided
        const shouldStream = !!onProgressUpdate

        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.tenantSecret}`
          },
          body: JSON.stringify({
            payload: {
              model: this.model,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: errorDetails }
              ],
              temperature: 0.3,
              stream: shouldStream
            }
          })
        })

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          logger.error(`API request failed with status: ${response.status}`, errorText);
          const errorMessages = {
            400: 'Invalid request format',
            401: 'Authentication failed - please check your API key',
            403: 'Access forbidden - your API key may not have sufficient permissions',
            404: 'API endpoint not found',
            429: 'Rate limit exceeded - please try again later',
            500: 'Server error - the AI service is currently experiencing issues',
            502: 'Bad gateway - the AI service is currently unavailable',
            503: 'Service unavailable - the AI service is temporarily down',
            504: 'Gateway timeout - the AI service took too long to respond'
          };
          throw new Error(errorMessages[response.status as keyof typeof errorMessages] || `API request failed with status: ${response.status}`);
        }

        // Handle streaming response if requested
        if (shouldStream && onProgressUpdate && response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          let partialContent = '';
          let isComplete = false;

          // Initialize the partial result with the packages we've already extracted
          if (!partialResult) {
            partialResult = {
              rootCause: "",
              explanation: "",
              solutions: [],
              relatedDocs: [],
              packages
            }
          }

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              // Decode the chunk and add to buffer
              const chunk = decoder.decode(value, { stream: true });
              buffer += chunk;

              // Look for data: prefixed lines which contain the actual content
              const lines = buffer.split('\n');
              buffer = lines.pop() || ''; // Keep the last line which might be incomplete

              for (const line of lines) {
                // Check if it's a data line
                if (line.startsWith('data: ')) {
                  const data = line.slice(6); // Remove 'data: ' prefix

                  // When we get the [DONE] message, this means the stream is complete
                  if (data === '[DONE]') {
                    isComplete = true;

                    // Create a "complete" result with all accumulated data
                    const completeResult = {
                      ...partialResult,
                      // Add a special flag to indicate stream completion
                      streamComplete: true
                    };

                    // Send one final update with complete flag to trigger UI updates
                    onProgressUpdate(completeResult);
                    break;
                  }

                  try {
                    // Try to parse the JSON
                    const parsed = JSON.parse(data);

                    const content = parsed.choices?.[0]?.delta?.content || '';

                    if (content) {
                      partialContent += content;

                      // Instead of trying to parse partial JSON, just update progress based on length
                      // This is a simpler, more reliable approach
                      let progressPercentage = 0;

                      // More characters = more progress, capped at 95%
                      const contentLength = partialContent.length;
                      if (contentLength > 0) {
                        // Assuming an average complete response is around 1000-2000 chars
                        progressPercentage = Math.min(95, Math.floor(contentLength / 20));

                        // Send regular progress updates but don't try to parse partial JSON
                        onProgressUpdate({
                          ...partialResult,
                          progressPercentage
                        });
                      }
                    }
                  } catch {
                    // Silent - expected for partial JSON chunks
                  }
                }
              }

              if (isComplete) break;
            }
          } catch (streamError) {
            logger.error('Error reading stream:', streamError);
            // Fall back to non-streaming approach if streaming fails
          }

          // Once we're done streaming, try to parse the full content
          try {
            // Wait until we have a complete JSON object with closing brace
            if (partialContent.includes('{') && partialContent.includes('}')) {
              // Find the outermost JSON object
              const startIdx = partialContent.indexOf('{');
              const endIdx = partialContent.lastIndexOf('}') + 1;

              if (startIdx >= 0 && endIdx > startIdx) {
                const jsonStr = partialContent.substring(startIdx, endIdx);
                try {
                  const finalResult = JSON.parse(jsonStr);

                  // Apply all the final result fields
                  partialResult = {
                    ...partialResult,
                    rootCause: finalResult.rootCause || partialResult.rootCause || "",
                    explanation: finalResult.explanation || partialResult.explanation || "",
                    solutions: finalResult.solutions || partialResult.solutions || [],
                    relatedDocs: finalResult.relatedDocs || partialResult.relatedDocs || [],
                    eli5: finalResult.eli5 || partialResult.eli5 || "",
                    packages: partialResult.packages // Keep the packages we extracted
                  };

                  // Signal completion
                  onProgressUpdate({
                    ...partialResult,
                    streamComplete: true
                  });
                } catch (jsonError) {
                  logger.error('Error parsing final JSON:', jsonError);
                }
              }
            }
          } catch (finalError) {
            logger.error('Error with final parsing:', finalError);
          }

          // Cache the analysis result
          this.cachedAnalysis = partialResult;

          // Return what we have so far
          return partialResult;
        }

        // Non-streaming response handling (or fallback if streaming fails)
        const data = await response.json()
        const content = data.choices[0]?.message?.content

        if (!content) {
          throw new Error('The AI service returned an empty response')
        }

        try {
          // Parse the JSON response
          const analysisResult = JSON.parse(content)

          // Store basic packages info without GitHub issues
          const initialResult = {
            ...analysisResult,
            packages
          } as ErrorAnalysisResult

          // Cache the result for later enhancement
          this.cachedAnalysis = initialResult
          return initialResult

        } catch (parseError) {
          logger.error('Failed to parse AI response:', parseError)
          throw new Error('The AI service returned an invalid response format')
        }
      } catch (fetchError) {
        if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
          logger.error('Network error while connecting to AI service:', fetchError)
          throw new Error('Network error - unable to connect to the AI service. Please check your internet connection.')
        }
        throw fetchError
      }
    } catch (error) {
      logger.error('Error analyzing with OpenAI:', error)
      // Only use simulated response as fallback for certain error types
      if (error instanceof Error && (
        error.message.includes('API request failed') ||
        error.message.includes('Network error') ||
        error.message.includes('parse')
      )) {
        // For API errors, network issues, or parsing problems, use simulated response
        const result = this.getSimulatedErrorAnalysis(error as Error)
        this.cachedAnalysis = result
        return result
      }
      // For other errors, propagate to the UI for better error reporting
      throw error
    }
  }

  // Fetch additional data like GitHub issues to enhance the initial analysis
  async fetchAdditionalErrorData(error: ErrorPayload): Promise<{ githubIssues?: GitHubIssue[] }> {
    logger.info('AI Service fetchAdditionalErrorData called', error)
    console.log('AI Service fetchAdditionalErrorData called', error)

    if (!this.tenantSecret) {
      // Simulate a delay for realistic behavior
      await new Promise(resolve => setTimeout(resolve, 1500))
      return { githubIssues: this.getSimulatedGithubIssues(null, error.name) }
    }

    try {
      // Use cached packages if available
      const packages = this.cachedAnalysis?.packages ||
        this.extractPackages(error.stack, error.name, error.message)

      // Search for GitHub issues related to the error
      const issueSearchResults = await this.searchGitHubIssues(error.name, error.message, packages)

      // Return only the GitHub issues - we'll merge them with the existing analysis
      return { githubIssues: issueSearchResults.generalIssues }
    } catch (err) {
      logger.error('Error fetching additional data:', err)
      // Safely handle the error - default to basic simulated GitHub issues
      return { githubIssues: this.getSimulatedGithubIssues(null, error.name) }
    }
  }

  // Original method kept for backward compatibility
  async analyzeError(error: ErrorPayload): Promise<ErrorAnalysisResult> {
    logger.info('AI Service analyzeError called', error)
    console.log('AI Service analyzeError called', error)

    if (!this.tenantSecret) {
      logger.info('No tenant secret, using simulated response')
      console.log('No tenant secret, using simulated response')
      return this.getSimulatedErrorAnalysis(error)
    }

    try {
      // Extract packages from the stack trace with error context
      const packages = this.extractPackages(error.stack, error.name, error.message)

      // Fetch repository URLs for packages (limit to top 5 to prevent too many requests)
      const topPackages = packages.slice(0, 5)
      await Promise.all(
        topPackages.map(async (pkg) => {
          pkg.repoUrl = await this.fetchPackageRepo(pkg.name)
        })
      )

      // Search for GitHub issues related to the error
      const issueSearchResults = await this.searchGitHubIssues(error.name, error.message, packages)

      // Add GitHub issues to packages
      for (const [pkgName, issues] of issueSearchResults.packageIssues.entries()) {
        const pkg = packages.find(p => p.name === pkgName)
        if (pkg) {
          pkg.relatedIssues = issues
        }
      }

      const systemPrompt = `You are an AI assistant specialized in analyzing JavaScript/TypeScript errors.
Analyze the provided error details and provide:
1. A concise root cause (one sentence)
2. A detailed explanation (2-3 sentences)
3. 2-3 practical solutions (with code examples)
4. Related documentation links
5. An "Explain Like I'm 5" (ELI5) explanation that uses simple language and analogies for beginners to describe the following error: ${error.message}

Format the response as a JSON object with the following structure:
{
  "rootCause": "string",
  "explanation": "string",
  "solutions": [
    {
      "title": "string",
      "description": "string",
      "code": "string" // optional
    }
  ],
  "relatedDocs": [
    {
      "title": "string",
      "url": "string"
    }
  ],
  "eli5": "string" // simple, beginner-friendly explanation using metaphors if possible
}`

      const errorDetails = `
Error Name: ${error.name}
Error Message: ${error.message}
Stack Trace: 
${error.stack}
      `

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.tenantSecret}`
        },
        body: JSON.stringify({
          payload: {
            model: this.model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: errorDetails }
            ],
            temperature: 0.3
          }
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content

      if (!content) {
        throw new Error('No content in response')
      }

      try {
        // Parse the JSON response
        const analysisResult = JSON.parse(content)

        // Add the extracted packages and GitHub issues to the result
        return {
          ...analysisResult,
          packages,
          githubIssues: issueSearchResults.generalIssues
        } as ErrorAnalysisResult
      } catch (error) {
        logger.error('Failed to parse AI response:', error)
        throw new Error('Failed to parse AI response')
      }
    } catch (error) {
      logger.error('Error analyzing with OpenAI:', error)
      return this.getSimulatedErrorAnalysis(error as Error)
    }
  }

  async getChatCompletion(params: ChatCompletionParams): Promise<string> {
    if (!this.tenantSecret) {
      return this.getSimulatedChatResponse(params.messages)
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.tenantSecret}`
        },
        body: JSON.stringify({
          payload: {
            model: this.model,
            messages: params.messages,
            temperature: params.temperature || 0.7
          }
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response'
    } catch (error) {
      logger.error('Error with chat completion:', error)
      return this.getSimulatedChatResponse(params.messages)
    }
  }

  // Provides simulated responses for demo when API key isn't available
  private getSimulatedErrorAnalysis(error: ErrorPayload | Error): ErrorAnalysisResult {
    logger.info('Generating simulated error analysis')
    console.log('Generating simulated error analysis')

    // Extract error properties regardless of input type
    const errorName = error instanceof Error ? error.name : (error as ErrorPayload).name
    const errorMessage = error instanceof Error ? error.message : (error as ErrorPayload).message

    // Extract packages if we have a stack trace
    const stack = error instanceof Error ? error.stack || '' : (error as ErrorPayload).stack || ''
    const packages = this.extractPackages(stack, errorName, errorMessage)

    // Add some simulated repo URLs for demo purposes
    if (packages.length > 0) {
      for (const pkg of packages.slice(0, 3)) {
        pkg.repoUrl = KNOWN_REPOS[pkg.name] || `https://github.com/example/${pkg.name}`

        // Add relevance scores based on position in the extraction (first ones have higher relevance)
        const index = packages.indexOf(pkg)
        pkg.relevanceScore = Math.max(20, 100 - (index * 15))

        // Add common issues if available in our dictionary
        pkg.commonIssues = COMMON_PACKAGE_ISSUES[pkg.name]

        // Add compatibility info if available
        pkg.compatibilityInfo = COMPATIBILITY_INFO[pkg.name]

        // Add simulated GitHub issues
        if (index === 0) {
          pkg.relatedIssues = this.getSimulatedGithubIssues(pkg.name, errorName)
        }
      }
    }

    // Generate simulated general GitHub issues
    const githubIssues = this.getSimulatedGithubIssues(null, errorName)

    // Generate mock error analysis results for the demo
    let rootCause = ""
    let explanation = ""
    let solutions: SolutionStep[] = []
    let relatedDocs: RelatedDoc[] = []
    let eli5 = ""

    // Generate appropriate mock responses based on error type
    if (errorName.includes("TypeError") && errorMessage.includes("undefined")) {
      rootCause = "Attempting to access a property or method on an undefined value."
      explanation = "This happens when you try to access a property on a variable that is undefined. The error occurs because undefined is not an object and doesn't have any properties or methods."
      solutions = [
        {
          title: "Add a null check before accessing the property",
          description: "Use optional chaining or a conditional check to ensure the object exists before accessing its properties.",
          code: `// Instead of this:
const value = object.property.nestedProperty;

// Use optional chaining (ES2020+):
const value = object?.property?.nestedProperty;

// Or traditional null checks:
const value = object && object.property && object.property.nestedProperty;`
        },
        {
          title: "Initialize the variable before using it",
          description: "Make sure the variable is properly initialized with a default value before attempting to use it.",
          code: `// Initialize with default empty object
const object = data || {};

// Or with default values for specific properties
const { property = 'default' } = object || {};`
        },
        {
          title: "Check function parameters",
          description: "If the undefined value is coming from a function parameter, add parameter validation.",
          code: `function processData(data) {
  // Early return or throw error if data is missing
  if (!data) {
    return null; // or throw new Error('Data is required');
  }
  
  // Now it's safe to work with data
  return data.property;
}`
        }
      ]
      relatedDocs = [
        {
          title: "Understanding JavaScript Errors",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors"
        },
        {
          title: "Optional Chaining (?.) Operator",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining"
        },
        {
          title: "Nullish Coalescing Operator (??)",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing"
        }
      ]
      eli5 = "Imagine you're trying to find a toy in a box that's inside another box, but one of the boxes is missing. You can't look inside something that isn't there! Always make sure each box exists before trying to open it."
    }
    else if (errorName.includes("SyntaxError")) {
      rootCause = "Invalid JavaScript syntax in your code."
      explanation = "The JavaScript parser couldn't understand your code because it contains syntax that doesn't follow the language rules. This could be missing brackets, quotes, semicolons, or other syntax errors."
      solutions = [
        {
          title: "Correct the syntax error",
          description: "Look for missing closing brackets, quotes, or parentheses near the line indicated in the error.",
          code: `// Instead of this (missing closing bracket):
function doSomething() {
  if (condition) {
    // code
  
// Fix it:
function doSomething() {
  if (condition) {
    // code
  }
}`
        },
        {
          title: "Use a linter or formatter",
          description: "Set up ESLint or Prettier in your project to automatically catch and fix syntax errors.",
          code: `// Install ESLint
npm install eslint --save-dev

// Initialize configuration
npx eslint --init

// Run ESLint to find syntax errors
npx eslint yourfile.js`
        }
      ]
      relatedDocs = [
        {
          title: "JavaScript Syntax Basics",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types"
        },
        {
          title: "ESLint Documentation",
          url: "https://eslint.org/docs/user-guide/getting-started"
        }
      ]
      eli5 = "Think of code like writing a letter, but you forgot to finish some of your sentences or put quotation marks where they belong. When someone tries to read it, they get confused because the sentences don't follow the rules of language. The computer feels the same way when your code has syntax errors!"
    }
    else if (errorName.includes("ReferenceError")) {
      rootCause = "Trying to use a variable or function that hasn't been defined."
      explanation = "This error occurs when you reference a variable or function that doesn't exist in the current scope. It might be misspelled, not yet defined, or defined in a different scope that's not accessible."
      solutions = [
        {
          title: "Check variable naming and scope",
          description: "Make sure the variable is defined before use and check for typos in variable names.",
          code: `// Define the variable before using it
const myVariable = 'some value';

// Check scope issues, especially with let and const
function myFunction() {
  let scopedVar = 'inside'; // only available inside this function
}

// This would cause a ReferenceError
// console.log(scopedVar);`
        },
        {
          title: "Import missing dependencies",
          description: "If you're trying to use an external library or component, make sure it's properly imported.",
          code: `// Make sure to import any external dependencies
import React from 'react';
import { someFunction } from './utils';

// Now you can use React and someFunction`
        }
      ]
      relatedDocs = [
        {
          title: "Variable Scope in JavaScript",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Variable_scope"
        },
        {
          title: "Understanding ReferenceError",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError"
        }
      ]
      eli5 = "Imagine you're asking someone to hand you a blue crayon, but there's no blue crayon on the table. The computer gets confused in the same way when you ask it to use something that doesn't exist yet or that you've called by the wrong name."
    }
    else {
      // Generic error analysis for any other error type
      rootCause = "An unexpected error occurred in your JavaScript code."
      explanation = "This error could be caused by various issues in your code, such as invalid operations, runtime conflicts, or logic errors. Review the error message and stack trace for more specific details."
      solutions = [
        {
          title: "Review the error context",
          description: "Look at the line number and code surrounding the error to identify the issue.",
          code: `// Add console logs to debug the problem
console.log('Variable value:', someVariable);
console.log('Object state:', JSON.stringify(someObject));

// Use try/catch to handle errors gracefully
try {
  // Problematic code
} catch (error) {
  console.error('Error details:', error);
  // Fallback behavior
}`
        },
        {
          title: "Check for common patterns",
          description: "Look for common issues like async/await misuse, improper API calls, or event handling issues.",
          code: `// Properly handle async operations
async function fetchData() {
  try {
    const response = await api.get('/data');
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    return []; // Fallback empty result
  }
}`
        }
      ]
      relatedDocs = [
        {
          title: "JavaScript Debugging Guide",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Debugging_JavaScript"
        },
        {
          title: "Error Handling in JavaScript",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling"
        }
      ]
      eli5 = "Sometimes computers get confused just like people do. Think of it like following a recipe but finding an instruction that doesn't make sense. The computer is telling you 'I don't understand what to do here' and needs your help to fix the instructions."
    }

    return {
      rootCause,
      explanation,
      solutions,
      relatedDocs,
      packages,
      githubIssues,
      eli5
    }
  }

  private getSimulatedChatResponse(messages: Array<{ role: string, content: string }>): string {
    // Get the last user message
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || ''

    if (lastUserMessage.toLowerCase().includes('fix') || lastUserMessage.toLowerCase().includes('solution')) {
      return `To fix this error, you should implement one of these solutions:

1. Use optional chaining:
\`\`\`js
const value = user?.profile?.preferences?.theme
\`\`\`

2. Add null checks:
\`\`\`js
if (user && user.profile && user.profile.preferences) {
  const theme = user.profile.preferences.theme
}
\`\`\`

3. Provide default values:
\`\`\`js
const theme = user?.profile?.preferences?.theme ?? 'light'
\`\`\`

The first option is the most modern and concise approach in JavaScript.`
    } else if (lastUserMessage.toLowerCase().includes('explain') || lastUserMessage.toLowerCase().includes('why')) {
      return `This error occurs because your code is trying to access a property on an object that doesn't exist (is undefined or null). 

In JavaScript, when you try to access a property of undefined or null, it throws a TypeError. This commonly happens with nested objects when you don't check if each level exists before accessing the next level.

For example, if you have code like \`user.profile.preferences.theme\` and either user, profile, or preferences is undefined/null, you'll get this error.`
    } else {
      return `I'll help you understand this error. The issue is that your code is trying to access a property on an object that doesn't exist (is undefined or null). This commonly happens with nested objects when you don't check if each level exists before accessing the next level.

Try using optional chaining (?.) or add null checks to prevent this error from occurring again. Let me know if you need more specific help with your code!`
    }
  }

  // Search for GitHub issues related to the error and package
  private async searchGitHubIssues(errorName: string, errorMessage: string, packages: PackageInfo[]): Promise<{
    generalIssues: GitHubIssue[],
    packageIssues: Map<string, GitHubIssue[]>
  }> {
    // Normalize error message for search - remove any code-specific details
    const cleanErrorMessage = this.normalizeErrorMessage(errorMessage)
    const searchTerms = `${errorName} ${cleanErrorMessage}`.trim()

    if (!searchTerms || searchTerms.length < 6) {
      return { generalIssues: [], packageIssues: new Map() }
    }

    // Store issues by package
    const packageIssues = new Map<string, GitHubIssue[]>()
    let generalIssues: GitHubIssue[] = []

    try {
      // First, search for general issues with the error (not package-specific)
      const generalSearchQuery = encodeURIComponent(`${searchTerms} in:title,body type:issue`)
      const generalResponse = await fetch(`https://api.github.com/search/issues?q=${generalSearchQuery}&per_page=5&sort=reactions`)

      if (generalResponse.ok) {
        const data = await generalResponse.json() as GitHubSearchApiResponse
        generalIssues = data.items?.map(issue => this.mapGitHubIssue(issue)) || []
      }

      // Then search for issues in package repositories (limit to top 3 most relevant packages)
      const topPackages = packages
        .filter(pkg => pkg.relevanceScore && pkg.relevanceScore > 30 && pkg.repoUrl)
        .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
        .slice(0, 3)

      for (const pkg of topPackages) {
        if (!pkg.repoUrl) continue

        try {
          // Extract owner/repo from URL
          const repoUrlMatch = pkg.repoUrl.match(/github\.com\/([^/]+\/[^/]+)/)
          if (!repoUrlMatch) continue

          const repoPath = repoUrlMatch[1]
          const packageSearchQuery = encodeURIComponent(`repo:${repoPath} ${searchTerms} in:title,body type:issue`)

          const packageResponse = await fetch(`https://api.github.com/search/issues?q=${packageSearchQuery}&per_page=3&sort=reactions`)

          if (packageResponse.ok) {
            const data = await packageResponse.json() as GitHubSearchApiResponse
            const issues = data.items?.map(issue => this.mapGitHubIssue(issue, pkg.name)) || []

            if (issues.length > 0) {
              packageIssues.set(pkg.name, issues)
            }
          }
        } catch (error) {
          logger.error(`Error searching issues for package ${pkg.name}:`, error)
        }
      }

      return { generalIssues, packageIssues }
    } catch (error) {
      logger.error('Error searching GitHub issues:', error)
      return { generalIssues: [], packageIssues: new Map() }
    }
  }

  // Updated mapGitHubIssue method with proper types
  private mapGitHubIssue(issue: GitHubIssueApiResponse, packageName?: string): GitHubIssue {
    // Extract repo from HTML URL (format: https://github.com/owner/repo/issues/number)
    const repoMatch = issue.html_url.match(/github\.com\/([^/]+\/[^/]+)\/issues\//)
    const repo = repoMatch ? repoMatch[1] : 'unknown'

    return {
      title: issue.title,
      url: issue.html_url,
      repo,
      state: issue.state,
      commentsCount: issue.comments,
      createdAt: issue.created_at,
      packageName
    }
  }

  // Clean up error message for better search results
  private normalizeErrorMessage(message: string): string {
    // Remove file paths, line numbers, and code snippets
    return message
      .replace(/\([^)]*\)/g, '') // Remove text in parentheses
      .replace(/at .+:\d+:\d+/g, '') // Remove stack trace references
      .replace(/["'`][^"'`]*["'`]/g, '') // Remove quoted strings
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .slice(0, 100) // Limit length for search
  }

  // Generate simulated GitHub issues for demo mode
  private getSimulatedGithubIssues(packageName: string | null, errorName: string): GitHubIssue[] {
    // Only generate issues for known error types to make it realistic
    if (!['TypeError', 'ReferenceError', 'SyntaxError', 'RangeError'].some(type => errorName.includes(type))) {
      return []
    }

    // Generate repo based on package name
    const repo = packageName
      ? (KNOWN_REPOS[packageName]?.replace('https://github.com/', '') || `example/${packageName}`)
      : ['facebook/react', 'vercel/next.js', 'nodejs/node'][Math.floor(Math.random() * 3)]

    // Base issue templates
    const issueTemplates = [
      {
        title: `Fix ${errorName} when using ${packageName || 'JavaScript'}`,
        comments: Math.floor(Math.random() * 20) + 1,
        state: Math.random() > 0.3 ? 'closed' : 'open' as 'closed' | 'open',
      },
      {
        title: `[BUG] ${errorName} occurs in certain conditions`,
        comments: Math.floor(Math.random() * 15) + 1,
        state: Math.random() > 0.4 ? 'closed' : 'open' as 'closed' | 'open',
      },
      {
        title: `Unexpected ${errorName} in production builds`,
        comments: Math.floor(Math.random() * 30) + 1,
        state: Math.random() > 0.6 ? 'closed' : 'open' as 'closed' | 'open',
      }
    ]

    // Only return 1-2 issues for package-specific issues
    const count = packageName ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 3) + 1

    return issueTemplates.slice(0, count).map((template, index) => {
      // Create random date within last year
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 365))

      return {
        title: template.title,
        url: `https://github.com/${repo}/issues/${1000 + index}`,
        repo,
        state: template.state,
        commentsCount: template.comments,
        createdAt: date.toISOString(),
        packageName: packageName || undefined
      }
    })
  }
}

// Export a singleton instance
export const aiService = new AIService() 