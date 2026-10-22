import { z } from 'zod'

export const roles = ['frontend', 'backend', 'designer', 'other'] as const

const signupFields = z.object({
  name: z.string().trim().min(2, { error: 'Almeno 2 caratteri' }),
  username: z.string().regex(/^[A-Za-z0-9_.]{3,20}$/, { error: 'Da 3 a 20 caratteri: lettere, numeri, _ e .' }),
  email: z.email({ error: 'Formato email non valido' }),
  // Optional field: either empty or a full http(s) URL
  website: z.union([
    z.literal(''),
    z.url({ protocol: /^https?$/, error: 'Inserisci un URL completo, es. https://esempio.it' }),
  ]),
  role: z.enum(roles, { error: 'Scegli un ruolo' }),
  bio: z.string().max(200, { error: 'Massimo 200 caratteri' }),
  password: z.string().min(8, { error: 'Almeno 8 caratteri' }),
  confirmPassword: z.string(),
  newsletter: z.boolean(),
  terms: z.boolean().refine((accepted) => accepted, { error: 'Devi accettare i termini per continuare' }),
})

// Cross-field rule: attached to the object, reported on `confirmPassword`
export const signupSchema = signupFields.refine((data) => data.password === data.confirmPassword, {
  error: 'Le password non coincidono',
  path: ['confirmPassword'],
  // Zod skips object refinements when some field is invalid; `when` runs this one
  // as soon as the two password fields are valid, even if others are not
  when: (payload) => signupFields.pick({ password: true, confirmPassword: true }).safeParse(payload.value).success,
})

/** What the form holds (input) and what onSubmit receives (output, after parsing). */
export type SignupInput = z.input<typeof signupSchema>
export type SignupValues = z.output<typeof signupSchema>
