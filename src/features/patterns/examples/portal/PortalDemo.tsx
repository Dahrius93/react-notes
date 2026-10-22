import { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'

// The same box rendered in place: trapped by the parent's overflow-hidden
function InlinePopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute left-4 top-16 z-50 w-72 rounded-lg bg-white p-4 text-sm shadow-xl ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-700">
      <p>Sono renderizzato dentro il riquadro: il suo <code>overflow-hidden</code> mi taglia.</p>
      <Button size="sm" className="mt-3" onClick={onClose}>
        Chiudi
      </Button>
    </div>
  )
}

export function PortalDemo() {
  const [isInlineOpen, setIsInlineOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [clicks, setClicks] = useState(0)

  return (
    // React events bubble through the React tree: clicks inside the portal reach this div
    <div onClick={() => setClicks((c) => c + 1)} className="space-y-3">
      <p className="text-xs text-zinc-500">Clic ricevuti da questo contenitore: {clicks}</p>
      <div className="relative h-32 overflow-hidden rounded-lg bg-zinc-50 p-4 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
        <p className="mb-3 text-xs text-zinc-500">Riquadro con overflow-hidden</p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => setIsInlineOpen(true)}>
            Apri senza portale
          </Button>
          <Button size="sm" onClick={() => setIsModalOpen(true)}>
            Apri con portale
          </Button>
        </div>
        {isInlineOpen && <InlinePopup onClose={() => setIsInlineOpen(false)} />}
      </div>

      {/* Declared here, rendered in <body> by createPortal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Modale in un portale"
        footer={
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Chiudi
          </Button>
        }
      >
        Sono nel <code>{'<body>'}</code>, fuori dal riquadro: niente mi taglia. Prova Tab (il focus resta qui), Esc o un
        clic sullo sfondo. Ogni clic qui dentro arriva comunque al contenitore della demo, perché per React sono ancora
        suo figlio.
      </Modal>
    </div>
  )
}
