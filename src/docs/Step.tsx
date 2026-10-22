import type { ReactNode } from 'react'

type StepProps = {
  n: number
  title: string
  children: ReactNode
}

/** A numbered step of a "Primo esempio, passo per passo" walkthrough. */
export function Step({ n, title, children }: StepProps) {
  return (
    <div className="relative border-l-2 border-sky-200 pb-2 pl-7 dark:border-sky-900">
      <span className="absolute -left-3.25 top-0 grid size-6 place-items-center rounded-full bg-sky-600 text-xs font-bold text-white">
        {n}
      </span>
      <h3 className="mb-3 font-semibold leading-6 text-zinc-900 dark:text-zinc-100">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}
