import { Link } from 'react-router'
import { Callout } from '@/docs/Callout'
import { CodeBlock, CodeCompare } from '@/docs/CodeBlock'
import { Example } from '@/docs/Example'
import { Page } from '@/docs/Page'
import { Prose, Section } from '@/docs/Section'
import { Step } from '@/docs/Step'
import { Table } from '@/docs/Table'
import authTestSrc from '@/features/auth/__tests__/auth.test.tsx?raw'
import authContextSrc from '@/features/auth/authContext.ts?raw'
import authProviderSrc from '@/features/auth/AuthProvider.tsx?raw'
import createStrictContextSrc from '@/shared/lib/createStrictContext.ts?raw'
import providersSrc from '@/app/providers.tsx?raw'
import { AccentDemo } from './examples/AccentDemo'
import accentDemoSrc from './examples/AccentDemo.tsx?raw'
import { AuthDemo } from './examples/AuthDemo'
import authDemoSrc from './examples/AuthDemo.tsx?raw'
import basicAppSrc from './examples/basic/App.tsx?raw'
import { BasicContextDemo } from './examples/basic/BasicContextDemo'
import basicContextDemoSrc from './examples/basic/BasicContextDemo.tsx?raw'
import themeContextSrc from './examples/basic/ThemeContext.ts?raw'
import themeProviderSrc from './examples/basic/ThemeProvider.tsx?raw'
import useThemeSrc from './examples/basic/useTheme.ts?raw'
import todosContextSrc from './examples/todos-store/todosContext.ts?raw'
import todosProviderSrc from './examples/todos-store/TodosProvider.tsx?raw'
import { TodosStoreDemo } from './examples/todos-store/TodosStoreDemo'
import todosStoreDemoSrc from './examples/todos-store/TodosStoreDemo.tsx?raw'

const DIR = 'src/features/context/examples'

