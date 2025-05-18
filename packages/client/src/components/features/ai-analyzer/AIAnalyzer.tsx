import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Sparkles, Loader2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { aiService } from '@/lib/ai.service'
import type { ErrorPayload } from '@/lib/ai.service'
import { AIAnalysis } from '@/components/features/ai-analyzer/AIAnalysis'

// Reexport the AIAnalysis component and its types
export { AIAnalysis, type ErrorPayload }

type AIAnalyzerToggleProps = {
  showAIAnalysis: boolean
  onToggle: () => void
  animationClass?: string
  isLoading?: boolean
  onCancel?: () => void
}

type CustomTooltipProps = {
  content: React.ReactNode
  children: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  variant?: "default" | "info" | "success" | "warning" | "error"
}

export function AIAnalyzerToggle({
  showAIAnalysis,
  onToggle,
  animationClass = '',
  isLoading = false,
  onCancel
}: AIAnalyzerToggleProps) {
  const [isHovering, setIsHovering] = useState(false)

  // Custom tooltip component that matches the styling from ErrorDisplay
  const CustomTooltip = ({
    content,
    children,
    side = "left",
    variant = "info"
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

  // Handle the button click based on state
  const handleClick = () => {
    if (isLoading && onCancel) {
      onCancel()
    } else {
      onToggle()
    }
  }

  return (
    <div className="absolute top-2 right-2">
      <CustomTooltip
        content={
          <div className="flex items-center gap-1.5">
            {isLoading && isHovering ? (
              <>
                <XCircle className="w-3 h-3" strokeWidth={2.5} />
                <span>Stop Analysis</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" strokeWidth={2.5} />
                <span>{showAIAnalysis ? "Hide AI Analysis" : isLoading ? "Loading Analysis..." : "Analyze with AI"}</span>
              </>
            )}
          </div>
        }
        side="left"
        variant={isLoading && isHovering ? "error" : "info"}
      >
        <div className="relative">
          {/* Animated halo for inactive state */}
          {!showAIAnalysis && !isLoading && (
            <div className="absolute inset-0 rounded-full animate-ping-slow opacity-70 bg-gradient-to-r from-[#ff6b6b] to-[#3b82f6]"></div>
          )}
          <Button
            onClick={handleClick}
            variant="ghost"
            size="icon"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={cn(
              "w-8 h-8 rounded-full border flex items-center justify-center hover:-translate-y-0.5 hover:shadow group",

              showAIAnalysis
                ? "bg-[#3b82f6]/90 border-[#3b82f6]/30 text-white hover:bg-[#3b82f6]/95 hover:border-[#3b82f6]/40"
                : isLoading
                  ? "bg-[#9ca3af]/30 border-[#9ca3af]/30 text-[#64748b] dark:text-[#9ca3af] opacity-70"
                  : "bg-white/90 border-[#fecaca]/40 dark:bg-[#fef2f2]/10 dark:border-[#ef4444]/30 text-[#ef4444] dark:text-[#fca5a5] hover:bg-white dark:hover:bg-[#fef2f2]/20",
              !showAIAnalysis && !isLoading && "animate-pulse animate-bounce",
              isLoading && isHovering && "bg-[#ef4444]/90 border-[#ef4444]/30 text-white hover:bg-[#ef4444]/95 hover:border-[#ef4444]/40",
              animationClass
            )}
          >
            {isLoading ? (
              isHovering ? (
                <XCircle className="w-4 h-4 text-white" />
              ) : (
                <Loader2 className="w-4 h-4 animate-spin" />
              )
            ) : (
              <Sparkles
                className={cn(
                  "w-4 h-4",
                  !showAIAnalysis && "animate-ping group-hover:animate-spin-slow"
                )}
                strokeWidth={2}
              />
            )}
          </Button>
        </div>
      </CustomTooltip>
    </div>
  )
}

/**
 * Check if AI analysis is enabled (OpenAI API key is available)
 */
export function isAIAnalysisEnabled(): boolean {
  return aiService.isEnabled()
} 