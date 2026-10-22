import { Link } from 'react-router'
import { Callout } from '@/docs/Callout'
import { CodeBlock, CodeCompare } from '@/docs/CodeBlock'
import { Example } from '@/docs/Example'
import { Page } from '@/docs/Page'
import { Prose, Section } from '@/docs/Section'
import { Table } from '@/docs/Table'
import useEventListenerSrc from '@/shared/hooks/useEventListener.ts?raw'
import useWindowSizeSrc from '@/shared/hooks/useWindowSize.ts?raw'
import { ChatRoom } from './examples/ChatRoom'
import { Clock } from './examples/Clock'
import clockSrc from './examples/Clock.tsx?raw'
import chatRoomSrc from './examples/ChatRoom.tsx?raw'
import { Counter } from './examples/Counter'
import counterSrc from './examples/Counter.tsx?raw'
import { FocusInput } from './examples/FocusInput'
import focusInputSrc from './examples/FocusInput.tsx?raw'
import { RefVsState } from './examples/RefVsState'
import refVsStateSrc from './examples/RefVsState.tsx?raw'
import { Stopwatch } from './examples/Stopwatch'
import stopwatchSrc from './examples/Stopwatch.tsx?raw'
import { TodoList } from './examples/TodoList'
import todoListSrc from './examples/TodoList.tsx?raw'
import { UserFetch } from './examples/UserFetch'
import userFetchSrc from './examples/UserFetch.tsx?raw'
import { WindowSizeManual } from './examples/WindowSizeManual'
import windowSizeManualSrc from './examples/WindowSizeManual.tsx?raw'
import { WindowSizeWithHook } from './examples/WindowSizeWithHook'
import windowSizeWithHookSrc from './examples/WindowSizeWithHook.tsx?raw'

const DIR = 'src/features/hooks-base/examples'

