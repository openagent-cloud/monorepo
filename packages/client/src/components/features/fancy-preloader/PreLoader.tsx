import { useEffect, useState, useRef } from 'react'
import { ErrorDisplay } from '../error-ui/ErrorDisplay'
import Typewriter from 'typewriter-effect'

interface PreLoaderProps {
  steps: {
    id: string
    label: string
    isComplete: boolean
    progress?: number // Optional progress percentage for the specific step
  }[]
  isComplete: boolean
  error?: Error | null
  onRetry?: () => void
  // Additional optional props for smoother experience
  autoProgressSpeed?: number // Speed for auto-progress in ms (lower = faster)
  minProgressIncrement?: number // Minimum progress increment for better visual feedback
  fadeOutDuration?: number // Duration of fade transition in ms
  typewriterSpeed?: number // Speed of typewriter effect in ms per character
}

export function PreLoader({ 
  steps, 
  isComplete, 
  error, 
  onRetry,
  autoProgressSpeed = 1000,
  minProgressIncrement = 3,
  fadeOutDuration = 800,
  typewriterSpeed = 30
}: PreLoaderProps) {
  const [progress, setProgress] = useState(5) // Start at 5% to show immediate feedback
  const [opacity, setOpacity] = useState(1)
  const [isHidden, setIsHidden] = useState(false)
  const lastProgressRef = useRef(0)
  const autoProgressTimerRef = useRef<number | null>(null)

  // Auto-progress effect - creates a natural-feeling loading animation
  useEffect(() => {
    // Clear any existing auto-progress timer
    if (autoProgressTimerRef.current) {
      clearTimeout(autoProgressTimerRef.current);
      autoProgressTimerRef.current = null;
    }

    // If we're complete, jump to 100%
    if (isComplete) {
      setProgress(100);
      
      // Fade out after reaching 100%
      const fadeTimer = setTimeout(() => {
        setOpacity(0);
        const hideTimer = setTimeout(() => setIsHidden(true), fadeOutDuration);
        return () => clearTimeout(hideTimer);
      }, 300);
      
      return () => clearTimeout(fadeTimer);
    }

    // Calculate progress based on completed steps, but also consider each step's individual progress
    let baseProgress = 0;
    const stepValue = 100 / steps.length;
    
    steps.forEach((step) => {
      if (step.isComplete) {
        baseProgress += stepValue;
      } else if (step.progress) {
        // If the step has individual progress, add a portion of that step's value
        baseProgress += (step.progress / 100) * stepValue;
      }
    });

    // Don't decrease progress, only increase
    const newProgress = Math.max(lastProgressRef.current, baseProgress);
    
    // If no real progress is happening, simulate progress to keep user engaged
    if (newProgress === lastProgressRef.current && newProgress < 95) {
      // Auto-increment by small amounts to show activity
      autoProgressTimerRef.current = window.setTimeout(() => {
        const smallIncrement = Math.min(minProgressIncrement, 95 - lastProgressRef.current);
        const incrementedProgress = lastProgressRef.current + smallIncrement;
        setProgress(incrementedProgress);
        lastProgressRef.current = incrementedProgress;
      }, autoProgressSpeed);
    } else {
      // Real progress change detected - animate to the new value
      const animateTimer = setTimeout(() => {
        setProgress(newProgress);
        lastProgressRef.current = newProgress;
      }, 150);
      return () => clearTimeout(animateTimer);
    }

    return () => {
      if (autoProgressTimerRef.current) {
        clearTimeout(autoProgressTimerRef.current);
      }
    };
  }, [steps, isComplete, autoProgressSpeed, minProgressIncrement, fadeOutDuration])

  // If there's an error, show the professional error display
  if (error) {
    return <ErrorDisplay error={error} reset={onRetry} />
  }

  // If complete and finished fading out, don't render anything
  if (isComplete && isHidden) {
    return null
  }

  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white z-50 transition-opacity"
      style={{ opacity: opacity, transition: `opacity ${fadeOutDuration}ms ease-in-out` }}
    >
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
            className="h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-700 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute top-0 right-0 bottom-0 w-4 bg-white opacity-30 blur-sm animate-pulse"></div>
            {/* Add subtle pulse effect along the bar */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-30" 
                 style={{ 
                   animation: 'progressPulse 2s ease-in-out infinite',
                   backgroundSize: '200% 100%'
                 }}></div>
          </div>
          {/* Add a small text percentage below the progress bar */}
          <div className="text-xs text-gray-400 text-center mt-1">{Math.round(progress)}%</div>
        </div>

        {/* Steps list with elegant styling and typewriter effect */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            // Determine if this step should be shown
            // A step is visible if it or any previous step has progress > 0
            const isVisible = steps.slice(0, index + 1).some(s => s.progress && s.progress > 0);
            
            // Determine if this is the active step (visible but not complete)
            const isActiveStep = isVisible && !step.isComplete && 
              // Only the first non-complete step should animate
              steps.findIndex(s => !s.isComplete) === index;
            
            // Don't render steps that haven't been reached yet
            if (!isVisible) return null;
            
            return (
              <div 
                key={step.id} 
                className={`flex items-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              >
                {!isVisible || step.progress === 0 ? (
                  // Skeleton for the indicator bubble
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-700 animate-pulse mr-3"></div>
                ) : step.isComplete ? (
                  // Completed step indicator
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-900 flex items-center justify-center mr-3 border border-blue-400">
                    <svg className="h-3 w-3 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  // In-progress step indicator
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-800 flex items-center justify-center mr-3 border border-gray-600">
                    <div 
                      className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" 
                      style={{ 
                        animationDuration: '1.5s',
                        boxShadow: '0 0 8px rgba(96, 165, 250, 0.5)'
                      }}
                    ></div>
                  </div>
                )}
                <div className="min-w-[160px]">
                  {!isVisible || step.progress === 0 ? (
                    // Skeleton placeholder for steps not yet reached
                    <div className="h-4 bg-gray-700 rounded animate-pulse w-28"></div>
                  ) : step.isComplete ? (
                    // For completed steps, show the text immediately
                    <span className="text-sm text-blue-100">{step.label}</span>
                  ) : isActiveStep ? (
                    // Only the active step gets the typewriter effect
                    <span className="text-sm text-gray-400">
                      <Typewriter
                        options={{
                          strings: [step.label],
                          autoStart: true,
                          loop: false,
                          delay: typewriterSpeed,
                          cursor: '|',
                          wrapperClassName: '',
                          cursorClassName: 'text-blue-400 animate-blink'
                        }}
                      />
                    </span>
                  ) : (
                    // For non-active but visible steps, show the text immediately
                    <span className="text-sm text-gray-400">{step.label}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
} 