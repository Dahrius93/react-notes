import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Panel } from './Panel'

export function SlotsDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Panel
        title={
          <>
            Ordini <Badge tone="info">3</Badge>
          </>
        }
        actions={
          <>
            <Button size="sm" variant="ghost">
              Esporta
            </Button>
            <Button size="sm">Nuovo</Button>
          </>
        }
        footer="Aggiornato 2 minuti fa"
      >
        Tre ordini in attesa di spedizione.
      </Panel>

      {/* Same component, only the slots that are needed */}
      <Panel title="Note">Nessuna azione, nessun footer.</Panel>
    </div>
  )
}
