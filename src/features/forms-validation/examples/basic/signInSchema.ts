import { z } from 'zod'

// The schema describes the shape of the data AND the validation rules, with the messages
export const signInSchema = z.object({
  email: z.email({ error: 'Inserisci un’email valida' }),
  password: z.string().min(8, { error: 'Almeno 8 caratteri' }),
})

// The TypeScript type comes from the schema: no duplicated type to keep in sync
export type SignInValues = z.infer<typeof signInSchema>
// → { email: string; password: string }