export default function ContextPage() {
  return (
    <Page
      title="Context"
      lead="Rendere un valore disponibile a tutto un sottoalbero di componenti, senza passarlo come prop a ogni livello."
    >
      {/* ------------------------------------------------------------------ */}
      <Section id="prop-drilling" title="Il problema: prop drilling">
        <Prose>
          <p>
            In React i dati scendono dall'alto verso il basso tramite le props. Quando un dato serve a un componente molto
            in profondità, tutti i componenti intermedi devono riceverlo e passarlo avanti, anche se a loro non serve:
            è il <strong>prop drilling</strong>.
          </p>
        </Prose>
        <CodeBlock
          code={`function App() {
  const [user, setUser] = useState<User | null>(null)
  return <Layout user={user} onLogout={() => setUser(null)} />
}

function Layout({ user, onLogout }) {        // doesn't use them, just passes them
  return <Header user={user} onLogout={onLogout} />
}

function Header({ user, onLogout }) {        // doesn't use them either
  return <UserMenu user={user} onLogout={onLogout} />
}

function UserMenu({ user, onLogout }) { ... } // the only one that needs them`}
        />
        <Prose>
          <p>
            Il Context risolve proprio questo: un componente in alto <strong>fornisce</strong> un valore e qualsiasi
            discendente lo <strong>legge</strong> direttamente, saltando i livelli intermedi.
          </p>
        </Prose>
        <Callout variant="tip" title="Prima del Context, prova la composizione">
          <p>
            Spesso il drilling sparisce passando componenti già pronti come <code>children</code>. Se{' '}
            <code>Layout</code> riceve <code>{'<UserMenu user={user} />'}</code> come figlio, non deve più sapere nulla
            dell'utente. Ne parliamo più sotto, in <a href="#quando-no">Quando non usarlo</a>.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="primo-esempio" title="Primo esempio, passo per passo">
        <Prose>
          <p>
            Un tema chiaro/scuro condiviso da tutta l'app. Ogni passo è un file, come in un progetto vero:
          </p>
        </Prose>
        <CodeBlock
          language="bash"
          filename="struttura"
          code={`src/
  theme/
    ThemeContext.ts    # 1. createContext
    useTheme.ts        # 2. hook to read it (and check the provider is there)
    ThemeProvider.tsx  # 3. component that owns the state
  main.tsx             # 4. <ThemeProvider> wraps <App />
  App.tsx              # 5. any component calls useTheme()`}
        />

        <Step n={1} title="Crea il context">
          <Prose>
            <p>
              <code>createContext</code> crea il &quot;canale&quot; attraverso cui passerà il valore. L'argomento è il valore
              di default, usato solo da un componente che <strong>non</strong> ha un provider sopra di sé. Qui è{' '}
              <code>null</code>, apposta: significa &quot;provider mancante&quot;.
            </p>
          </Prose>
          <CodeBlock code={themeContextSrc} language="ts" filename="src/theme/ThemeContext.ts" />
        </Step>

        <Step n={2} title="Crea un hook per leggerlo">
          <Prose>
            <p>
              Si potrebbe chiamare <code>useContext(ThemeContext)</code> in ogni componente, ma un hook dedicato è meglio.
              Si importa una cosa sola, il tipo restituito non contiene <code>null</code>, e se qualcuno dimentica il
              provider ottiene subito un errore chiaro invece di un valore vuoto.
            </p>
          </Prose>
          <CodeBlock code={useThemeSrc} language="ts" filename="src/theme/useTheme.ts" />
        </Step>

        <Step n={3} title="Crea il provider">
          <Prose>
            <p>
              Un componente normale che tiene lo stato con <code>useState</code> e lo mette a disposizione di tutto quello
              che riceve come <code>children</code>.
            </p>
          </Prose>
          <CodeBlock code={themeProviderSrc} filename="src/theme/ThemeProvider.tsx" />
        </Step>

        <Step n={4} title="Avvolgi l'app">
          <Prose>
            <p>
              Metti il provider attorno a <code>{'<App />'}</code>: da quel momento <strong>qualsiasi</strong> componente
              dell'app può leggere il tema, a qualunque profondità.
            </p>
          </Prose>
          <CodeBlock
            filename="src/main.tsx"
            code={`import { createRoot } from 'react-dom/client'
import { App } from './App'
import { ThemeProvider } from './theme/ThemeProvider'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
)`}
          />
        </Step>

        <Step n={5} title="Leggi il valore dove serve">
          <Prose>
            <p>
              <code>ThemeToggleButton</code> sta dentro <code>Header</code>, che sta dentro <code>App</code>. Nessuno dei due
              riceve o passa props: il pulsante chiama <code>useTheme()</code> e ottiene il valore direttamente dal
              provider.
            </p>
          </Prose>
          <CodeBlock code={basicAppSrc} filename="src/App.tsx" />
        </Step>

        <Prose>
          <p>
            Ed ecco il risultato. La demo fa esattamente quello che faresti in <code>main.tsx</code>: avvolge{' '}
            <code>{'<App />'}</code> nel provider. Cliccando il pulsante nell'header cambiano anche il riquadro e lo
            sfondo, cioè componenti diversi che leggono lo stesso valore.
          </p>
        </Prose>
        <Example title="Tema condiviso con un Context" code={basicContextDemoSrc} file={`${DIR}/basic/BasicContextDemo.tsx`}>
          <BasicContextDemo />
        </Example>
        <Callout variant="tip" title="In tre righe">
          <p>
            <code>createContext</code> crea il context → <code>{'<ThemeContext value={...}>'}</code> lo fornisce a un
            sottoalbero → <code>useContext(ThemeContext)</code>, attraverso <code>useTheme()</code>, lo legge.
            Quando il valore cambia, tutti i componenti che lo leggono si aggiornano. Tutto il resto della pagina è una
            variazione di questo schema.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="basi" title="Dettagli: valore di default, provider annidati e use">
        <Prose>
          <ul>
            <li>
              Il <strong>valore di default</strong> di <code>createContext(defaultValue)</code> si usa solo quando sopra il
              componente non c'è nessun provider.
            </li>
            <li>
              In React 19 il context stesso è il provider: <code>{'<MyContext value={...}>'}</code>. La vecchia sintassi{' '}
              <code>{'<MyContext.Provider>'}</code> funziona ancora, ma è deprecata.
            </li>
            <li>
              Oltre a <code>useContext(MyContext)</code> si può usare <code>use(MyContext)</code> di React 19, che a
              differenza degli altri hook si può chiamare anche dentro un <code>if</code>.
            </li>
            <li>
              I provider si possono <strong>annidare</strong>: un componente legge il valore del provider più vicino.
            </li>
          </ul>
        </Prose>
        <Example title="Default, provider e provider annidati" code={accentDemoSrc} file={`${DIR}/AccentDemo.tsx`}>
          <AccentDemo />
        </Example>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="pattern-provider" title="Il pattern: provider + hook dedicato">
        <Prose>
          <p>
            Il primo esempio segue già il pattern consigliato. Non si espone il context nudo, ma un{' '}
            <strong>componente provider</strong> che contiene stato e logica e un <strong>hook</strong> per leggerlo (
            <code>useTheme</code>, <code>useAuth</code>). I vantaggi:
          </p>
          <ul>
            <li>chi usa il valore non sa come è implementato: si può cambiare senza toccare i consumatori;</li>
            <li>l'hook dà un errore chiaro se lo usi fuori dal provider, invece di un valore di default silenzioso;</li>
            <li>TypeScript conosce il tipo esatto, senza <code>| null</code> da controllare a ogni uso.</li>
          </ul>
        </Prose>
        <CodeCompare
          bad={`// Fake default: forget the provider and you
// get no error, just login() that does nothing
const AuthContext = createContext<AuthValue>({
  user: null,
  login: async () => {},
  logout: () => {},
})`}
          good={`// null = "no provider": the hook throws
// a clear error during development
const [AuthContext, useAuth] =
  createStrictContext<AuthValue>('Auth')

const { user } = useAuth() // type: AuthValue`}
        />
        <Prose>
          <p>
            Siccome <code>ThemeContext.ts</code> e <code>useTheme.ts</code> si riscrivono uguali per ogni context, il
            progetto ha una piccola utility, <code>createStrictContext</code>, che crea entrambi in una riga. È quella
            usata negli esempi che seguono:
          </p>
        </Prose>
        <CodeBlock code={createStrictContextSrc} language="ts" filename="src/shared/lib/createStrictContext.ts" />
        <Callout variant="note" title="Perché il context sta in un file .ts separato?">
          <p>
            Il Fast Refresh di Vite funziona solo se un file <code>.tsx</code> esporta esclusivamente componenti. Per
            questo context e hook stanno in <code>authContext.ts</code> e il componente provider in{' '}
            <code>AuthProvider.tsx</code>. Il linter lo segnala con la regola{' '}
            <code>react/only-export-components</code>.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="auth" title="Esempio reale: autenticazione">
        <Prose>
          <p>
            L'autenticazione è il caso tipico: chi è l'utente serve all'header, alle pagine protette e ai form. In questo
            progetto è una funzionalità vera, in <code>src/features/auth/</code>, e il provider avvolge tutta l'app.
          </p>
          <p>
            Accedi qui sotto con <code>Bret</code> e una password qualsiasi: il login cerca lo username su
            JSONPlaceholder. Poi guarda l'<strong>header in alto a destra</strong>: il menu utente legge lo stesso
            context e si aggiorna da solo. Ricarica la pagina: la sessione resta, perché è salvata in{' '}
            <code>localStorage</code>.
          </p>
        </Prose>
        <Example title="Login, profilo e logout tramite useAuth" code={authDemoSrc} file={`${DIR}/AuthDemo.tsx`}>
          <AuthDemo />
        </Example>
        <div className="grid gap-4 xl:grid-cols-2">
          <CodeBlock code={authContextSrc} language="ts" filename="src/features/auth/authContext.ts" />
          <CodeBlock code={authProviderSrc} filename="src/features/auth/AuthProvider.tsx" />
        </div>
        <Prose>
          <p>
            Tutti i provider dell'app sono raccolti in un componente, montato in <code>src/main.tsx</code> attorno al
            router. C'è anche quello di TanStack Query (pagina <Link to="/data-fetching">Data fetching</Link>), e lo
            stesso <code>useAuth</code> protegge le route (pagina <Link to="/routing#protette">React Router</Link>).
          </p>
        </Prose>
        <CodeBlock code={providersSrc} filename="src/app/providers.tsx" />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="store" title="Reducer + Context: uno store senza librerie">
        <Prose>
          <p>
            Unendo le due pagine precedenti si ottiene uno store globale leggero: <code>useReducer</code> gestisce lo
            stato, il Context lo distribuisce. Qui lo stesso <code>todosReducer</code> della pagina{' '}
            <Link to="/reducer">useReducer</Link> viene condiviso da cinque componenti, nessuno dei quali riceve props.
          </p>
          <p>
            Il trucco è usare <strong>due context</strong>: uno per lo stato e uno per <code>dispatch</code>. Siccome{' '}
            <code>dispatch</code> non cambia mai, i componenti che si limitano a inviare azioni non si ri-renderizzano
            quando cambia lo stato. Ogni riquadro qui sotto <strong>lampeggia</strong> quando il componente si
            ri-renderizza e conta i render.
          </p>
        </Prose>
        <Example title="Store delle attività con render visibili" code={todosStoreDemoSrc} file={`${DIR}/todos-store/TodosStoreDemo.tsx`}>
          <TodosStoreDemo />
        </Example>
        <Prose>
          <p>Cosa osservare:</p>
          <ul>
            <li>
              spuntando un'attività lampeggiano <code>TodoList</code>, <code>Stats</code> e <code>FilterBar</code>, tutti
              lettori dello stato, ma non <code>AddTodo</code> né <code>StaticHint</code>;
            </li>
            <li>
              scrivendo nel campo lampeggia solo <code>AddTodo</code>: quello è il suo stato locale, e il resto non ne sa
              nulla;
            </li>
            <li>
              <code>FilterBar</code> lampeggia anche quando cambi un'attività, pur usando solo <code>filter</code>: chi
              legge un context si ri-renderizza a <strong>ogni</strong> cambio del valore, anche se usa solo una parte.
            </li>
          </ul>
        </Prose>
        <div className="grid gap-4 xl:grid-cols-2">
          <CodeBlock code={todosContextSrc} language="ts" filename={`${DIR}/todos-store/todosContext.ts`} />
          <CodeBlock code={todosProviderSrc} filename={`${DIR}/todos-store/TodosProvider.tsx`} />
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="performance" title="Context e performance">
        <Prose>
          <p>
            Il Context non è lento, ma ha una regola semplice: <strong>quando il valore cambia identità, tutti i lettori
            si ri-renderizzano</strong>. Il confronto è per riferimento (<code>Object.is</code>), quindi un oggetto
            creato a ogni render del provider è sempre &quot;nuovo&quot;, anche se il contenuto è identico.
          </p>
        </Prose>
        <CodeCompare
          bad={`function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // New object (and new functions) on EVERY
  // render of the provider → every consumer
  // re-renders, even if user didn't change
  return (
    <AuthContext value={{ user, login, logout }}>
      {children}
    </AuthContext>
  )
}`}
          good={`function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const login = useCallback(/* ... */, [])
  const logout = useCallback(/* ... */, [])
  // Same object until user really changes
  const value = useMemo(
    () => ({ user, login, logout }),
    [user, login, logout],
  )
  return <AuthContext value={value}>{children}</AuthContext>
}`}
        />
        <Prose>
          <p>Le tecniche, dalla più semplice:</p>
          <ol>
            <li>
              <strong>Memoizza il valore</strong> con <code>useMemo</code> e le funzioni con <code>useCallback</code>.
            </li>
            <li>
              <strong>Separa i context</strong> per frequenza di cambiamento: stato e azioni, oppure dati diversi (tema
              e utente non stanno nello stesso context).
            </li>
            <li>
              <strong>Metti il provider il più in basso possibile</strong>: se il valore serve solo a una pagina, il
              provider sta lì e non attorno a tutta l'app.
            </li>
            <li>
              Se servono <strong>selettori</strong>, cioè ri-renderizzare solo quando cambia la parte di stato che ti
              interessa, il Context non basta: è il momento di una libreria come Zustand o Redux Toolkit.
            </li>
          </ol>
        </Prose>
        <Callout variant="note">
          <p>
            I <code>children</code> passati al provider non si ri-renderizzano solo perché il provider cambia stato: sono
            elementi creati dal componente padre. Si aggiornano solo i componenti che leggono davvero il context. Lo
            vedi nella demo con <code>StaticHint</code>. Approfondimento nella pagina{' '}
            <Link to="/performance">Performance</Link>.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="quando-no" title="Quando non usarlo">
        <Table
          head={['Situazione', 'Meglio']}
          rows={[
            ['Un dato passa per 1-2 livelli', 'Props: sono esplicite e facili da seguire'],
            ['Componenti intermedi che passano solo dati', 'Composizione con `children` o prop che accettano JSX'],
            ['Dati dal server (liste, dettagli, cache)', 'TanStack Query: cache, refetch e invalidazione inclusi'],
            ['Valori che cambiano molto spesso (posizione del mouse, scroll)', 'Stato locale, o uno store esterno con selettori'],
            ['Stato globale grande, con molti lettori di parti diverse', 'Zustand, Redux Toolkit, Jotai'],
            ['Stato che deve sopravvivere al reload o essere condivisibile via link', 'URL (query string) o `localStorage`'],
          ]}
        />
        <Prose>
          <h3>Composizione al posto del Context</h3>
        </Prose>
        <CodeCompare
          bad={`<Layout user={user} />

function Layout({ user }) {
  return (
    <div>
      <Sidebar />
      <Header user={user} />
    </div>
  )
}`}
          good={`<Layout header={<Header user={user} />} />

function Layout({ header }: { header: ReactNode }) {
  // Layout knows nothing about users anymore
  return (
    <div>
      <Sidebar />
      {header}
    </div>
  )
}`}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="test" title="Testare componenti che usano un Context">
        <Prose>
          <p>
            Un componente che chiama <code>useAuth()</code> ha bisogno del provider anche nei test: si renderizza
            dentro <code>{'<AuthProvider>'}</code>, come nell'app. Il test controlla anche che l'hook usato fuori dal
            provider dia l'errore previsto.
          </p>
        </Prose>
        <CodeBlock code={authTestSrc} filename="src/features/auth/__tests__/auth.test.tsx" />
        <Callout variant="tip">
          <p>
            Quando molti test hanno bisogno degli stessi provider, conviene una funzione <code>renderWithProviders</code>{' '}
            condivisa. La costruiamo nella pagina <Link to="/testing">Testing con Vitest</Link>, insieme a router e
            TanStack Query.
          </p>
        </Callout>
      </Section>
    </Page>
  )
}