export default function HooksBasePage() {
  return (
    <Page
      title="Hook di base"
      lead="useState per ricordare i dati, useEffect per sincronizzarsi con il mondo esterno, useRef per tenere valori che non devono provocare un nuovo render."
    >
      {/* ------------------------------------------------------------------ */}
      <Section id="regole" title="Le regole degli hook">
        <Prose>
          <p>
            Gli hook sono funzioni che iniziano con <code>use</code> e permettono a un componente funzione di
            &quot;agganciarsi&quot; alle funzionalità di React: stato, effetti, riferimenti, context. React li
            riconosce <strong>in base all'ordine di chiamata</strong>, quindi due regole sono obbligatorie:
          </p>
          <ol>
            <li>
              Chiamali solo al <strong>livello più alto</strong> del componente: mai dentro <code>if</code>, cicli, funzioni
              annidate o dopo un <code>return</code> anticipato.
            </li>
            <li>
              Chiamali solo da <strong>componenti React</strong> o da <strong>altri hook</strong> (i custom hook), non da
              funzioni normali.
            </li>
          </ol>
          <p>
            Il linter del progetto (<code>react/rules-of-hooks</code> in <code>.oxlintrc.json</code>) segnala le
            violazioni come errore.
          </p>
        </Prose>
        <CodeCompare
          bad={`function Profile({ user }) {
  if (!user) return <Login />
  // ✗ called only sometimes: the order of hooks changes
  const [tab, setTab] = useState('info')
  // ...
}`}
          good={`function Profile({ user }) {
  // ✓ always called, in the same order
  const [tab, setTab] = useState('info')
  if (!user) return <Login />
  // ...
}`}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="use-state" title="useState">
        <Prose>
          <p>
            <code>useState</code> dichiara una variabile di stato. Restituisce una coppia: il <strong>valore attuale</strong>{' '}
            e una <strong>funzione per aggiornarlo</strong>. Chiamare il setter chiede a React un nuovo render del
            componente con il nuovo valore.
          </p>
        </Prose>
        <CodeBlock
          code={`const [count, setCount] = useState(0)          // type inferred: number
const [user, setUser] = useState<User | null>(null) // explicit type when the initial value is not enough`}
        />
        <Prose>
          <h3>Lo stato è una &quot;fotografia&quot;</h3>
          <p>
            Durante un render <code>count</code> è una costante. <code>setCount(count + 1)</code> non modifica la
            variabile: programma un nuovo render in cui <code>count</code> avrà il nuovo valore. Per questo tre
            chiamate di fila con il valore danno <strong>+1</strong>, mentre con la{' '}
            <strong>funzione di aggiornamento</strong> <code>{'setCount(c => c + 1)'}</code> danno <strong>+3</strong>:
            ogni funzione riceve il valore prodotto dalla precedente.
          </p>
        </Prose>
        <Example title="Contatore: valore vs funzione di aggiornamento" code={counterSrc} file={`${DIR}/Counter.tsx`}>
          <Counter />
        </Example>
        <Callout variant="tip">
          <p>
            Usa la forma <code>{'setX(prev => ...)'}</code> ogni volta che il nuovo valore dipende dal precedente. È
            indispensabile dentro timer, callback asincrone e quando aggiorni più volte nello stesso evento.
          </p>
        </Callout>

        <Prose>
          <h3>Oggetti e array: mai modificarli direttamente</h3>
          <p>
            React confronta lo stato vecchio e il nuovo per riferimento (<code>Object.is</code>). Se fai{' '}
            <code>todos.push(x)</code> l'array è lo stesso oggetto e React può non accorgersi del cambiamento. Crea
            sempre una <strong>copia nuova</strong>:
          </p>
        </Prose>
        <Table
          head={['Operazione', 'Da evitare (modifica)', 'Da usare (copia)']}
          rows={[
            ['Aggiungere', '`arr.push(x)`', '`[...arr, x]`'],
            ['Rimuovere', '`arr.splice(i, 1)`', '`arr.filter(x => x.id !== id)`'],
            ['Modificare un elemento', '`arr[i].done = true`', '`arr.map(x => x.id === id ? { ...x, done: true } : x)`'],
            ['Ordinare', '`arr.sort()`', '`arr.toSorted()`'],
            ['Campo di un oggetto', "`obj.name = 'Ada'`", "`{ ...obj, name: 'Ada' }`"],
          ]}
        />
        <Example title="Lista di attività: aggiornamenti immutabili" code={todoListSrc} file={`${DIR}/TodoList.tsx`}>
          <TodoList />
        </Example>
        <Prose>
          <p>Nell'esempio ci sono altri due dettagli da notare:</p>
          <ul>
            <li>
              <strong>Inizializzazione lazy</strong>: <code>useState(createInitialTodos)</code> passa la funzione, non il
              suo risultato. React la chiama solo al primo render. Con <code>useState(createInitialTodos())</code> la
              funzione girerebbe a ogni render, anche se il risultato viene ignorato.
            </li>
            <li>
              <strong>Valori derivati</strong>: <code>remaining</code> si calcola dai <code>todos</code> durante il render.
              Non serve uno stato separato, che andrebbe tenuto sincronizzato a mano.
            </li>
          </ul>
        </Prose>
        <Callout variant="danger" title="Stato duplicato">
          <p>
            Se un valore si può calcolare da props o da altro stato, <strong>non metterlo nello stato</strong>. Uno stato
            duplicato prima o poi va fuori sincronia. Se il calcolo è pesante, si usa <code>useMemo</code> (vedi la pagina
            Performance).
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="use-effect" title="useEffect">
        <Prose>
          <p>
            <code>useEffect</code> serve a <strong>sincronizzare il componente con un sistema esterno</strong>: una
            connessione, un timer, un listener del browser, una richiesta di rete, una libreria non-React. Il codice
            dell'effetto gira <strong>dopo</strong> che React ha aggiornato il DOM.
          </p>
        </Prose>
        <CodeBlock
          code={`useEffect(() => {
  // 1. setup: connect, subscribe, start
  const connection = createConnection(roomId)
  connection.connect()

  // 2. cleanup (optional): undo what the setup did
  return () => connection.disconnect()
}, [roomId]) // 3. dependencies: re-run when these values change`}
        />
        <Prose>
          <h3>Primo esempio: un orologio</h3>
          <p>
            Il caso più semplice: un timer. Il setup lo avvia, il cleanup lo ferma, e l'array vuoto <code>[]</code> dice a
            React di eseguire il setup una volta sola, dopo il primo render. Senza cleanup, ogni volta che il componente
            viene montato partirebbe un nuovo timer e quelli vecchi continuerebbero a girare. Prova &quot;Reset&quot;, che
            smonta e rimonta la demo.
          </p>
        </Prose>
        <Example title="Orologio con setInterval e cleanup" code={clockSrc} file={`${DIR}/Clock.tsx`}>
          <Clock />
        </Example>
        <Prose>
          <h3>Il ciclo di vita di un effetto</h3>
          <ul>
            <li>
              <strong>Mount</strong>: React esegue il setup.
            </li>
            <li>
              <strong>Una dipendenza cambia</strong>: React esegue il cleanup con i valori <em>vecchi</em>, poi il setup
              con i valori <em>nuovi</em>.
            </li>
            <li>
              <strong>Unmount</strong>: React esegue l'ultimo cleanup.
            </li>
          </ul>
          <p>
            Cambia stanza e apri o chiudi la chat per vedere l'ordine delle chiamate nel log.
          </p>
        </Prose>
        <Example title="Connessione a una chat: setup, cleanup e dipendenze" code={chatRoomSrc} file={`${DIR}/ChatRoom.tsx`}>
          <ChatRoom />
        </Example>
        <Callout variant="note" title="Perché al primo caricamento vedo connessione, disconnessione, connessione?">
          <p>
            In sviluppo <code>&lt;StrictMode&gt;</code> (vedi <code>src/main.tsx</code>) monta, smonta e rimonta ogni
            componente una volta in più, apposta. Se il tuo effetto non ha un cleanup corretto, il bug diventa visibile
            subito. In produzione questo non succede.
          </p>
        </Callout>

        <Prose>
          <h3>L'array delle dipendenze</h3>
        </Prose>
        <Table
          head={['Forma', 'Quando gira l’effetto']}
          rows={[
            ['`useEffect(fn)`', 'Dopo ogni render. Raramente è quello che vuoi.'],
            ['`useEffect(fn, [])`', 'Solo al mount (cleanup all’unmount).'],
            ['`useEffect(fn, [a, b])`', 'Al mount e ogni volta che `a` o `b` cambiano (confronto con `Object.is`).'],
          ]}
        />
        <Callout variant="warning">
          <p>
            Le dipendenze non si scelgono: sono <strong>tutti i valori reattivi</strong> (props, stato, variabili del
            componente) usati dentro l'effetto. Se ne togli una per evitare che l'effetto rigiri, l'effetto leggerà valori
            vecchi. Se un effetto gira troppo spesso, cambia il codice (sposta funzioni e oggetti dentro l'effetto, usa la
            funzione di aggiornamento), non la lista.
          </p>
        </Callout>

        <Prose>
          <h3>Iscriversi a un evento del browser</h3>
          <p>
            Lo schema è sempre lo stesso: aggiungi il listener nel setup e rimuovilo nel cleanup, passando la{' '}
            <strong>stessa funzione</strong>.
          </p>
        </Prose>
        <Example title="Dimensioni della finestra" code={windowSizeManualSrc} file={`${DIR}/WindowSizeManual.tsx`}>
          <WindowSizeManual />
        </Example>

        <Prose>
          <h3>Caricare dati e gestire le race condition</h3>
          <p>
            Caricare dati in un effetto ha una trappola: se l'utente cambia selezione velocemente, le risposte possono
            arrivare <strong>in ordine diverso</strong> da quello delle richieste, e una risposta vecchia può sovrascrivere
            quella giusta. Il cleanup risolve il problema annullando la richiesta precedente con un{' '}
            <code>AbortController</code>.
          </p>
          <p>
            Prova così: <strong>togli la spunta</strong> da &quot;Annulla la richiesta nel cleanup&quot; e clicca in fretta
            su più utenti. Prima o poi vedrai l'utente sbagliato. Poi rimetti la spunta e riprova. Il pulsante #999 mostra
            la gestione di un errore 404.
          </p>
          <p>
            Nota anche dove parte il caricamento: <code>setIsLoading(true)</code> è in <code>selectUser</code>, cioè
            nell'evento che lo provoca, non all'inizio dell'effetto. Chiamare <code>setState</code> in modo sincrono
            dentro un effetto provoca un render in più, e il linter lo segnala (<code>react/set-state-in-effect</code>).
          </p>
        </Prose>
        <Example title="Utente da JSONPlaceholder con AbortController" code={userFetchSrc} file={`${DIR}/UserFetch.tsx`}>
          <UserFetch />
        </Example>
        <Callout variant="tip">
          <p>
            Funziona, ma è parecchio codice da ripetere per ogni chiamata, e mancano cache, deduplicazione e nuovi
            tentativi. Nella pagina <Link to="/data-fetching">Data fetching</Link> lo stesso schema diventa un hook{' '}
            <code>useFetch</code> riutilizzabile, poi si passa a TanStack Query.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="senza-effetti" title="Quando NON serve un effetto">
        <Prose>
          <p>
            L'errore più comune con <code>useEffect</code> è usarlo per cose che non riguardano un sistema esterno. Ogni
            effetto superfluo aggiunge un render in più e un punto in cui lo stato può andare fuori sincronia. Prima di
            scriverne uno, chiediti: <strong>sto sincronizzando qualcosa fuori da React?</strong> Se no, quasi sempre c'è
            una soluzione più semplice.
          </p>
          <h3>1. Dati derivati: calcolali durante il render</h3>
        </Prose>
        <CodeCompare
          bad={`const [firstName, setFirstName] = useState('Ada')
const [lastName, setLastName] = useState('Lovelace')
const [fullName, setFullName] = useState('')

useEffect(() => {
  setFullName(firstName + ' ' + lastName)
}, [firstName, lastName])`}
          good={`const [firstName, setFirstName] = useState('Ada')
const [lastName, setLastName] = useState('Lovelace')

// Recomputed on every render, always in sync
const fullName = firstName + ' ' + lastName`}
        />
        <Prose>
          <h3>2. Reazioni a un'azione dell'utente: mettile nell'event handler</h3>
        </Prose>
        <CodeCompare
          bad={`const [submitted, setSubmitted] = useState(false)

useEffect(() => {
  if (submitted) {
    sendForm(data)
    showToast('Inviato!')
  }
}, [submitted])`}
          good={`async function handleSubmit() {
  // The user clicked: this is an event, not a sync
  await sendForm(data)
  showToast('Inviato!')
}`}
        />
        <Prose>
          <h3>3. Azzerare lo stato quando cambia una prop: usa una key</h3>
        </Prose>
        <CodeCompare
          bad={`function Profile({ userId }) {
  const [comment, setComment] = useState('')

  useEffect(() => {
    setComment('')
  }, [userId])
  // ...
}`}
          good={`// A different key = a new component instance
// with fresh state, no effect needed
<Profile key={userId} userId={userId} />`}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="use-ref" title="useRef">
        <Prose>
          <p>
            <code>useRef(initialValue)</code> restituisce un oggetto <code>{'{ current }'}</code> che resta lo stesso per
            tutta la vita del componente. Ha due usi:
          </p>
          <ul>
            <li>
              <strong>Accedere a un nodo del DOM</strong>: focus, scroll, misure, integrazione con librerie esterne.
            </li>
            <li>
              <strong>Ricordare un valore senza re-render</strong>: id di timer, valori precedenti, istanze di oggetti
              esterni.
            </li>
          </ul>
          <h3>Riferimento a un elemento del DOM</h3>
          <p>
            Passa il ref all'attributo <code>ref</code>: React assegna il nodo a <code>ref.current</code> dopo il mount e
            lo rimette a <code>null</code> all'unmount. In React 19 <code>ref</code> è una prop normale, quindi anche un
            tuo componente come <code>Input</code> può riceverlo senza <code>forwardRef</code> (vedi{' '}
            <code>src/shared/ui/Input.tsx</code>).
          </p>
        </Prose>
        <Example title="Gestire il focus" code={focusInputSrc} file={`${DIR}/FocusInput.tsx`}>
          <FocusInput />
        </Example>

        <Prose>
          <h3>Un valore che non deve provocare un render</h3>
          <p>
            L'id restituito da <code>setInterval</code> serve solo per chiamare <code>clearInterval</code>, non compare a
            schermo. Con lo stato causerebbe render inutili. Con una variabile normale andrebbe perso a ogni render. Il ref
            è il posto giusto.
          </p>
        </Prose>
        <Example title="Cronometro" code={stopwatchSrc} file={`${DIR}/Stopwatch.tsx`}>
          <Stopwatch />
        </Example>

        <Prose>
          <h3>Ref vs stato, a confronto</h3>
          <p>
            Clicca più volte &quot;Incrementa (nessun render)&quot;: il numero non cambia, ma il valore cresce (lo vedi con
            &quot;Leggi&quot;). Al primo clic sul contatore di sinistra il componente si ri-renderizza e anche il ref mostra
            il suo valore reale.
          </p>
        </Prose>
        <Example title="Il ref non provoca re-render" code={refVsStateSrc} file={`${DIR}/RefVsState.tsx`}>
          <RefVsState />
        </Example>
        <Table
          head={['', 'useState', 'useRef']}
          rows={[
            ['Cambiarlo provoca un render', 'Sì', 'No'],
            ['Valore durante il render', 'Fotografia costante', 'Mutabile, sempre l’ultimo'],
            ['Come si aggiorna', '`setValue(next)`', '`ref.current = next`'],
            ['Si legge nel JSX', 'Sì', 'No, solo in handler ed effetti'],
            ['Usalo per', 'Tutto ciò che si vede a schermo', 'Nodi DOM, id di timer, istanze esterne'],
          ]}
        />
        <Callout variant="warning">
          <p>
            Non leggere né scrivere <code>ref.current</code> durante il render (tranne per inizializzarlo in modo lazy):
            il risultato del componente diventerebbe imprevedibile. Usa i ref negli event handler e negli effetti.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="verso-custom-hook" title="Dagli hook base ai custom hook">
        <Prose>
          <p>
            Il listener di <code>resize</code> scritto sopra è codice che si ripete ovunque serva. Un{' '}
            <strong>custom hook</strong> è semplicemente una funzione che inizia con <code>use</code> e chiama altri hook:
            sposti lì lo stato e l'effetto e il componente resta pulito.
          </p>
        </Prose>
        <Example title="Stesso esempio, con useWindowSize" code={windowSizeWithHookSrc} file={`${DIR}/WindowSizeWithHook.tsx`}>
          <WindowSizeWithHook />
        </Example>
        <Prose>
          <p>
            L'hook a sua volta si appoggia a <code>useEventListener</code>, un hook generico che gestisce aggiunta e
            rimozione del listener per qualsiasi evento:
          </p>
        </Prose>
        <div className="grid gap-4 lg:grid-cols-2">
          <CodeBlock code={useWindowSizeSrc} language="ts" filename="src/shared/hooks/useWindowSize.ts" />
          <CodeBlock code={useEventListenerSrc} language="ts" filename="src/shared/hooks/useEventListener.ts" />
        </div>
        <Callout variant="note" title="useEffectEvent">
          <p>
            <code>useEventListener</code> usa <code>useEffectEvent</code> (stabile da React 19.2): restituisce una
            funzione che legge sempre le props e lo stato più recenti ma <strong>non</strong> è una dipendenza
            dell'effetto. Così il listener non viene rimosso e riaggiunto a ogni render. Se ne parla nella pagina Hook
            avanzati.
          </p>
        </Callout>
        <Prose>
          <p>
            Tutti gli hook riutilizzabili del progetto stanno in <code>src/shared/hooks/</code> e puoi copiarli in altri
            progetti: <code>useToggle</code>, <code>useLocalStorage</code>, <code>useEventListener</code>,{' '}
            <code>useWindowSize</code>, <code>useMediaQuery</code>, <code>useInterval</code>, <code>usePrevious</code>,{' '}
            <code>useDebounce</code>, <code>useOnClickOutside</code>, <code>useOnlineStatus</code>,{' '}
            <code>useDocumentTitle</code>, <code>useCopyToClipboard</code>, <code>useDarkMode</code>. Come si progettano,
            come si tipizzano e come si testano lo vediamo nella pagina <Link to="/custom-hooks">Custom hook</Link>.
          </p>
        </Prose>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="riepilogo" title="Riepilogo">
        <Table
          head={['Hook', 'Serve per', 'Ricorda']}
          rows={[
            [
              '`useState`',
              'Dati che cambiano e si vedono a schermo',
              'Aggiornamenti immutabili, setter con funzione se dipendi dal valore precedente, niente stato derivato',
            ],
            [
              '`useEffect`',
              'Sincronizzarsi con sistemi esterni',
              'Cleanup simmetrico al setup, dipendenze complete, niente effetti per dati derivati o eventi utente',
            ],
            [
              '`useRef`',
              'Nodi DOM e valori che non devono provocare render',
              'Leggilo e scrivilo in handler ed effetti, non durante il render',
            ],
          ]}
        />
      </Section>
    </Page>
  )
}
