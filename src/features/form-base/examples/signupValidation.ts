import type { FormErrors } from '@/shared/hooks/useSimpleForm'
import { hasMinLength, isBlank, isEmail, isUrl } from '@/shared/lib/validators'

export type SignupValues = {
  name: string
  username: string
  email: string
  website: string
  role: string
  bio: string
  newsletter: boolean
  terms: boolean
}

export const initialSignupValues: SignupValues = {
  name: '',
  username: '',
  email: '',
  website: '',
  role: '',
  bio: '',
  newsletter: true,
  terms: false,
}

export const BIO_MAX_LENGTH = 200

/** Pure function: easy to read, reuse and unit test. Keys are checked in field order. */
export function validateSignup(values: SignupValues): FormErrors<SignupValues> {
  const errors: FormErrors<SignupValues> = {}

  if (isBlank(values.name)) errors.name = 'Il nome è obbligatorio'
  else if (!hasMinLength(values.name, 2)) errors.name = 'Almeno 2 caratteri'

  if (isBlank(values.username)) errors.username = 'Lo username è obbligatorio'
  else if (!/^[a-z0-9_]{3,20}$/.test(values.username)) {
    errors.username = 'Da 3 a 20 caratteri: lettere minuscole, numeri e _'
  }

  if (isBlank(values.email)) errors.email = 'L’email è obbligatoria'
  else if (!isEmail(values.email)) errors.email = 'Formato email non valido'

  // Optional field: validate only when filled
  if (!isBlank(values.website) && !isUrl(values.website)) {
    errors.website = 'Inserisci un URL completo, es. https://esempio.it'
  }

  if (!values.role) errors.role = 'Scegli un ruolo'

  if (values.bio.length > BIO_MAX_LENGTH) errors.bio = `Massimo ${BIO_MAX_LENGTH} caratteri`

  if (!values.terms) errors.terms = 'Devi accettare i termini per continuare'

  return errors
}
