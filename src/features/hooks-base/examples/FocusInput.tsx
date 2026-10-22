import { useRef } from 'react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

export function FocusInput() {
  // Filled by React with the <input> DOM node after mount, null after unmount
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="max-w-md space-y-4">
      {/* React 19: `ref` is a normal prop, Input passes it down to <input> */}
      <Input ref={inputRef} label="Cerca" defaultValue="Testo di prova" />

      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => inputRef.current?.focus()}>
          Focus
        </Button>
        <Button size="sm" variant="secondary" onClick={() => inputRef.current?.select()}>
          Seleziona tutto
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            const input = inputRef.current
            if (!input) return
            input.value = '' // uncontrolled input: we may touch the DOM directly
            input.focus()
          }}
        >
          Svuota e focus
        </Button>
      </div>
    </div>
  )
}
