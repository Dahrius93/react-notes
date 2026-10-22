import { useState, type ChangeEvent } from 'react'
import { Checkbox } from '@/shared/ui/Checkbox'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'
import { Textarea } from '@/shared/ui/Textarea'

type Values = {
  name: string
  age: string // kept as string: <input type="number"> can be temporarily empty
  country: string
  plan: string
  newsletter: boolean
  notes: string
}

const initialValues: Values = {
  name: '',
  age: '',
  country: 'it',
  plan: 'free',
  newsletter: false,
  notes: '',
}

const plans = ['free', 'pro', 'team']

export function MultiFieldState() {
  const [values, setValues] = useState(initialValues)

  // One handler for every field: the input's `name` says which key to update
  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.target
    const isCheckbox = event.target instanceof HTMLInputElement && event.target.type === 'checkbox'
    setValues((prev) => ({
      ...prev,
      [name]: isCheckbox ? (event.target as HTMLInputElement).checked : value,
    }))
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <Input name="name" label="Nome" value={values.name} onChange={handleChange} />
        <Input name="age" label="Età" type="number" min={0} value={values.age} onChange={handleChange} />
        <Select
          name="country"
          label="Paese"
          value={values.country}
          onChange={handleChange}
          options={[
            { value: 'it', label: 'Italia' },
            { value: 'ch', label: 'Svizzera' },
            { value: 'fr', label: 'Francia' },
          ]}
        />
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium">Piano</legend>
          <div className="flex gap-4">
            {plans.map((plan) => (
              <label key={plan} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="plan"
                  value={plan}
                  checked={values.plan === plan}
                  onChange={handleChange}
                  className="accent-sky-600"
                />
                {plan}
              </label>
            ))}
          </div>
        </fieldset>
        <Checkbox name="newsletter" label="Iscrivimi alla newsletter" checked={values.newsletter} onChange={handleChange} />
        <Textarea name="notes" label="Note" rows={2} value={values.notes} onChange={handleChange} />
      </div>

      <pre className="self-start rounded-lg bg-zinc-100 p-3 font-mono text-xs dark:bg-zinc-900">
        {JSON.stringify(values, null, 2)}
      </pre>
    </div>
  )
}
