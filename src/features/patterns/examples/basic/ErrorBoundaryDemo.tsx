import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary'
import { BuggyCounter } from './BuggyCounter'

export function ErrorBoundaryDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Each widget has its own boundary: one crash doesn't take down the other */}
      {['Widget A', 'Widget B'].map((name) => (
        <Card key={name} className="space-y-3">
          <p className="text-sm font-semibold">{name}</p>
          <ErrorBoundary
            fallback={({ error, reset }) => (
              <div role="alert" className="space-y-2 text-sm">
                <p className="text-red-600 dark:text-red-400">{error.message}</p>
                <Button size="sm" variant="secondary" onClick={reset}>
                  Riprova
                </Button>
              </div>
            )}
          >
            <BuggyCounter />
          </ErrorBoundary>
        </Card>
      ))}
    </div>
  )
}
