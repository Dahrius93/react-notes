import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { InvoiceLines } from './InvoiceLines'
import { emptyLine, invoiceSchema, type InvoiceValues } from './invoiceSchema'

export function InvoiceForm() {
  const [result, setResult] = useState<InvoiceValues | null>(null)
  const methods = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: { customer: '', lines: [emptyLine] },
  })
  const { register, handleSubmit, formState: { errors } } = methods

  return (
    // FormProvider makes `methods` available to every child via useFormContext()
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(setResult)} noValidate className="space-y-4">
        <Input label="Cliente *" {...register('customer')} error={errors.customer?.message} />
        <InvoiceLines />
        <Button type="submit">Crea fattura</Button>
        {result && (
          <pre className="rounded-lg bg-zinc-100 p-3 font-mono text-xs dark:bg-zinc-900">{JSON.stringify(result, null, 2)}</pre>
        )}
      </form>
    </FormProvider>
  )
}
