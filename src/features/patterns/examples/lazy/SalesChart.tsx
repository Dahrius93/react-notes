// Pretend this is a heavy component (a charting library, an editor...):
// it lives in its own file so Vite can put it in a separate chunk

const sales = [
  { month: 'Gen', value: 32 },
  { month: 'Feb', value: 45 },
  { month: 'Mar', value: 28 },
  { month: 'Apr', value: 60 },
  { month: 'Mag', value: 52 },
  { month: 'Giu', value: 75 },
]

export default function SalesChart() {
  const max = Math.max(...sales.map((s) => s.value))
  return (
    <figure>
      <div className="flex h-40 items-end gap-3" role="img" aria-label="Vendite per mese">
        {sales.map((s) => (
          <div key={s.month} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-xs text-zinc-500">{s.value}</span>
            <div className="w-full rounded-t bg-sky-500" style={{ height: `${(s.value / max) * 100}%` }} />
            <span className="text-xs">{s.month}</span>
          </div>
        ))}
      </div>
      <figcaption className="mt-2 text-xs text-zinc-500">Caricato su richiesta con React.lazy</figcaption>
    </figure>
  )
}
