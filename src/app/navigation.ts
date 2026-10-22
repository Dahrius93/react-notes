import type { ComponentType } from 'react'

export type NavItem = {
  path: string
  title: string
  summary: string
  /** Lazy import of the page (default export). Missing = section not written yet ("In arrivo"). */
  load?: () => Promise<{ default: ComponentType }>
}

export type NavGroup = {
  title: string
  items: NavItem[]
}

/**
 * Single source of truth for the sidebar, the home page and the routes.
 * Adding a page = adding an item here.
 */
export const navigation: NavGroup[] = [
  {
    title: 'Fondamenti',
    items: [
      {
        path: 'hooks-base',
        title: 'Hook di base',
        summary: 'useState, useEffect e useRef: stato, effetti collaterali e riferimenti.',
        load: () => import('@/features/hooks-base/HooksBasePage'),
      },
      {
        path: 'custom-hooks',
        title: 'Custom hook',
        summary: 'Estrarre logica riutilizzabile in hook propri, con la libreria di hook del progetto.',
        load: () => import('@/features/custom-hooks/CustomHooksPage'),
      },
      {
        path: 'form-base',
        title: 'Form con gli hook base',
        summary: 'Un form completo con useState: input controllati, validazione, submit.',
        load: () => import('@/features/form-base/FormBasePage'),
      },
      {
        path: 'reducer',
        title: 'useReducer',
        summary: 'Stato complesso con azioni tipizzate e reducer puri.',
        load: () => import('@/features/reducer/ReducerPage'),
      },
      {
        path: 'context',
        title: 'Context',
        summary: 'Condividere stato senza prop drilling: provider e hook dedicati.',
        load: () => import('@/features/context/ContextPage'),
      },
      {
        path: 'performance',
        title: 'Performance',
        summary: 'memo, useMemo, useCallback e lo spostamento dello stato verso il basso.',
        load: () => import('@/features/performance/PerformancePage'),
      },
    ],
  },
  {
    title: 'Ecosistema',
    items: [
      {
        path: 'routing',
        title: 'React Router',
        summary: 'Installazione, Link e Route, route annidate, parametri e slug, query string, 404, route protette, loader e action.',
        load: () => import('@/features/routing/RoutingPage'),
      },
      {
        path: 'data-fetching',
        title: 'Data fetching',
        summary: 'Un hook useFetch scritto a mano, poi TanStack Query: cache, invalidazione, mutation.',
        load: () => import('@/features/data-fetching/DataFetchingPage'),
      },
      {
        path: 'forms-validation',
        title: 'Form e validazione',
        summary: 'React Hook Form con schemi Zod e tipi ricavati dallo schema.',
        load: () => import('@/features/forms-validation/FormsValidationPage'),
      },
    ],
  },
  {
    title: 'Avanzato',
    items: [
      {
        path: 'advanced-hooks',
        title: 'Hook avanzati',
        summary: 'useId, useTransition, useDeferredValue, useLayoutEffect, use, useActionState, useOptimistic.',
        load: () => import('@/features/advanced-hooks/AdvancedHooksPage'),
      },
      {
        path: 'patterns',
        title: 'Pattern',
        summary: 'Error Boundary, Suspense, lazy, portali, compound component, componenti generici, ref come prop.',
        load: () => import('@/features/patterns/PatternsPage'),
      },
    ],
  },
  {
    title: 'Progetto',
    items: [
      {
        path: 'architecture',
        title: 'Architettura',
        summary: 'Struttura per funzionalità, dove mettere tipi, hook e servizi, convenzioni.',
        load: () => import('@/features/architecture/ArchitecturePage'),
      },
      {
        path: 'testing',
        title: 'Testing con Vitest',
        summary: 'Testing Library, test di componenti, hook, form e chiamate di rete.',
        load: () => import('@/features/testing/TestingPage'),
      },
    ],
  },
]

export const navItems: NavItem[] = navigation.flatMap((group) => group.items)
