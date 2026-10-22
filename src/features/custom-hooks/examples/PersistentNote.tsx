import { useLocalStorage } from '@/shared/hooks/useLocalStorage'
import { Button } from '@/shared/ui/Button'

export function PersistentNote() {
  // Same API as useState, plus a key: the value survives reloads
  const [note, setNote] = useLocalStorage('react-notes:demo-note', '')

  return (
    <div className="max-w-lg space-y-3">
      <label htmlFor="persistent-note" className="block text-sm font-medium">
        La tua nota
      </label>
      <textarea
        id="persistent-note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={4}
        placeholder="Scrivi qualcosa, poi ricarica la pagina…"
        className="w-full rounded-lg bg-white p-3 text-sm ring-1 ring-inset ring-zinc-300 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-zinc-900 dark:ring-zinc-700"
      />
      <div className="flex items-center justify-between text-sm text-zinc-500">
        <span>{note.length} caratteri salvati in localStorage</span>
        <Button size="sm" variant="ghost" onClick={() => setNote('')}>
          Cancella
        </Button>
      </div>
    </div>
  )
}
