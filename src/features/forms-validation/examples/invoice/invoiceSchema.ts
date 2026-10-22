import { z } from 'zod'

export const invoiceLineSchema = z.object({
  description: z.string().trim().min(1, { error: 'Obbligatoria' }),
  // Empty number inputs give NaN with valueAsNumber: z.number() rejects it with this message
  quantity: z.number({ error: 'Numero' }).int({ error: 'Intero' }).min(1, { error: 'Min. 1' }),
  price: z.number({ error: 'Numero' }).min(0, { error: 'Min. 0' }),
})

export const invoiceSchema = z.object({
  customer: z.string().trim().min(2, { error: 'Indica il cliente' }),
  lines: z.array(invoiceLineSchema).min(1, { error: 'Aggiungi almeno una riga' }),
})

export type InvoiceValues = z.infer<typeof invoiceSchema>

export const emptyLine: InvoiceValues['lines'][number] = { description: '', quantity: 1, price: 0 }
