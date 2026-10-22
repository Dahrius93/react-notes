import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { emptyLine, type InvoiceValues } from './invoiceSchema'

const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })

// A piece of the form in its own component: it gets the form from <FormProvider>, no props
export function InvoiceLines() {
  const { control, register, formState: { errors } } = useFormContext<InvoiceValues>()
  const { fields, append, remove } = useFieldArray({ control, name: 'lines' })

  // Live total: subscribes to the lines only
  const lines = useWatch({ control, name: 'lines' })
  const total = lines.reduce((sum, line) => sum + (line.quantity || 0) * (line.price || 0), 0)

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        // field.id, not index: stable key when rows are removed or reordered
        <div key={field.id} className="grid grid-cols-[1fr_5rem_6rem_auto] items-start gap-2">
          <Input
            aria-label={`Descrizione riga ${index + 1}`}
            placeholder="Descrizione"
            {...register(`lines.${index}.description`)}
            error={errors.lines?.[index]?.description?.message}
          />
          <Input
            aria-label={`Quantità riga ${index + 1}`}
            type="number"
            {...register(`lines.${index}.quantity`, { valueAsNumber: true })}
            error={errors.lines?.[index]?.quantity?.message}
          />
          <Input
            aria-label={`Prezzo riga ${index + 1}`}
            type="number"
            step="0.01"
            {...register(`lines.${index}.price`, { valueAsNumber: true })}
            error={errors.lines?.[index]?.price?.message}
          />
          <Button variant="ghost" aria-label={`Rimuovi riga ${index + 1}`} onClick={() => remove(index)}>
            ✕
          </Button>
        </div>
      ))}

      {/* Error on the array itself (e.g. min(1)) */}
      {(errors.lines?.message ?? errors.lines?.root?.message) && (
        <p className="text-sm text-red-600 dark:text-red-400">{errors.lines?.message ?? errors.lines?.root?.message}</p>
      )}

      <div className="flex items-center justify-between">
        <Button size="sm" variant="secondary" onClick={() => append(emptyLine)}>
          + Aggiungi riga
        </Button>
        <p className="font-mono text-sm">
          Totale: <strong>{euro.format(total)}</strong>
        </p>
      </div>
    </div>
  )
}
