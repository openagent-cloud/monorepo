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

    if (!this.tenantSecret) {
      throw new Error('Tenant secret not found. AI features are disabled.')
    }

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
1. A concise root cause (max 15 words, be very brief)
2. A detailed explanation (2-3 sentences)
3. 2-3 practical solutions (with code examples)
4. Related documentation links
5. A brief "Explain Like I'm 5" (ELI5) explanation (max 25 words) that uses simple language to describe: ${error.message}

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
  "eli5": "string" // Keep this brief (25 words max)
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
          let accumulatedContent = '';
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
                    // Parse the JSON data
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content || '';

                    if (content) {
                      // Accumulate the content to build the AI response parts
                      accumulatedContent += content; // Accumulate all content for possible full JSON parsing

                      if (content.includes('"rootCause"')) {
                        partialResult.rootCause += content;
                      } else if (content.includes('"explanation"')) {
                        partialResult.explanation += content;
                      } else if (content.includes('"solutions"')) {
                        // Start accumulating solutions
                        const solutionMatch = content.match(/("solutions"\s*:\s*\[)(.*)/);
                        if (solutionMatch && solutionMatch[2]) {
                          partialResult.solutions = [];
                        }
                      } else if (content.includes('"relatedDocs"')) {
                        // Start accumulating related docs
                        const docsMatch = content.match(/("relatedDocs"\s*:\s*\[)(.*)/);
                        if (docsMatch && docsMatch[2]) {
                          partialResult.relatedDocs = [];
                        }
                      } else if (content.includes('"eli5"')) {
                        const eli5Match = content.match(/("eli5"\s*:\s*")(.*)/);
                        if (eli5Match && eli5Match[2]) {
                          partialResult.eli5 = eli5Match[2];
                        }
                      }

                      // Try to extract complete JSON objects as they arrive
                      try {
                        // Check if we have accumulated content that looks like a complete JSON object
                        if (accumulatedContent.includes('{') && accumulatedContent.includes('}')) {
                          const jsonStr = accumulatedContent.substring(
                            accumulatedContent.indexOf('{'),
                            accumulatedContent.lastIndexOf('}') + 1
                          );
                          try {
                            const parsed = JSON.parse(jsonStr);
                            if (parsed.rootCause) {
                              partialResult.rootCause = parsed.rootCause;
                            }
                            if (parsed.explanation) {
                              partialResult.explanation = parsed.explanation;
                            }
                            if (parsed.solutions) {
                              partialResult.solutions = parsed.solutions;
                            }
                            if (parsed.relatedDocs) {
                              partialResult.relatedDocs = parsed.relatedDocs;
                            }
                            if (parsed.eli5) {
                              partialResult.eli5 = parsed.eli5;
                            }
                          } catch {
                            // Ignore JSON parsing errors for incomplete objects
                          }
                        }
                      } catch {
                        // Ignore parsing errors for incomplete JSON
                      }

                      // Calculate progress based on content received so far
                      let completedSections = 0;
                      const totalSections = 5; // rootCause, explanation, solutions, docs, eli5

                      if (partialResult.rootCause) completedSections++;
                      if (partialResult.explanation) completedSections++;
                      if (partialResult.solutions.length > 0) completedSections++;
                      if (partialResult.relatedDocs.length > 0) completedSections++;
                      if (partialResult.eli5) completedSections++;

                      const progressPercentage = Math.min(95, (completedSections / totalSections) * 100);

                      // Call the callback with the new content
                      onProgressUpdate({
                        ...partialResult,
                        progressPercentage
                      });
                    }
                  } catch (error) {
                    // Ignore parse errors for partial chunks
                    logger.debug('Error parsing streaming chunk:', error);
                  }
                }
              }

              if (isComplete) break;
            }
          } catch (streamError) {
            logger.error('Error reading stream:', streamError);
            // Fall back to non-streaming approach if streaming fails
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
        throw error
      }
      // For other errors, propagate to the UI for better error reporting
      throw error
    }
  }

  // Fetch additional data like GitHub issues to enhance the initial analysis
  async fetchAdditionalErrorData(error: ErrorPayload): Promise<{ githubIssues?: GitHubIssue[] }> {
    logger.info('AI Service fetchAdditionalErrorData called', error)

    if (!this.tenantSecret) {
      throw new Error('Tenant secret not found. AI features are disabled.')
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
      throw err
    }
  }

  // Original method kept for backward compatibility
  async analyzeError(error: ErrorPayload): Promise<ErrorAnalysisResult> {
    logger.info('AI Service analyzeError called', error)

    if (!this.tenantSecret) {
      throw new Error('Tenant secret not found. AI features are disabled.')
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
1. A concise root cause (max 15 words, be very brief)
2. A detailed explanation (2-3 sentences)
3. 2-3 practical solutions (with code examples)
4. Related documentation links
5. A brief "Explain Like I'm 5" (ELI5) explanation (max 25 words) that uses simple language to describe: ${error.message}

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
  "eli5": "string" // Keep this brief (25 words max)
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
      throw error
    }
  }

  async getChatCompletion(params: ChatCompletionParams): Promise<string> {
    if (!this.tenantSecret) {
      throw new Error('Tenant secret not found. AI features are disabled.')
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
      throw error
    }
  }

  // Add a streaming version of the chat completion
  async getChatCompletionStream(
    params: ChatCompletionParams,
    onTokenReceived: (token: string, isDone: boolean) => void
  ): Promise<void> {
    if (!this.tenantSecret) {
      throw new Error('Tenant secret not found. AI features are disabled.')
    }

    try {
      // Configure request with streaming enabled
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
            temperature: params.temperature || 0.7,
            stream: true // Enable streaming
          }
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`)
      }

      // Process the streaming response
      if (response.body) {
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        // Keep reading chunks until the stream is done
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            // Final callback with isDone=true
            onTokenReceived('', true)
            break
          }

          // Decode the chunk and add to buffer
          buffer += decoder.decode(value, { stream: true })

          // Process lines from the buffer
          const lines = buffer.split('\n')
          buffer = lines.pop() || '' // Keep the unfinished line in the buffer

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)

              // Check for stream completion signal
              if (data === '[DONE]') {
                onTokenReceived('', true)
                break
              }

              try {
                // Parse the JSON data
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content || ''

                if (content) {
                  // Call the callback with the new token
                  onTokenReceived(content, false)
                }
              } catch {
                // Ignore parse errors for partial chunks
              }
            }
          }
        }
      }
    } catch (error) {
      logger.error('Error with streaming chat completion:', error)
      // Notify of error
      onTokenReceived('\n\nError: Unable to get response. Please try again.', true)
    }
  }

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

  // Updated mapGitHubIssue method with proper typesxxr
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

}

// Export a singleton instance
export const aiService = new AIService() 