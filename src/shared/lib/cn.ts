import { clsx, type ClassValue } from 'clsx'

/** Joins conditional class names: cn('px-2', isActive && 'bg-sky-500') */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
