import { useId } from 'react'

function PasswordField({ label }: { label: string }) {
  // Unique and stable id for THIS instance (also identical between server and client rendering)
  const id = useId()
  const hintId = `${id}-hint` // derive more ids from the same base

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type="password"
        aria-describedby={hintId}
        className="h-10 rounded-lg bg-white px-3 text-sm ring-1 ring-zinc-300 dark:bg-zinc-900 dark:ring-zinc-700"
      />
      <p id={hintId} className="text-xs text-zinc-500">
        Almeno 8 caratteri
      </p>
      <p className="font-mono text-[11px] text-zinc-400">
        id=&quot;{id}&quot; · aria-describedby=&quot;{hintId}&quot;
      </p>
    </div>
  )
}

// The same component twice: no id collisions, clicking a label focuses the right input
export function PasswordFields() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <PasswordField label="Password" />
      <PasswordField label="Conferma password" />
    </div>
  )
}
