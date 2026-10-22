import { Component, type ErrorInfo, type ReactNode } from 'react'

type FallbackRender = (props: { error: Error; reset: () => void }) => ReactNode

type ErrorBoundaryProps = {
  children: ReactNode
  /** What to show instead of the crashed subtree. */
  fallback: ReactNode | FallbackRender
  /** When any of these values changes, the boundary resets and tries again (e.g. [userId]). */
  resetKeys?: unknown[]
  onError?: (error: Error, info: ErrorInfo) => void
}

type ErrorBoundaryState = { error: Error | null }

/**
 * Catches errors thrown while rendering its children (including rejected
 * promises read with `use`) and shows a fallback instead of a blank page.
 * Error boundaries still have to be class components.
 *
 * @example
 * <ErrorBoundary resetKeys={[userId]} fallback={({ error, reset }) => <Retry error={error} onRetry={reset} />}>
 *   <UserProfile userId={userId} />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error: error instanceof Error ? error : new Error(String(error)) }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys = [] } = this.props
    const prevKeys = prevProps.resetKeys ?? []
    const changed = resetKeys.length !== prevKeys.length || resetKeys.some((key, i) => !Object.is(key, prevKeys[i]))
    if (this.state.error && changed) this.reset()
  }

  reset = () => this.setState({ error: null })

  render() {
    const { error } = this.state
    if (!error) return this.props.children
    const { fallback } = this.props
    return typeof fallback === 'function' ? fallback({ error, reset: this.reset }) : fallback
  }
}
