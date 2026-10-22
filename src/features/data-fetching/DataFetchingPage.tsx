import { Link } from 'react-router'
import providersSrc from '@/app/providers.tsx?raw'
import { Callout } from '@/docs/Callout'
import { CodeBlock, CodeCompare } from '@/docs/CodeBlock'
import { Example } from '@/docs/Example'
import { Page } from '@/docs/Page'
import { Prose, Section } from '@/docs/Section'
import { Step } from '@/docs/Step'
import { Table } from '@/docs/Table'
import queriesSrc from '@/shared/api/jsonplaceholder/queries.ts?raw'
import queryClientSrc from '@/shared/api/queryClient.ts?raw'
import useFetchSrc from '@/shared/hooks/useFetch.ts?raw'
import dataFetchingTestSrc from './examples/__tests__/dataFetching.test.tsx?raw'
import { UserCard } from './examples/basic-fetch/UserCard'
import userCardSrc from './examples/basic-fetch/UserCard.tsx?raw'
import { UsersList } from './examples/basic-query/UsersList'
import usersListSrc from './examples/basic-query/UsersList.tsx?raw'
import { CacheComparison } from './examples/CacheComparison'
import cacheComparisonSrc from './examples/CacheComparison.tsx?raw'
import { DependentQueries } from './examples/DependentQueries'
import dependentQueriesSrc from './examples/DependentQueries.tsx?raw'
import { QueryStates } from './examples/QueryStates'
import queryStatesSrc from './examples/QueryStates.tsx?raw'
import { TodoManager } from './examples/todos/TodoManager'
import todoManagerSrc from './examples/todos/TodoManager.tsx?raw'
import todoMutationsSrc from './examples/todos/todoMutations.ts?raw'

const DIR = 'src/features/data-fetching/examples'

