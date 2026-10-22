import { useToggle } from '@/shared/hooks/useToggle'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'

function Panel({ title }: { title: string }) {
  // Every component that calls the hook gets its own, independent state
  const [isOpen, { toggle }] = useToggle()

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-semibold">{title}</p>
        <Button size="sm" variant="secondary" onClick={toggle}>
          {isOpen ? 'Chiudi' : 'Apri'}
        </Button>
      </div>
      {isOpen && <p className="text-sm text-zinc-500">Contenuto di {title}. Gli altri pannelli non cambiano.</p>}
    </Card>
  )
}

export function IndependentState() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Panel title="Pannello A" />
      <Panel title="Pannello B" />
      <Panel title="Pannello C" />
    </div>
  )
}
