import { Component } from 'react'
import type { ErrorInfo, PropsWithChildren } from 'react'
import { ErrorDisplay } from './ErrorDisplay'
import { createLogger } from '../../../lib/logger'

const logger = createLogger('ErrorBoundary')

type ErrorBoundaryState = {
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  constructor(props: PropsWithChildren) {
    super(props)
    this.state = {
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to our logging service
    logger.error('Uncaught error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  resetError = (): void => {
    this.setState({
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorDisplay
          error={this.state.error}
          reset={this.resetError}
        />
      )
    }

    return this.props.children
  }
} 