export default function DataFetchingPage() {
  return (
    <Page
      title="Data fetching"
      lead="Caricare dati da un'API: prima con un hook useFetch scritto a mano, per capire il problema, poi con TanStack Query, che risolve anche cache, aggiornamenti e mutation."
    >
      {/* ------------------------------------------------------------------ */}
      <Section id="problema" title="Cosa serve per caricare dati">
        <Prose>
          <p>
            Caricare dati sembra facile: <code>fetch</code> in un <code>useEffect</code>, poi <code>setState</code>. In
            pratica, un caricamento fatto bene deve gestire:
          </p>
          <ul>
            <li>
              gli stati di <strong>caricamento</strong>, <strong>errore</strong> e <strong>successo</strong>;
            </li>
            <li>
              le <strong>race condition</strong>: una risposta vecchia non deve sovrascrivere quella nuova (pagina{' '}
              <Link to="/hooks-base#use-effect">Hook di base</Link>);
            </li>
            <li>
              l'<strong>annullamento</strong> delle richieste quando il componente sparisce;
            </li>
            <li>
              la <strong>cache</strong>: tornando su una pagina, i dati già scaricati si mostrano subito;
            </li>
            <li>
              la <strong>deduplicazione</strong>: due componenti che chiedono lo stesso dato fanno una sola richiesta;
            </li>
            <li>
              l'<strong>aggiornamento</strong>: dati vecchi da ricaricare, magari quando l'utente torna sulla scheda;
            </li>
            <li>
              le <strong>modifiche</strong> (POST, PATCH): aggiornare l'interfaccia dopo il salvataggio, o prima, in modo
              ottimistico.
            </li>
          </ul>
          <p>
            I primi tre punti si risolvono con un custom hook. Per gli altri serve una libreria: TanStack Query.
          </p>
        </Prose>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="primo-esempio" title="Primo esempio: useFetch passo per passo">
        <CodeBlock
          language="bash"
          filename="struttura"
          code={`src/shared/
  api/http.ts         # 1. request(): fetch + JSON + errors (already used in the previous pages)
  hooks/useAsync.ts   #    state machine of a promise (useReducer page)
  hooks/useFetch.ts   # 2. the hook: loads a URL in an effect, aborts the old request
features/.../UserCard.tsx  # 3. a component that uses it`}
        />

        <Step n={1} title="Una funzione per le richieste">
          <Prose>
            <p>
              <code>request&lt;T&gt;(url, options)</code> di <code>src/shared/api/http.ts</code> chiama{' '}
              <code>fetch</code>, lancia un <code>HttpError</code> se lo status non è 2xx (<code>fetch</code> da solo{' '}
              <strong>non</strong> lo fa) e restituisce il JSON tipizzato. Accetta un <code>signal</code> per annullare
              la richiesta.
            </p>
          </Prose>
          <CodeBlock
            language="ts"
            code={`const user = await request<User>('https://jsonplaceholder.typicode.com/users/1', { signal })`}
          />
        </Step>

        <Step n={2} title="L'hook useFetch">
          <Prose>
            <p>
              Carica l'URL in un effetto e usa <code>useAsync</code> della pagina{' '}
              <Link to="/reducer#macchina-a-stati">useReducer</Link> per gli stati. Quando l'URL cambia o il componente
              sparisce, il cleanup annulla la richiesta precedente con <code>AbortController</code>. Con{' '}
              <code>null</code> non carica nulla, e <code>refetch()</code> ricarica.
            </p>
          </Prose>
          <CodeBlock code={useFetchSrc} language="ts" filename="src/shared/hooks/useFetch.ts" />
        </Step>

        <Step n={3} title="Usalo in un componente">
          <Prose>
            <p>
              Una riga per avere dati, errore e stato di caricamento. L'id fa parte dell'URL: cambiandolo, l'hook carica
              il nuovo utente da solo. #999 mostra un errore 404.
            </p>
          </Prose>
          <CodeBlock code={userCardSrc} filename={`${DIR}/basic-fetch/UserCard.tsx`} />
        </Step>

        <Example title="useFetch con JSONPlaceholder" code={userCardSrc} file={`${DIR}/basic-fetch/UserCard.tsx`}>
          <UserCard />
        </Example>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="limiti" title="I limiti di useFetch">
        <Prose>
          <p>
            <code>useFetch</code> non ha memoria: ogni volta che un componente viene montato rifà la richiesta e mostra lo
            spinner, anche per dati scaricati un secondo prima. Clicca &quot;Smonta&quot; e &quot;Rimonta&quot; più volte:
            a sinistra lo spinner ricompare ogni volta, a destra <code>useQuery</code> mostra subito i dati dalla cache.
          </p>
        </Prose>
        <Example title="Senza cache vs con cache" code={cacheComparisonSrc} file={`${DIR}/CacheComparison.tsx`}>
          <CacheComparison />
        </Example>
        <Table
          head={['', '`useFetch`', 'TanStack Query']}
          rows={[
            ['Loading / errore / dati', 'Sì', 'Sì'],
            ['Race condition e annullamento', 'Sì', 'Sì'],
            ['Cache condivisa tra componenti', 'No', 'Sì'],
            ['Una sola richiesta per dati uguali', 'No', 'Sì (deduplicazione)'],
            ['Aggiornamento in background, al focus, a intervalli', 'No', 'Sì'],
            ['Tentativi automatici dopo un errore', 'No', 'Sì (`retry`)'],
            ['Mutation, invalidazione, aggiornamenti ottimistici', 'No', 'Sì'],
            ['Dipendenze', 'Nessuna, ~30 righe', 'Una libreria (~13 kB gzip)'],
          ]}
        />
        <Callout variant="tip" title="Quando basta useFetch">
          <p>
            Per un widget isolato o un prototipo, <code>useFetch</code> va benissimo. Appena gli stessi dati servono in
            più punti, o l'utente li modifica, il codice da aggiungere a mano diventa una piccola libreria di cache: a quel
            punto conviene usarne una vera.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="tanstack-installazione" title="TanStack Query: installazione e concetti">
        <Prose>
          <p>
            Queste note usano <strong>TanStack Query v5</strong> (la 5.104 in questo progetto), che prima si chiamava
            React Query. I pacchetti sono due: la libreria e i DevTools, facoltativi ma utilissimi.
          </p>
        </Prose>
        <CodeBlock language="bash" code="npm install @tanstack/react-query @tanstack/react-query-devtools" />
        <Prose>
          <p>
            L'idea chiave è distinguere due tipi di stato. Lo <strong>stato del client</strong> appartiene
            all'interfaccia (un menu aperto, il testo di un input) e si gestisce con <code>useState</code>, i reducer e i
            Context. Lo <strong>stato del server</strong> è una copia locale di dati che vivono altrove, e può
            invecchiare, essere modificato da altri, essere condiviso da più schermate. TanStack Query è una{' '}
            <strong>cache</strong> per lo stato del server: tu dici come si scarica un dato e con che nome lo chiami, lei
            decide quando scaricarlo, quando riusarlo e quando aggiornarlo.
          </p>
        </Prose>
        <Table
          head={['Concetto', 'Cos’è']}
          rows={[
            ['Query', 'Una lettura: `useQuery({ queryKey, queryFn })`'],
            ['Query key', 'Array che identifica il dato nella cache: `["users", "detail", 1]`'],
            ['Query function', 'Funzione async che scarica il dato: `() => getUser(1)`'],
            ['Mutation', 'Una scrittura: `useMutation({ mutationFn })`'],
            ['Invalidazione', 'Segnare dei dati come vecchi, per farli ricaricare: `invalidateQueries`'],
            ['QueryClient', 'L’oggetto che contiene la cache, fornito a tutta l’app dal `QueryClientProvider`'],
          ]}
        />
        <Callout variant="note" title="API deprecate nella v5 recente">
          <p>
            In questa versione <code>queryClient.fetchQuery</code>, <code>prefetchQuery</code> ed{' '}
            <code>ensureQueryData</code> sono deprecati, a favore di un unico <code>queryClient.query(options)</code>{' '}
            (con <code>{"staleTime: 'static'"}</code> per il comportamento di <code>ensureQueryData</code>). Molte guide
            online usano ancora i nomi vecchi: funzionano, ma verranno rimossi nella prossima versione maggiore.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="tanstack-primo-esempio" title="TanStack Query: primo esempio passo per passo">
        <Step n={1} title="Crea il QueryClient e forniscilo all'app">
          <Prose>
            <p>
              Il <code>QueryClient</code> contiene la cache. Si crea <strong>una volta</strong>, fuori dai componenti, e si
              mette a disposizione con <code>QueryClientProvider</code>, come un Context.
            </p>
          </Prose>
          <CodeBlock
            filename="src/main.tsx"
            code={`import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { App } from './App'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
)`}
          />
        </Step>

        <Step n={2} title="Leggi i dati con useQuery">
          <Prose>
            <p>
              Due opzioni obbligatorie: <code>queryKey</code>, il nome del dato nella cache, e <code>queryFn</code>, la
              funzione che lo scarica. <code>useQuery</code> restituisce <code>data</code>, <code>error</code> e gli stati.
              Dopo i controlli su <code>isPending</code> ed <code>error</code>, TypeScript sa che <code>data</code> c'è.
            </p>
          </Prose>
          <CodeBlock code={usersListSrc} filename="src/UsersList.tsx" />
        </Step>

        <Example title="useQuery" code={usersListSrc} file={`${DIR}/basic-query/UsersList.tsx`}>
          <UsersList />
        </Example>
        <Prose>
          <p>
            Senza scrivere altro codice, questa lista ha già: cache, deduplicazione, aggiornamento in background quando
            torni sulla scheda del browser, e un nuovo tentativo automatico se la richiesta fallisce. Il{' '}
            <code>signal</code> che <code>useQuery</code> passa a <code>queryFn</code> arriva fino a <code>fetch</code>,
            quindi le richieste non più necessarie vengono annullate.
          </p>
        </Prose>
        <Callout variant="tip" title="I DevTools">
          <p>
            In basso a sinistra c'è l'icona dei <strong>React Query DevTools</strong>: aprendoli vedi tutte le query in
            cache, con il loro stato (fresh, stale, fetching, inactive), e puoi invalidarle o farle fallire a mano. Nelle
            build di produzione vengono esclusi automaticamente.
          </p>
        </Callout>
        <Prose>
          <p>In queste note client e provider sono configurati così:</p>
        </Prose>
        <div className="grid gap-4 xl:grid-cols-2">
          <CodeBlock code={queryClientSrc} language="ts" filename="src/shared/api/queryClient.ts" />
          <CodeBlock code={providersSrc} filename="src/app/providers.tsx" />
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="chiavi" title="Query key e queryOptions">
        <Prose>
          <p>
            La query key è l'<strong>identità</strong> di un dato: stessa key, stesso dato in cache. Le regole:
          </p>
          <ul>
            <li>
              è un array, e deve contenere <strong>tutto</strong> ciò da cui dipende la query: id, filtri, pagina.{' '}
              <code>{"['users', 1]"}</code> e <code>{"['users', 2]"}</code> sono due voci diverse;
            </li>
            <li>
              quando la key cambia, ad esempio perché cambia l'id, la query scarica il nuovo dato da sola. Non serve un
              effetto;
            </li>
            <li>
              è <strong>gerarchica</strong>: <code>invalidateQueries({'{'} queryKey: [&apos;users&apos;] {'}'})</code>{' '}
              colpisce tutte le key che iniziano con <code>&apos;users&apos;</code>.
            </li>
          </ul>
          <p>
            Per non scrivere le stesse key a mano in giro per l'app, si raccolgono in un unico file con{' '}
            <code>queryOptions()</code>, che tiene insieme key e funzione e propaga i tipi ovunque.
          </p>
        </Prose>
        <CodeBlock code={queriesSrc} language="ts" filename="src/shared/api/jsonplaceholder/queries.ts" />
        <CodeCompare
          bad={`// Keys typed by hand everywhere: one typo
// ('user' instead of 'users') = a separate cache
useQuery({
  queryKey: ['users', id],
  queryFn: () => getUser(id),
})
queryClient.invalidateQueries({ queryKey: ['user'] })`}
          good={`// One source of truth, typed data
useQuery(userQueries.detail(id))

queryClient.invalidateQueries({
  queryKey: userQueries.all(),
})`}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="stati-cache" title="Stati, cache e aggiornamenti">
        <Prose>
          <p>
            Una query ha <strong>due</strong> stati indipendenti: <code>status</code> dice se hai dei dati,{' '}
            <code>fetchStatus</code> dice se una richiesta è in corso in questo momento.
          </p>
        </Prose>
        <Table
          head={['', 'Valori', 'Significato']}
          rows={[
            ['`status`', '`pending` / `error` / `success`', 'Ho dei dati? (`isPending`, `isError`, `isSuccess`)'],
            ['`fetchStatus`', '`fetching` / `paused` / `idle`', 'Sta scaricando adesso? (`isFetching`)'],
            ['`isLoading`', '`isPending && isFetching`', 'Primo caricamento in corso: mostra lo scheletro della pagina'],
            ['`isPlaceholderData`', 'boolean', 'Stai vedendo i dati precedenti (`keepPreviousData`)'],
          ]}
        />
        <Prose>
          <h3>staleTime e gcTime</h3>
          <ul>
            <li>
              <strong>
                <code>staleTime</code>
              </strong>{' '}
              (default <code>0</code>; in queste note 30 secondi): per quanto tempo un dato è <em>fresh</em>. Un dato fresh
              si usa dalla cache senza richieste. Un dato <em>stale</em> si mostra subito, ma viene riscaricato in
              background quando un componente lo monta, quando torni sulla scheda o quando torna la connessione.
            </li>
            <li>
              <strong>
                <code>gcTime</code>
              </strong>{' '}
              (default 5 minuti): per quanto tempo un dato <strong>non usato da nessun componente</strong> resta in cache
              prima di essere eliminato.
            </li>
          </ul>
          <p>Nella demo:</p>
          <ul>
            <li>
              passa il mouse su un pulsante: il dato viene <strong>pre-caricato</strong>, e al clic compare
              istantaneamente;
            </li>
            <li>
              cambiando utente, <code>keepPreviousData</code> lascia visibile quello precedente, sbiadito, invece di uno
              spinner;
            </li>
            <li>
              &quot;Invalida&quot; segna come stale tutte le query <code>{"['users', ...]"}</code> e riscarica quelle a
              schermo: guarda <code>fetchStatus</code>.
            </li>
          </ul>
        </Prose>
        <Example title="status, fetchStatus, prefetch, placeholder e invalidazione" code={queryStatesSrc} file={`${DIR}/QueryStates.tsx`}>
          <QueryStates />
        </Example>
        <Callout variant="note">
          <p>
            JSONPlaceholder risponde in pochi millisecondi, quindi alcuni stati durano un attimo. Per vederli bene, nei
            DevTools del browser imposta la rete su &quot;Slow 4G&quot;.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="dipendenti" title="Query dipendenti e select">
        <Prose>
          <p>
            Quando una query ha bisogno del risultato di un'altra, o di una scelta dell'utente, usa{' '}
            <code>enabled</code>: con <code>false</code> la query resta ferma, e parte da sola quando diventa{' '}
            <code>true</code>. <code>select</code> trasforma i dati per un solo componente: la cache conserva la risposta
            intera, e il componente si ri-renderizza solo se cambia il risultato trasformato.
          </p>
        </Prose>
        <Example title="Utente → i suoi post" code={dependentQueriesSrc} file={`${DIR}/DependentQueries.tsx`}>
          <DependentQueries />
        </Example>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="mutation" title="Mutation: modificare i dati">
        <Prose>
          <p>
            Le letture si fanno con <code>useQuery</code>, le scritture (POST, PUT, PATCH, DELETE) con{' '}
            <code>useMutation</code>. Una mutation non parte da sola: la avvii con <code>mutate(variabili)</code>, e ti dà{' '}
            <code>isPending</code>, <code>error</code> e <code>data</code> per quella operazione. Dopo una modifica la cache
            va aggiornata, in uno di due modi:
          </p>
          <ol>
            <li>
              <strong>Invalidare</strong> (<code>invalidateQueries</code>): &quot;questi dati sono vecchi, riscaricali&quot;.
              Semplice e sempre corretto: è la scelta di default con un'API vera.
            </li>
            <li>
              <strong>Scrivere nella cache</strong> (<code>setQueryData</code>) la risposta del server: nessuna richiesta
              in più, ma devi replicare tu la logica, ad esempio dove inserire il nuovo elemento.
            </li>
          </ol>
        </Prose>
        <Callout variant="warning" title="JSONPlaceholder non salva davvero">
          <p>
            L'API di prova risponde come se avesse salvato, ma non salva. Per questo le demo usano{' '}
            <code>setQueryData</code>: se invalidassero, il server restituirebbe i dati originali e le modifiche
            sparirebbero. Puoi verificarlo con &quot;Ricarica dal server&quot; qui sotto. Con un'API vera useresti{' '}
            <code>invalidateQueries</code>, come indicato nei commenti del codice.
          </p>
        </Callout>
        <Prose>
          <p>
            Le mutation di una risorsa stanno bene in <strong>custom hook</strong> dedicati, accanto alle query: il
            componente chiama <code>useAddTodo()</code> e non sa nulla di key e cache.
          </p>
        </Prose>
        <CodeBlock code={todoMutationsSrc} language="ts" filename={`${DIR}/todos/todoMutations.ts`} />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="ottimistici" title="Aggiornamenti ottimistici">
        <Prose>
          <p>
            Un aggiornamento <strong>ottimistico</strong> mostra subito il risultato, come se il server avesse già
            risposto di sì, e lo annulla se la richiesta fallisce. L'interfaccia sembra istantanea anche con un server
            lento. Con <code>useMutation</code> ha tre fasi (<code>useToggleTodo</code> qui sopra):
          </p>
          <ol>
            <li>
              <code>onMutate</code>: ferma i refetch in corso (<code>cancelQueries</code>), salva una copia dei dati
              attuali e scrive nella cache il valore previsto;
            </li>
            <li>
              <code>onError</code>: rimette la copia salvata (rollback);
            </li>
            <li>
              <code>onSettled</code>: con un'API vera, invalida per riallinearsi al server, qualunque sia l'esito.
            </li>
          </ol>
          <p>
            Prova: spunta un'attività. La spunta appare subito e &quot;salvataggio…&quot; dura 800 ms. Poi attiva
            &quot;Simula errore&quot; e riprova: la spunta appare, poi torna indietro con un messaggio.
          </p>
        </Prose>
        <Example title="Aggiunta, spunta ottimistica, rollback" code={todoManagerSrc} file={`${DIR}/todos/TodoManager.tsx`}>
          <TodoManager />
        </Example>
        <Callout variant="note" title="Ottimistico anche senza TanStack Query">
          <p>
            React 19 ha <code>useOptimistic</code>, per lo stesso effetto con lo stato locale e le form action: lo vediamo
            nella pagina <Link to="/advanced-hooks">Hook avanzati</Link>.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="router" title="Insieme ai loader di React Router">
        <Prose>
          <p>
            I loader del router (pagina <Link to="/routing#data-mode">React Router</Link>) e TanStack Query si completano.
            Il loader fa partire il caricamento <strong>prima</strong> di mostrare la pagina, passando dalla cache;
            il componente legge lo stesso dato con <code>useQuery</code> e ottiene refetch, invalidazione e mutation.
            Con i dati già in cache, il loader risponde subito e la navigazione è istantanea.
          </p>
        </Prose>
        <CodeBlock
          code={`// routes.ts: the loader warms up the cache (queryClient.query replaces ensureQueryData/fetchQuery)
{
  path: 'users/:userId',
  loader: async ({ params }) => {
    await queryClient.query(userQueries.detail(Number(params.userId)))
    return null
  },
  Component: UserPage,
}

// UserPage.tsx: same query options → instant cache hit, plus refetch/invalidation for free
function UserPage() {
  const { userId } = useParams()
  const { data: user } = useSuspenseQuery(userQueries.detail(Number(userId)))
  return <h1>{user.name}</h1>
}`}
        />
        <Prose>
          <p>
            <code>useSuspenseQuery</code> è la variante di <code>useQuery</code> in cui <code>data</code> è sempre
            definito: mentre carica, il componente &quot;sospende&quot; e mostra il fallback del{' '}
            <code>{'<Suspense>'}</code> più vicino, e gli errori arrivano all'Error Boundary. Ne parliamo nella pagina{' '}
            <Link to="/patterns">Pattern</Link>.
          </p>
        </Prose>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="test" title="Testare componenti con useQuery">
        <Prose>
          <ul>
            <li>
              Crea un <strong>QueryClient nuovo per ogni test</strong>, così la cache non passa da un test all'altro.
              Per questo <code>createQueryClient()</code> è una funzione.
            </li>
            <li>
              Disattiva i <code>retry</code>: altrimenti un test che verifica un errore aspetta i tentativi automatici.
            </li>
            <li>
              Simula <code>fetch</code> con <code>vi.stubGlobal</code>: niente rete nei test.
            </li>
          </ul>
        </Prose>
        <CodeBlock code={dataFetchingTestSrc} filename={`${DIR}/__tests__/dataFetching.test.tsx`} />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="riepilogo" title="Riepilogo">
        <Table
          head={['API', 'A cosa serve']}
          rows={[
            ['`useFetch(url)`', 'Hook fatto a mano: stati, annullamento, nessuna cache'],
            ['`QueryClient` + `QueryClientProvider`', 'Cache condivisa da tutta l’app'],
            ['`useQuery({ queryKey, queryFn })`', 'Leggere dati con cache, deduplicazione e refetch'],
            ['`queryOptions()`', 'Key + funzione + tipi in un posto solo'],
            ['`staleTime` / `gcTime`', 'Quanto un dato resta fresh / quanto resta in cache se inutilizzato'],
            ['`enabled`, `select`, `placeholderData: keepPreviousData`', 'Query dipendenti, trasformazioni, niente spinner tra una pagina e l’altra'],
            ['`queryClient.query(options)`', 'Caricare fuori dai componenti (prefetch, loader)'],
            ['`useMutation({ mutationFn })` + `mutate()`', 'Scrivere dati'],
            ['`invalidateQueries({ queryKey })`', 'Segnare come vecchi e riscaricare'],
            ['`setQueryData` / `getQueryData`', 'Leggere e scrivere la cache a mano'],
            ['`onMutate` / `onError` / `onSettled`', 'Aggiornamenti ottimistici con rollback'],
            ['`useSuspenseQuery`', 'Dati sempre definiti, caricamento gestito da Suspense'],
          ]}
        />
      </Section>
    </Page>
  )
}
