import { useId, type Key } from 'react'

type ItemPickerProps<T> = {
  label: string
  items: readonly T[]
  value: T | null
  onChange: (item: T | null) => void
  getKey: (item: T) => Key
  getLabel: (item: T) => string
}

/**
 * A <select> that works with OBJECTS, not strings: onChange gives back
 * the whole item, with its type. Native <select> only knows strings,
 * so the key is used as option value and mapped back to the item.
 */
export function ItemPicker<T>({ label, items, value, onChange, getKey, getLabel }: ItemPickerProps<T>) {
  const id = useId()

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        value={value === null ? '' : String(getKey(value))}
        onChange={(e) => onChange(items.find((item) => String(getKey(item)) === e.target.value) ?? null)}
        className="h-10 rounded-lg bg-white px-3 text-sm ring-1 ring-zinc-300 dark:bg-zinc-900 dark:ring-zinc-700"
      >
        <option value="">Scegli…</option>
        {items.map((item) => (
          <option key={getKey(item)} value={String(getKey(item))}>
            {getLabel(item)}
          </option>
        ))}
      </select>
    </div>
  )
}
