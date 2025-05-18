import { useEffect, useState } from 'react'
import { ErrorDisplay } from '../error-ui/ErrorDisplay'

interface PreLoaderProps {
  steps: {
    id: string
    label: string
    isComplete: boolean
  }[]
  isComplete: boolean
  error?: Error | null
  onRetry?: () => void
}

export function PreLoader({ steps, isComplete, error, onRetry }: PreLoaderProps) {
  const [progress, setProgress] = useState(0)

  // Calculate progress based on completed steps
  useEffect(() => {
    if (isComplete) {
      setProgress(100)
      return
    }

    const completedSteps = steps.filter(step => step.isComplete).length
    const progressPercentage = (completedSteps / steps.length) * 100

    // Smoothly animate progress
    const timer = setTimeout(() => {
      setProgress(progressPercentage)
    }, 100)

    return () => clearTimeout(timer)
  }, [steps, isComplete])

  // If there's an error, show the professional error display
  if (error) {
    return <ErrorDisplay error={error} reset={onRetry} />
  }

  // If complete, don't render anything
  if (isComplete) {
    return null
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white z-50">
      <div className="max-w-md w-full mx-auto px-6">
        <div className="mb-10 text-center">
          <div className="flex justify-center mb-8">
            {/* Electric Logo - Stylized lightning bolt */}
            <div className="relative">
              <div className="absolute inset-0 blur-lg bg-blue-500 opacity-30 rounded-full"></div>
              <svg className="w-20 h-20 text-blue-400 relative z-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            <span className="text-blue-400">Electric</span> Stack
          </h2>
          <p className="text-gray-300 opacity-80">Initializing your local-first application</p>
        </div>

        {/* Progress bar with glow effect */}
        <div className="w-full bg-gray-700 rounded-full h-1.5 mb-8 overflow-hidden">
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute top-0 right-0 bottom-0 w-4 bg-white opacity-30 blur-sm"></div>
          </div>
        </div>

        {/* Steps list with elegant styling */}
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center">
              {step.isComplete ? (
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-900 flex items-center justify-center mr-3 border border-blue-400">
                  <svg className="h-3 w-3 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-800 flex items-center justify-center mr-3 border border-gray-600">
                  <div className={`h-2 w-2 rounded-full ${progress > 0 ? 'bg-blue-400 animate-pulse' : 'bg-gray-600'}`}></div>
                </div>
              )}
              <span className={`text-sm ${step.isComplete ? 'text-blue-100' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 