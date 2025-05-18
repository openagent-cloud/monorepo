import React, { useState, useEffect, useMemo } from 'react'
import { createLogger } from '@/lib/logger'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ExternalLink, RotateCcw, Lightbulb, Code, Cpu, MessageCircle, Wand2, Loader2, Copy, CheckCircle2, CheckCheck, Package, Github } from 'lucide-react'
import { ZustandChatInterface } from '@/components/features/chat-ui/ChatInterface'
import type { ErrorPayload } from '@/lib/ai.service'
import { useAIChatStore } from '@/stores/ai-chat.store'

const logger = createLogger('AIAnalysis')

// Utility function to limit text length
const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

type AIAnalysisProps = {
  errorName: string
  errorMessage: string
  stackTrace: string
  onAction: (actionType: string, payload?: string | ErrorPayload | null) => void
}

// Remove unused interface
// interface AnalysisProgressResult extends Partial<ErrorAnalysisResult> {
//   streamComplete?: boolean
//   data?: string
//   progressPercentage?: number
// }

export function AIAnalysis({ errorName, errorMessage, stackTrace, onAction }: AIAnalysisProps) {
  // Local state only for UI interactions, not duplicating Zustand state
  const [isApplyingSolution, setIsApplyingSolution] = useState(false)
  const [copiedSolution, setCopiedSolution] = useState<number | null>(null)

  // Get state and actions from Zustand store with specific selectors
  const activeTab = useAIChatStore(state => state.activeTab)
  const setActiveTab = useAIChatStore(state => state.setActiveTab)
  const analyzeError = useAIChatStore(state => state.analyzeError)
  const resetAnalysis = useAIChatStore(state => state.resetAnalysis)
  const analysis = useAIChatStore(state => state.currentAnalysis)
  const isAnalyzing = useAIChatStore(state => state.isAnalyzing)
  const analysisError = useAIChatStore(state => state.analysisError)
  const analysisProgress = useAIChatStore(state => state.analysisProgress)
  const hasRootCauseAnalysis = useAIChatStore(state => state.hasRootCauseAnalysis)
  const hasSolutionSteps = useAIChatStore(state => state.hasSolutionSteps)
  const hasRelatedDocs = useAIChatStore(state => state.hasRelatedDocs)
  const hasPackages = useAIChatStore(state => state.hasPackages)
  const hasGithubIssues = useAIChatStore(state => state.hasGithubIssues)
  const initializeChat = useAIChatStore(state => state.initializeChat)
  const updateSolution = useAIChatStore(state => state.updateSolution)

  // Reset copied solution state after 2 seconds
  useEffect(() => {
    if (copiedSolution !== null) {
      const timer = setTimeout(() => setCopiedSolution(null), 2000)
      return () => clearTimeout(timer)
    }
  }, [copiedSolution])

  // Initialize chat tab with welcome message when it becomes active
  useEffect(() => {
    if (activeTab === 'chat' && analysis) {
      initializeChat(
        errorName,
        errorMessage,
        analysis.rootCause,
        analysis.explanation
      )
    }
  }, [activeTab, analysis, errorName, errorMessage, initializeChat])

  // Don't start analysis automatically when the component mounts
  // The parent component will control when analysis starts
  // using the onAction callback to notify when analysis is complete

  // Start analysis only when isAnalyzing becomes true
  useEffect(() => {
    if (isAnalyzing && !analysis) {
      logger.info('Starting error analysis')
      analyzeError({
        name: errorName,
        message: errorMessage,
        stack: stackTrace
      }, onAction)
    }
  }, [isAnalyzing, analysis, analyzeError, errorName, errorMessage, stackTrace, onAction])

  // Simulate applying a solution
  const applySolution = async (index: number) => {
    setIsApplyingSolution(true)

    try {
      // In a real implementation, this would apply the solution to the code
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Update the solution in the Zustand store
      updateSolution(index, { completed: true })
      logger.info('Solution applied:', index)

      // Trigger the onAction callback to notify the parent component
      onAction('apply-solution', {
        name: errorName,
        message: errorMessage,
        stack: stackTrace
      })

    } catch (err) {
      logger.error('Error applying solution:', err)
    } finally {
      setIsApplyingSolution(false)
    }
  }

  // Copy solution code to clipboard
  const copySolution = (index: number, code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedSolution(index)
  }

  // Handle restart analysis from Zustand store
  const handleRestartAnalysis = () => {
    resetAnalysis()
    analyzeError({ name: errorName, message: errorMessage, stack: stackTrace }, onAction)
  }

  // Use the Zustand-connected chat component
  const chatComponent = useMemo(() => (
    <ZustandChatInterface
      placeholder="Ask a question about this error..."
      errorContext={{
        errorName,
        errorMessage,
        rootCause: analysis?.rootCause,
        explanation: analysis?.explanation
      }}
    />
  ), [analysis, errorName, errorMessage])

  // This function will replace the existing package section in the renderAnalysisTab function
  const renderPackagesSection = () => {
    if (!analysis?.packages || analysis.packages.length === 0) return null

    return (
      <div className="flex-grow">
        <h3 className="text-sm font-medium text-[#0f172a] dark:text-[#f8fafc] mb-1.5">Related Packages</h3>

        {isAnalyzing && !hasPackages ? (
          <div className="bg-white dark:bg-[#171717] rounded-lg border border-[#f0f0f0] dark:border-[#262626]/70 p-3.5 animate-pulse pointer-events-none">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-1/3"></div>
              <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-12 ml-auto"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-1/2"></div>
              <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-12 ml-auto"></div>
            </div>
          </div>
        ) : analysisError ? (
          <div className="bg-white dark:bg-[#171717] rounded-lg border border-[#f0f0f0] dark:border-[#262626]/70 p-3.5 opacity-60">
            <p className="text-sm text-[#475569] dark:text-[#94a3b8] italic">
              Package information not available
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#171717] rounded-lg border border-[#f0f0f0] dark:border-[#262626]/70 p-3.5 overflow-hidden">
            <ul className="space-y-3 max-h-[250px] overflow-y-auto scrollbar-thin pr-1">
              {analysis?.packages?.map((pkg, index) => (
                <li key={index} className="pb-3 border-b border-[#f0f0f0] dark:border-[#262626]/70 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-[#64748b] dark:text-[#94a3b8]" />
                      <span className="font-medium text-[#0f172a] dark:text-[#f8fafc]">
                        {pkg.name}
                        {pkg.version && <span className="text-[#64748b] dark:text-[#94a3b8] font-normal ml-1">{pkg.version}</span>}
                      </span>
                    </div>
                    {pkg.relevanceScore !== undefined && (
                      <div className="flex items-center gap-1">
                        <div className="w-16 h-1.5 bg-[#e2e8f0] dark:bg-[#334155] rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              pkg.relevanceScore >= 80 ? "bg-[#ef4444] dark:bg-[#ef4444]" :
                                pkg.relevanceScore >= 50 ? "bg-[#f59e0b] dark:bg-[#f59e0b]" :
                                  "bg-[#10b981] dark:bg-[#10b981]"
                            )}
                            style={{ width: `${pkg.relevanceScore}%` }}
                          />
                        </div>
                        <span className="text-xs text-[#64748b] dark:text-[#94a3b8]">
                          {pkg.relevanceScore}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Repository link */}
                  {pkg.repoUrl && (
                    <div className="flex items-center text-xs text-[#1c64f2] dark:text-[#93c5fd] hover:text-[#0066cc] dark:hover:text-[#60a5fa] mb-2">
                      <a
                        href={pkg.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center hover:underline"
                      >
                        <span>View Repository</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  )}

                  {/* Common issues with this package if available */}
                  {pkg.commonIssues && pkg.commonIssues.length > 0 && (
                    <div className="mt-1.5">
                      <span className="text-xs font-medium text-[#475569] dark:text-[#cbd5e1] mb-1 block">
                        Common Issues:
                      </span>
                      <ul className="text-xs text-[#64748b] dark:text-[#94a3b8] list-disc pl-3.5 space-y-0.5">
                        {pkg.commonIssues.map((issue, i) => (
                          <li key={i}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Compatibility info if available */}
                  {pkg.compatibilityInfo && (
                    <div className="mt-1.5">
                      <span className="text-xs font-medium text-[#475569] dark:text-[#cbd5e1] mb-1 block">
                        Compatibility:
                      </span>
                      <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">
                        {pkg.compatibilityInfo}
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  // Add a new GitHub issues section component
  const renderGitHubIssues = () => {
    // General GitHub issues
    const generalIssues = analysis?.githubIssues || []
    // Collect all package-specific GitHub issues
    const packageIssues = analysis?.packages
      ?.filter(pkg => pkg.relatedIssues && pkg.relatedIssues.length > 0)
      .flatMap(pkg => pkg.relatedIssues || []) || []

    // Combine all issues but prioritize package-specific ones
    const allIssues = [...packageIssues, ...generalIssues].slice(0, 8)

    if (allIssues.length === 0 && !isAnalyzing) return null

    // Format date for display
    const formatDate = (dateStr: string) => {
      try {
        const date = new Date(dateStr)
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }).format(date)
      } catch (error) {
        logger.error('Error formatting date:', error)
        return dateStr.split('T')[0] // Fallback
      }
    }

    return (
      <div className="flex-grow col-span-2">
        <h3 className="text-sm font-medium text-[#0f172a] dark:text-[#f8fafc] mb-1.5 flex items-center gap-1.5">
          <span>GitHub Issues</span>
          <Github className="w-3.5 h-3.5 text-[#1c64f2] dark:text-[#93c5fd]" />
        </h3>

        {isAnalyzing && !hasGithubIssues ? (
          <div className="bg-white dark:bg-[#171717] rounded-lg border border-[#f0f0f0] dark:border-[#262626]/70 p-3.5 animate-pulse pointer-events-none">
            <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-3/4 mb-4"></div>
            <div className="flex justify-between mb-3">
              <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-1/3"></div>
              <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-16"></div>
            </div>
            <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-full mb-4"></div>

            <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-3/4 mb-4"></div>
            <div className="flex justify-between mb-3">
              <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-1/3"></div>
              <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-16"></div>
            </div>
          </div>
        ) : analysisError ? (
          <div className="bg-white dark:bg-[#171717] rounded-lg border border-[#f0f0f0] dark:border-[#262626]/70 p-3.5 opacity-60">
            <p className="text-sm text-[#475569] dark:text-[#94a3b8] italic">
              GitHub issues not available
            </p>
          </div>
        ) : allIssues.length > 0 ? (
          <div className="bg-white dark:bg-[#171717] rounded-lg border border-[#f0f0f0] dark:border-[#262626]/70 p-3.5 overflow-hidden">
            <ul className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin pr-1 divide-y divide-[#f0f0f0] dark:divide-[#262626]/70">
              {allIssues.map((issue, index) => (
                <li key={index} className={index === 0 ? "" : "pt-3"}>
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-2 h-2 mt-1.5 rounded-full flex-shrink-0",
                      issue.state === 'open'
                        ? "bg-[#22c55e] dark:bg-[#4ade80]"
                        : "bg-[#6b7280] dark:bg-[#9ca3af]"
                    )} />

                    <div className="flex-grow">
                      <a
                        href={issue.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-[#1c64f2] dark:text-[#93c5fd] hover:underline flex items-center gap-1.5"
                      >
                        {issue.title}
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>

                      <div className="flex items-center gap-2 mt-1 text-xs text-[#64748b] dark:text-[#94a3b8]">
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Repo:</span>
                          <span>{issue.repo}</span>
                        </span>

                        {issue.packageName && (
                          <span className="flex items-center gap-1">
                            <span className="font-medium">Package:</span>
                            <span className="bg-[#f0f7ff] dark:bg-[#172338]/70 px-1.5 py-0.5 rounded text-[#1c64f2] dark:text-[#93c5fd]">
                              {issue.packageName}
                            </span>
                          </span>
                        )}

                        <span className="flex items-center gap-1 ml-auto">
                          <span>{formatDate(issue.createdAt)}</span>
                          <span>•</span>
                          <span>{issue.commentsCount} comments</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-3 text-xs text-[#64748b] dark:text-[#94a3b8] italic">
              These issues were found on GitHub based on the error message and related packages.
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#171717] rounded-lg border border-[#f0f0f0] dark:border-[#262626]/70 p-3.5 animate-pulse pointer-events-none">
            <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-3/4 mb-4"></div>
            <div className="flex justify-between mb-3">
              <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-1/3"></div>
              <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-16"></div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Now replace the old packages section in renderAnalysisTab with our new function call
  const renderAnalysisTab = () => {
    return (
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Root cause analysis */}
          <div className="flex-grow">
            <h3 className="text-sm font-medium text-[#0f172a] dark:text-[#f8fafc] mb-1.5">Root Cause Analysis</h3>

            {isAnalyzing && !hasRootCauseAnalysis ? (
              <div className="bg-white dark:bg-[#171717] rounded-lg border border-[#f0f0f0] dark:border-[#262626]/70 p-3.5 animate-pulse pointer-events-none">
                <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-3/4 mb-2.5"></div>
                <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-full mb-2.5"></div>
                <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-2/3"></div>
              </div>
            ) : analysisError ? (
              <div className="bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800/30 p-3.5">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {analysisError}
                </p>
              </div>
            ) : analysis?.rootCause ? (
              <div className="bg-white dark:bg-[#171717] rounded-lg border border-[#f0f0f0] dark:border-[#262626]/70 p-3.5">
                <p className="text-sm text-[#0f172a] dark:text-[#e5e7eb] leading-relaxed">
                  {truncateText(analysis.rootCause, 100)}
                </p>
                <p className="text-sm text-[#475569] dark:text-[#94a3b8] mt-2 leading-relaxed">
                  {analysis.explanation}
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#171717] rounded-lg border border-[#f0f0f0] dark:border-[#262626]/70 p-3.5 animate-pulse pointer-events-none">
                <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-3/4 mb-2.5"></div>
                <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-full mb-2.5"></div>
                <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-2/3"></div>
              </div>
            )}
          </div>

          {/* Beginner-friendly explanation (ELI5) */}
          <div className="flex-grow">
            <h3 className="text-sm font-medium text-[#0f172a] dark:text-[#f8fafc] mb-1.5 flex items-center gap-1.5">
              <span>Explain Like I'm 5</span>
              <Lightbulb className="w-3.5 h-3.5 text-[#f59e0b] dark:text-[#fbbf24]" />
            </h3>

            {isAnalyzing && !hasRootCauseAnalysis ? (
              <div className="bg-white dark:bg-[#171717] rounded-lg border border-[#f0f0f0] dark:border-[#262626]/70 p-3.5 animate-pulse pointer-events-none">
                <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-full mb-2.5"></div>
                <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-full mb-2.5"></div>
                <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-3/4"></div>
              </div>
            ) : analysisError ? (
              <div className="bg-[#fffbeb] dark:bg-[#422006]/30 rounded-lg border border-[#fef3c7] dark:border-[#854d0e]/50 p-3.5 opacity-60">
                <p className="text-sm text-[#92400e] dark:text-[#fcd34d] leading-relaxed italic">
                  Explanation not available
                </p>
              </div>
            ) : analysis?.eli5 ? (
              <div className="bg-[#fffbeb] dark:bg-[#422006]/30 rounded-lg border border-[#fef3c7] dark:border-[#854d0e]/50 p-3.5">
                <p className="text-sm text-[#92400e] dark:text-[#fcd34d] leading-relaxed">
                  {truncateText(analysis.eli5, 150)}
                </p>
              </div>
            ) : (
              <div className="bg-[#fffbeb] dark:bg-[#422006]/30 rounded-lg border border-[#fef3c7] dark:border-[#854d0e]/50 p-3.5 opacity-60">
                <p className="text-sm text-[#92400e] dark:text-[#fcd34d] leading-relaxed italic">
                  Simple explanation loading...
                </p>
              </div>
            )}
          </div>

          {/* Solution steps */}
          <div className="flex-grow md:col-span-2">
            <h3 className="text-sm font-medium text-[#0f172a] dark:text-[#f8fafc] mb-1.5">Solution Steps</h3>

            {isAnalyzing && !hasSolutionSteps ? (
              <div className="bg-white dark:bg-[#171717] rounded-lg border border-[#f0f0f0] dark:border-[#262626]/70 p-3.5 animate-pulse pointer-events-none">
                <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-1/4 mb-3"></div>
                <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-full mb-2.5"></div>
                <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-full mb-2.5"></div>
                <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-3/4 mb-4"></div>

                <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-1/4 mb-3"></div>
                <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-full mb-2.5"></div>
                <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-2/3"></div>
              </div>
            ) : analysisError ? (
              <div className="bg-white dark:bg-[#171717] rounded-lg border border-[#f0f0f0] dark:border-[#262626]/70 p-3.5 opacity-60">
                <p className="text-sm text-[#475569] dark:text-[#94a3b8] italic">
                  Solution steps not available
                </p>
              </div>
            ) : analysis?.solutions && analysis.solutions.length > 0 ? (
              <div className="bg-white dark:bg-[#171717] rounded-lg border border-[#f0f0f0] dark:border-[#262626]/70 p-3.5">
                <ol className="space-y-4">
                  {analysis?.solutions?.map((solution, index) => (
                    <li key={index} className={solution.completed ? 'opacity-60' : ''}>
                      <div className="flex justify-between items-start gap-3 mb-2">
                        <h4 className="text-sm font-medium text-[#0f172a] dark:text-[#f8fafc] flex items-center gap-1.5">
                          <span className="flex items-center justify-center w-5 h-5 text-xs rounded-full bg-[#f0f7ff] dark:bg-[#172338]/70 text-[#1c64f2] dark:text-[#93c5fd] font-medium">
                            {index + 1}
                          </span>
                          <span>{solution.title}</span>
                          {solution.completed && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] dark:text-[#34d399]" />
                          )}
                        </h4>

                        {!isApplyingSolution && solution.code && (
                          <div className="flex items-center gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-full text-[#64748b] dark:text-[#94a3b8] hover:text-[#1c64f2] dark:hover:text-[#93c5fd]"
                              onClick={() => copySolution(index, solution.code!)}
                            >
                              {copiedSolution === index ? (
                                <CheckCheck className="h-3.5 w-3.5" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </Button>

                            {/* Only show apply button for first solution - in a real app, you'd customize this */}
                            {index === 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2.5 text-xs flex items-center gap-1.5 whitespace-nowrap bg-white dark:bg-[#171717] text-[#1c64f2] dark:text-[#93c5fd] border-[#e0edff] dark:border-[#1c64f2]/30 hover:bg-[#f0f7ff] dark:hover:bg-[#1c64f2]/10"
                                onClick={() => applySolution(index)}
                              >
                                <Code className="h-3.5 w-3.5" />
                                <span>Apply</span>
                              </Button>
                            )}
                          </div>
                        )}

                        {isApplyingSolution && index === 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2.5 text-xs bg-white dark:bg-[#171717] text-[#64748b] dark:text-[#94a3b8] border-[#e2e8f0] dark:border-[#334155]"
                            disabled
                          >
                            <div className="pointer-events-none">
                              <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                            </div>
                            <span>Applying...</span>
                          </Button>
                        )}
                      </div>

                      <p className="text-sm text-[#475569] dark:text-[#94a3b8] mb-2 leading-relaxed">
                        {solution.description}
                      </p>

                      {solution.code && (
                        <pre className="text-xs bg-[#f8fafc] dark:bg-[#0f172a] p-3 rounded border border-[#e2e8f0] dark:border-[#1e293b] overflow-x-auto scrollbar-thin font-mono text-[#334155] dark:text-[#cbd5e1]">
                          {solution.code}
                        </pre>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#171717] rounded-lg border border-[#f0f0f0] dark:border-[#262626]/70 p-3.5 animate-pulse pointer-events-none">
                <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-1/4 mb-3"></div>
                <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-full mb-2.5"></div>
                <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-full mb-2.5"></div>
                <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-3/4 mb-4"></div>

                <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-1/4 mb-3"></div>
                <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-full mb-2.5"></div>
                <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-2/3"></div>
              </div>
            )}
          </div>

          {/* Packages and docs in a grid */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Packages section */}
            {renderPackagesSection()}

            {/* Related documentation */}
            <div className="flex-grow">
              <h3 className="text-sm font-medium text-[#0f172a] dark:text-[#f8fafc] mb-1.5">Related Documentation</h3>

              {isAnalyzing && !hasRelatedDocs ? (
                <div className="bg-white dark:bg-[#171717] rounded-lg border border-[#f0f0f0] dark:border-[#262626]/70 p-3.5 animate-pulse pointer-events-none">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-1/3"></div>
                    <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-12 ml-auto"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-1/2"></div>
                    <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-12 ml-auto"></div>
                  </div>
                </div>
              ) : analysisError ? (
                <div className="bg-white dark:bg-[#171717] rounded-lg border border-[#f0f0f0] dark:border-[#262626]/70 p-3.5 opacity-60">
                  <p className="text-sm text-[#475569] dark:text-[#94a3b8] italic">
                    Documentation links not available
                  </p>
                </div>
              ) : analysis?.relatedDocs && analysis.relatedDocs.length > 0 ? (
                <div className="bg-white dark:bg-[#171717] rounded-lg border border-[#f0f0f0] dark:border-[#262626]/70 p-3.5">
                  <ul className="space-y-2.5">
                    {analysis.relatedDocs.map((doc, index) => (
                      <li key={index}>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between text-sm text-[#1c64f2] dark:text-[#93c5fd] hover:text-[#0066cc] dark:hover:text-[#60a5fa] hover:underline"
                        >
                          <span>{doc.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-white dark:bg-[#171717] rounded-lg border border-[#f0f0f0] dark:border-[#262626]/70 p-3.5 animate-pulse pointer-events-none">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-1/3"></div>
                    <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-12 ml-auto"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-1/2"></div>
                    <div className="h-3 bg-[#f1f5f9] dark:bg-[#334155] rounded w-12 ml-auto"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* GitHub issues section with margin-top */}
        <div className="md:col-span-2 mt-4">
          {renderGitHubIssues()}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end space-x-2 mt-4 px-5 pb-5">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "text-xs h-8 bg-white dark:bg-[#171717] text-[#1c64f2] dark:text-[#93c5fd] border-[#e0edff] dark:border-[#1c64f2]/30 hover:bg-[#f0f7ff] dark:hover:bg-[#1c64f2]/10",
              analysisError ? "border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-900/10 hover:bg-red-50 dark:hover:bg-red-900/20" : ""
            )}
            onClick={handleRestartAnalysis}
            disabled={isAnalyzing}
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            {analysisError ? "Try Again" : "Refresh Analysis"}
          </Button>

          <Button
            variant="default"
            size="sm"
            className="text-xs h-8 bg-[#1c64f2] hover:bg-[#1a56db] dark:bg-[#1e40af] dark:hover:bg-[#1c64f2] text-white"
            onClick={() => setActiveTab('chat')}
          >
            <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
            Chat with AI
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-[#f0f0f0] dark:border-[#262626]/70 bg-[#fafafa]/50 dark:bg-[#0f0f0f]/20">
      <div className="bg-gradient-to-r from-[#f0f7ff]/80 via-[#eef6ff]/80 to-[#f0f7ff]/80 dark:from-[#0c1a2b]/30 dark:via-[#111a2f]/30 dark:to-[#0c1a2b]/30 p-4 border-b border-[#f0f0f0] dark:border-[#262626]/70 relative">
        {/* Main content layer - this receives clicks */}
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-[#1c64f2]/10 dark:bg-[#1c64f2]/20 flex items-center justify-center">
                <Cpu className="h-4.5 w-4.5 text-[#1c64f2] dark:text-[#93c5fd]" />
              </div>
              <div>
                <h3 className="text-base font-medium text-[#0f172a] dark:text-[#f8fafc]">AI Error Analysis</h3>
                <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">
                  Powered by intelligent error analysis
                  {isAnalyzing && analysisProgress > 0 && (
                    <span className="ml-1 text-[#1c64f2] dark:text-[#93c5fd]">
                      ({Math.round(analysisProgress)}%)
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-[#f0f0f0] dark:border-[#374151] p-0.5 bg-white/80 dark:bg-[#1f2937]/60 backdrop-blur-sm shadow-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "px-3 h-7 text-sm font-medium rounded",
                    activeTab === 'analysis'
                      ? "bg-[#f0f7ff] dark:bg-[#1e40af]/30 text-[#1c64f2] dark:text-[#93c5fd]"
                      : "text-[#64748b] dark:text-[#9ca3af] hover:text-[#1c64f2] dark:hover:text-[#93c5fd] hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]/50"
                  )}
                  onClick={() => setActiveTab('analysis')}
                >
                  <Wand2 className="w-3.5 h-3.5 mr-1.5" />
                  Analysis
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "px-3 h-7 text-sm font-medium rounded",
                    activeTab === 'chat'
                      ? "bg-[#f0f7ff] dark:bg-[#1e40af]/30 text-[#1c64f2] dark:text-[#93c5fd]"
                      : "text-[#64748b] dark:text-[#9ca3af] hover:text-[#1c64f2] dark:hover:text-[#93c5fd] hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]/50"
                  )}
                  onClick={() => setActiveTab('chat')}
                >
                  <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                  Chat
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 rounded-full text-[#64748b] hover:text-[#0f172a] dark:text-[#9ca3af] dark:hover:text-[#f8fafc]",
                  analysisError ? "animate-pulse text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300" : ""
                )}
                onClick={handleRestartAnalysis}
                disabled={isAnalyzing}
                title={analysisError ? "Analysis failed - Click to try again" : "Restart analysis"}
              >
                {isAnalyzing ? (
                  <div className="pointer-events-none">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  <RotateCcw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Animation layer - all animations go here and don't receive clicks */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Progress indicator that shows actual progress */}
          {isAnalyzing && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e2e8f0] dark:bg-[#334155] overflow-hidden pointer-events-none">
              <div
                className="h-full bg-gradient-to-r from-[#1c64f2]/60 via-[#1c64f2] to-[#1c64f2]/60 dark:from-[#93c5fd]/60 dark:via-[#93c5fd] dark:to-[#93c5fd]/60 pointer-events-none"
                style={{
                  width: `${analysisProgress}%`,
                  transition: 'width 0.3s ease-out'
                }}
              />
            </div>
          )}
        </div>

        {/* Global styles for the animation */}
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes progressAnimation {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(400%);
            }
          }
          .animate-progress {
            animation: progressAnimation 2s ease-in-out infinite;
          }
        `}} />
      </div>

      <div className="min-h-[400px] max-h-[600px] overflow-y-auto scrollbar-thin">
        {activeTab === 'analysis' ? renderAnalysisTab() : chatComponent}
      </div>
    </div>
  )
} 