import { Link } from 'react-router'
import { Callout } from '@/docs/Callout'
import { CodeBlock, CodeCompare } from '@/docs/CodeBlock'
import { Example } from '@/docs/Example'
import { Page } from '@/docs/Page'
import { Prose, Section } from '@/docs/Section'
import { Step } from '@/docs/Step'
import { Table } from '@/docs/Table'
import bookmarkButtonSrc from '@/features/bookmarks/BookmarkButton.tsx?raw'
import bookmarksListSrc from '@/features/bookmarks/BookmarksList.tsx?raw'
import bookmarksStoreSrc from '@/features/bookmarks/bookmarksStore.ts?raw'
import bookmarksTestSrc from '@/features/bookmarks/__tests__/bookmarks.test.tsx?raw'
import bookmarkTypesSrc from '@/features/bookmarks/types.ts?raw'
import useBookmarksSrc from '@/features/bookmarks/useBookmarks.ts?raw'
import architectureTestSrc from '@/test/architecture.test.ts?raw'
import { BookmarksDemo } from './examples/BookmarksDemo'
import bookmarksDemoSrc from './examples/BookmarksDemo.tsx?raw'

export default function ArchitecturePage() {
  return (
    <Page
      title="Architettura"
      lead="Come organizzare un progetto React perché resti facile da capire e da cambiare: cartelle per funzionalità, dipendenze in una sola direzione, logica fuori dai componenti. Il caso di studio è questo stesso progetto."
    >
      {/* ------------------------------------------------------------------ */}
      <Section id="primo-esempio" title="Primo esempio: aggiungere una funzionalità passo per passo">
        <Prose>
          <p>
            Il modo migliore per capire un'architettura è aggiungerci qualcosa. Qui aggiungiamo una funzionalità vera a
            queste note: i <strong>preferiti</strong>. Una stellina ☆ nell'header salva la pagina corrente, e la home
            mostra l'elenco. Prova la stellina in alto a destra in questa pagina.
          </p>
        </Prose>
        <CodeBlock
          language="bash"
          filename="struttura"
          code={`src/features/bookmarks/
  types.ts             # 1. the shape of the data
  bookmarksStore.ts    # 2. the logic, in plain TypeScript (no React)
  useBookmarks.ts      # 3. the React side: a hook
  BookmarkButton.tsx   # 4. the components
  BookmarksList.tsx
  __tests__/           # 6. tests next to the code they test
src/app/layout/RootLayout.tsx, src/app/pages/HomePage.tsx   # 5. wired into the app`}
        />

        <Step n={1} title="Una cartella per la funzionalità, e i suoi tipi">
          <Prose>
            <p>
              Tutto ciò che riguarda i preferiti sta in <code>src/features/bookmarks/</code>. Se un giorno la funzionalità
              sparisce, si cancella una cartella. Si parte dal tipo dei dati.
            </p>
          </Prose>
          <CodeBlock code={bookmarkTypesSrc} language="ts" filename="features/bookmarks/types.ts" />
        </Step>

        <Step n={2} title="La logica in TypeScript puro">
          <Prose>
            <p>
              Leggere e salvare in <code>localStorage</code>, aggiungere, togliere, avvisare chi è interessato: nessuna di
              queste cose ha bisogno di React. Stanno in un modulo <code>.ts</code> che si testa con poche righe, senza
              renderizzare nulla. È una <strong>factory</strong> (<code>createBookmarksStore</code>), così i test possono
              crearne una con uno storage finto.
            </p>
          </Prose>
          <CodeBlock code={bookmarksStoreSrc} language="ts" filename="features/bookmarks/bookmarksStore.ts" />
        </Step>

        <Step n={3} title="Il lato React: un hook">
          <Prose>
            <p>
              <code>useSyncExternalStore</code> collega lo store a React (pagina{' '}
              <Link to="/custom-hooks#estrarre">Custom hook</Link>): ogni componente che usa <code>useBookmarks()</code>{' '}
              si aggiorna quando i preferiti cambiano, anche da un'altra scheda.
            </p>
          </Prose>
          <CodeBlock code={useBookmarksSrc} language="ts" filename="features/bookmarks/useBookmarks.ts" />
        </Step>

        <Step n={4} title="I componenti">
          <Prose>
            <p>
              Componenti piccoli che usano l'hook e i mattoni di <code>shared/ui</code> (<code>Button</code>,{' '}
              <code>List</code>). Non sanno nulla di <code>localStorage</code>.
            </p>
          </Prose>
          <div className="grid gap-4 xl:grid-cols-2">
            <CodeBlock code={bookmarkButtonSrc} filename="features/bookmarks/BookmarkButton.tsx" />
            <CodeBlock code={bookmarksListSrc} filename="features/bookmarks/BookmarksList.tsx" />
          </div>
        </Step>

        <Step n={5} title="Collegarla all'app">
          <Prose>
            <p>
              La funzionalità non si inserisce da sola: è lo strato <code>app</code> a usarla. Il layout mette la stellina
              nell'header per le pagine di note, la home mostra l'elenco. La stellina sta nel layout e{' '}
              <strong>non</strong> nel componente <code>Page</code> di <code>docs/</code>: così <code>docs</code> non
              dipende da <code>features</code>, come vogliono le regole qui sotto.
            </p>
          </Prose>
          <CodeBlock
            code={`// src/app/layout/RootLayout.tsx
const { pathname } = useLocation()
const currentNote = navItems.find((item) => item.load && pathname === \`/\${item.path}\`)
...
{currentNote && <BookmarkButton path={pathname} title={currentNote.title} />}

// src/app/pages/HomePage.tsx
<section>
  <h2>I tuoi preferiti</h2>
  <BookmarksList />
</section>`}
          />
        </Step>

        <Step n={6} title="I test">
          <Prose>
            <p>
              Lo store si testa come funzione pura, con uno storage in memoria; i componenti si testano insieme, per
              verificare che restino sincronizzati.
            </p>
          </Prose>
          <CodeBlock code={bookmarksTestSrc} filename="features/bookmarks/__tests__/bookmarks.test.tsx" />
        </Step>

        <Example title="I preferiti, collegati alla stellina dell'header" code={bookmarksDemoSrc} file="src/features/architecture/examples/BookmarksDemo.tsx">
          <BookmarksDemo />
        </Example>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="struttura" title="Struttura per funzionalità">
        <Prose>
          <p>
            Ci sono due modi di dividere le cartelle. <strong>Per tipo</strong>: tutti i componenti insieme, tutti gli hook
            insieme. È semplice all'inizio, ma per modificare una funzionalità devi saltare tra cinque cartelle.{' '}
            <strong>Per funzionalità</strong>: tutto ciò che riguarda una cosa sta insieme, e il codice davvero condiviso
            sta in una cartella a parte.
          </p>
        </Prose>
        <CodeCompare
          language="bash"
          bad={`src/
  components/
    BookmarkButton.tsx
    LoginForm.tsx
    TodoItem.tsx      # 80 files...
  hooks/
    useBookmarks.ts
    useAuth.ts
  services/
  types/`}
          good={`src/
  features/
    bookmarks/   # everything about bookmarks
    auth/        # everything about login
  shared/        # used by many features
    ui/  hooks/  api/  lib/
  app/           # wiring: router, layout, providers`}
        />
        <Prose>
          <p>La struttura reale di queste note:</p>
        </Prose>
        <CodeBlock
          language="bash"
          filename="src/"
          code={`app/                 # the application shell: knows everything, nobody imports it
  navigation.ts      # list of pages → sidebar, home and routes
  router.tsx         # route objects (lazy pages, protected routes)
  providers.tsx      # QueryClientProvider, AuthProvider
  layout/  pages/    # RootLayout, Sidebar, Home, 404, error page
docs/                # tools to write the notes: Page, Section, Step, Example, CodeBlock, RouterSandbox...
features/            # one folder per feature
  auth/              # a real feature: AuthProvider, useAuth, RequireAuth, LoginPage...
  bookmarks/         # a real feature: the ☆ bookmarks
  hooks-base/  routing/  data-fetching/  ...   # one note page each, with its examples/
shared/              # reusable, knows nothing about the features
  api/               # http client, JSONPlaceholder services, queryClient, queryOptions
  hooks/             # useToggle, useLocalStorage, useFetch, useAsync, useSimpleForm...
  lib/               # pure functions: cn, slugify, validators, sleep...
  ui/                # Button, Input, Modal, Tabs, List, ErrorBoundary...
test/                # Vitest setup + architecture test`}
        />
        <Table
          head={['Cartella', 'Contiene', 'Può importare da']}
          rows={[
            ['`shared/`', 'Codice generico, senza conoscenza del dominio. Copiabile in un altro progetto.', 'Solo `shared/` e librerie'],
            ['`features/x/`', 'Una funzionalità: componenti, hook, logica, tipi, test', '`shared/`, se stessa, e poche altre funzionalità dichiarate'],
            ['`docs/`', 'Gli strumenti per scrivere le note', '`shared/`'],
            ['`app/`', 'Router, layout, provider, pagine di servizio: collega tutto', 'Tutto'],
          ]}
        />
        <Callout variant="tip" title="Quando qualcosa va in shared?">
          <p>
            Non subito. Un componente nasce nella funzionalità che lo usa; quando una <strong>seconda</strong> funzionalità
            ne ha bisogno, e se non contiene logica di dominio, si sposta in <code>shared/</code>. Spostare troppo presto
            crea astrazioni sbagliate.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="dipendenze" title="Dipendenze in una sola direzione">
        <Prose>
          <p>
            La regola che tiene in piedi tutto: gli import vanno in <strong>una sola direzione</strong>.
          </p>
        </Prose>
        <CodeBlock
          language="bash"
          code={`app  ──→  features  ──→  shared
 └──────→  docs  ─────────↗`}
        />
        <Prose>
          <ul>
            <li>
              <code>shared</code> non importa mai da <code>features</code> o <code>app</code>: è per questo che si può
              copiare in un altro progetto;
            </li>
            <li>
              una funzionalità non importa da <code>app</code>: le pagine non sanno come sono collegate al router;
            </li>
            <li>
              le funzionalità si importano tra loro il meno possibile, e solo come <strong>eccezione dichiarata</strong>.
            </li>
          </ul>
          <p>
            Le regole scritte solo in un documento prima o poi vengono infrante. Qui sono controllate da un{' '}
            <strong>test di architettura</strong>, che legge i sorgenti con <code>import.meta.glob</code> e fallisce se
            qualcuno importa nella direzione sbagliata. Le eccezioni consapevoli sono elencate nel test:{' '}
            <code>context</code> e <code>routing</code> riusano <code>auth</code>, <code>context</code> riusa il reducer
            delle attività, questa pagina usa <code>bookmarks</code>.
          </p>
        </Prose>
        <CodeBlock code={architectureTestSrc} language="ts" filename="src/test/architecture.test.ts" />
        <Callout variant="note" title="In alternativa: una regola del linter">
          <p>
            Lo stesso controllo si fa con il linter, ad esempio con <code>no-restricted-imports</code> per cartella o con{' '}
            <code>eslint-plugin-boundaries</code>. Il vantaggio è l'errore direttamente nell'editor; il test ha il vantaggio
            di non richiedere plugin e di essere scritto in TypeScript.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="strati" title="Gli strati: dal server allo schermo">
        <Prose>
          <p>
            Dentro una funzionalità il codice si divide in strati. Ognuno usa solo quello sotto di sé, e i componenti
            restano piccoli e leggibili.
          </p>
        </Prose>
        <Table
          head={['Strato', 'Responsabilità', 'Esempio nel progetto']}
          rows={[
            ['Client HTTP', 'fetch, JSON, errori HTTP', '`shared/api/http.ts` → `request()`, `HttpError`'],
            ['Servizi', 'Una funzione per endpoint, tipizzata', '`shared/api/jsonplaceholder/users.ts` → `getUser(id)`'],
            ['Query', 'Key + funzione per la cache', '`shared/api/jsonplaceholder/queries.ts` → `userQueries.detail(id)`'],
            ['Logica pura', 'Regole del dominio, senza React', '`todosReducer`, `validateSignup`, `slugify`, `bookmarksStore`'],
            ['Hook', 'Collegano logica e dati a React', '`useAuth`, `useBookmarks`, `useAddTodo`'],
            ['Componenti', 'Mostrano dati e raccolgono input', '`BookmarkButton`, `TodoManager`, `SignupForm`'],
            ['Pagine / route', 'Compongono i componenti, leggono URL e parametri', '`LoginPage`, le pagine delle note'],
          ]}
        />
        <CodeCompare
          bad={`function UserPage() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    fetch(\`https://api.../users/\${id}\`)
      .then((r) => r.json())
      .then(setUser)
  }, [id])
  const isAdult = user && 2026 - user.birthYear >= 18
  // ...100 more lines mixing everything
}`}
          good={`function UserPage() {
  const { userId } = useParams()
  const { data: user } = useQuery(userQueries.detail(Number(userId)))
  if (!user) return <Spinner />
  return <UserCard user={user} canBuy={isAdult(user)} />
}
// URL → query → pure function → component`}
        />
        <Callout variant="tip" title="Logica fuori dai componenti">
          <p>
            Tutto ciò che si può scrivere come funzione pura (calcoli, validazioni, trasformazioni, reducer) va fuori dal
            componente, in un file <code>.ts</code>. È riutilizzabile, si testa in millisecondi e il componente si legge in
            un colpo d'occhio.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="tipi" title="Dove mettere i tipi">
        <Table
          head={['Tipo', 'Dove', 'Esempio']}
          rows={[
            ['Dati di un’API', 'Accanto ai servizi', '`shared/api/jsonplaceholder/types.ts`'],
            ['Dati derivati da uno schema', 'Accanto allo schema, con `z.infer`', '`signupSchema.ts` → `SignupValues`'],
            ['Dati di una funzionalità', 'Nella funzionalità', '`features/bookmarks/types.ts`'],
            ['Props di un componente', 'Nello stesso file, sopra il componente', '`type ButtonProps = ...`'],
            ['Valore di un context', 'Accanto al context', '`authContext.ts` → `AuthContextValue`'],
            ['Tipo ricavato da una funzione', 'Non si riscrive: si ricava', '`ReturnType<typeof createBookmarksStore>`'],
          ]}
        />
        <Prose>
          <p>Convenzioni del progetto:</p>
          <ul>
            <li>
              <code>type</code> per tutto (oggetti, unioni, props); <code>interface</code> solo quando serve estendere un
              tipo di una libreria;
            </li>
            <li>
              <code>import type</code> per gli import usati solo come tipi: con <code>verbatimModuleSyntax</code> in{' '}
              <code>tsconfig</code> è obbligatorio, e garantisce che non finiscano nel bundle;
            </li>
            <li>
              niente <code>any</code>: per dati sconosciuti <code>unknown</code>, da restringere con un controllo o uno
              schema Zod;
            </li>
            <li>
              una sola fonte di verità: se un tipo si può <strong>ricavare</strong> (<code>z.infer</code>,{' '}
              <code>ReturnType</code>, <code>typeof</code>, <code>{'useLoaderData<typeof loader>'}</code>), non si
              riscrive a mano.
            </li>
          </ul>
        </Prose>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="componenti" title="Tre tipi di componenti">
        <Table
          head={['Tipo', 'Caratteristiche', 'Esempi']}
          rows={[
            ['UI generici (`shared/ui`)', 'Nessun dato, nessuna chiamata API. Ricevono tutto via props, inoltrano `ref` e `...props` al DOM.', '`Button`, `Input`, `Modal`, `Tabs`, `List`'],
            ['Di dominio (`features/x`)', 'Conoscono la funzionalità: usano i suoi hook e le sue query.', '`BookmarkButton`, `LoginForm`, `UserMenu`'],
            ['Pagine', 'Sottili: leggono l’URL, chiamano gli hook, compongono i componenti.', '`LoginPage`, `AccountPage`'],
          ]}
        />
        <Prose>
          <p>
            I componenti UI generici seguono le stesse regole: accettano <code>className</code> e le props native del tag
            che renderizzano (<code>{"ComponentProps<'button'>"}</code>), usano <code>useId</code> per l'accessibilità, e
            non decidono margini esterni (ci pensa chi li usa).
          </p>
        </Prose>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="convenzioni" title="Convenzioni">
        <Table
          head={['Cosa', 'Convenzione', 'Esempio']}
          rows={[
            ['Componenti', '`PascalCase.tsx`, un componente principale per file', '`BookmarkButton.tsx`'],
            ['Hook', '`useQualcosa.ts`', '`useBookmarks.ts`'],
            ['Funzioni e moduli', '`camelCase.ts`', '`slugify.ts`, `bookmarksStore.ts`'],
            ['Test', 'In `__tests__/` accanto al codice, `.test.ts(x)`', '`bookmarks/__tests__/bookmarks.test.tsx`'],
            ['Export', 'Con nome; `default` solo per le pagine caricate in lazy', '`export function List`, `export default function LoginPage`'],
            ['File `.tsx`', 'Esportano solo componenti (Fast Refresh); context, costanti e helper in un `.ts`', '`authContext.ts` + `AuthProvider.tsx`'],
            ['Import', 'Alias `@/` per le altre cartelle, relativi `./` dentro la stessa funzionalità', '`@/shared/ui/Button`, `./useBookmarks`'],
            ['Costanti', '`UPPER_SNAKE_CASE` se sono configurazione', '`STORAGE_KEY`, `API_URL`'],
            ['Lingua', 'Codice e commenti in inglese, testi dell’interfaccia in italiano', '—'],
          ]}
        />
        <Prose>
          <h3>Barrel file (index.ts) sì o no?</h3>
          <p>
            Un barrel è un <code>index.ts</code> che riesporta il contenuto di una cartella, per scrivere{' '}
            <code>{"import { useAuth } from '@/features/auth'"}</code>. In questo progetto <strong>non</strong> si usano:
          </p>
        </Prose>
        <Table
          head={['Pro', 'Contro']}
          rows={[
            ['Import più corti', 'Importare una cosa carica tutto il modulo: test e dev server più lenti'],
            ['Definisce l’API pubblica di una funzionalità', 'Facile creare import circolari'],
            ['Si può riorganizzare l’interno senza toccare chi importa', 'Il code splitting e il tree shaking funzionano peggio'],
          ]}
        />
        <Prose>
          <p>
            Un compromesso ragionevole nei progetti grandi: un barrel <strong>solo</strong> come API pubblica di ogni
            funzionalità (<code>features/auth/index.ts</code>), mai dentro <code>shared/</code>, e import diretti
            all'interno della funzionalità stessa.
          </p>
        </Prose>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="crescere" title="Quando il progetto cresce">
        <Prose>
          <ul>
            <li>
              <strong>Più persone</strong>: le regole sulle dipendenze, nel test o nel linter, diventano indispensabili.
              Ogni funzionalità può avere un responsabile.
            </li>
            <li>
              <strong>Più app</strong> che condividono codice: <code>shared/ui</code> diventa un pacchetto (design system)
              in un monorepo, ad esempio con pnpm workspaces.
            </li>
            <li>
              <strong>Funzionalità molto grandi</strong>: al loro interno si ripete la stessa struttura, con{' '}
              <code>components/</code>, <code>hooks/</code>, <code>api/</code> e un <code>index.ts</code> pubblico.
            </li>
            <li>
              <strong>Rendering lato server, SEO</strong>: React Router in modalità framework, o Next.js. Le cartelle{' '}
              <code>shared</code> e <code>features</code> si portano dietro quasi intatte.
            </li>
          </ul>
        </Prose>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="checklist" title="Checklist per una nuova funzionalità">
        <Prose>
          <ol>
            <li>
              Una cartella in <code>features/</code>, con i suoi tipi.
            </li>
            <li>La logica in funzioni pure o in uno store, in file <code>.ts</code>.</li>
            <li>
              Le chiamate API come servizi e <code>queryOptions</code>; se sono generiche, in <code>shared/api</code>.
            </li>
            <li>Un hook che collega logica e dati a React.</li>
            <li>
              Componenti piccoli, costruiti con <code>shared/ui</code>.
            </li>
            <li>
              Il collegamento all'app (route, layout, provider) in <code>app/</code>.
            </li>
            <li>Test accanto al codice: la logica come funzione pura, i componenti come li usa l'utente.</li>
            <li>
              Il test di architettura passa: nessuna dipendenza nella direzione sbagliata.
            </li>
          </ol>
        </Prose>
      </Section>
    </Page>
  )
}
