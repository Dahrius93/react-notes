import { useState } from 'react'
import { Badge } from '@/shared/ui/Badge'
import * as Tabs from '@/shared/ui/Tabs'

export function ProductTabs() {
  const [tab, setTab] = useState('details')

  return (
    <div className="space-y-6">
      {/* Uncontrolled: Tabs keeps its own state */}
      <Tabs.Root defaultValue="details">
        <Tabs.List label="Scheda prodotto">
          <Tabs.Trigger value="details">Dettagli</Tabs.Trigger>
          <Tabs.Trigger value="reviews">
            Recensioni <Badge tone="info">12</Badge>
          </Tabs.Trigger>
          <Tabs.Trigger value="shipping">Spedizione</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="details">
          <p className="text-sm">Cuffie wireless con cancellazione del rumore. Usa le frecce ← → sulle tab.</p>
        </Tabs.Panel>
        <Tabs.Panel value="reviews">
          <p className="text-sm">★★★★☆ “Ottimo suono, batteria infinita.”</p>
        </Tabs.Panel>
        <Tabs.Panel value="shipping">
          <p className="text-sm">Consegna in 24/48 ore.</p>
        </Tabs.Panel>
      </Tabs.Root>

      {/* Controlled: the parent decides, e.g. to sync the tab with the URL */}
      <Tabs.Root value={tab} onValueChange={setTab}>
        <Tabs.List label="Esempio controllato">
          <Tabs.Trigger value="details">Uno</Tabs.Trigger>
          <Tabs.Trigger value="other">Due</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="details">
          <p className="text-sm">Tab controllata dal padre: valore attuale “{tab}”.</p>
        </Tabs.Panel>
        <Tabs.Panel value="other">
          <p className="text-sm">Tab controllata dal padre: valore attuale “{tab}”.</p>
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  )
}
