import { Link } from 'react-router'
import { Callout } from '@/docs/Callout'
import { CodeBlock, CodeCompare } from '@/docs/CodeBlock'
import { Example } from '@/docs/Example'
import { Page } from '@/docs/Page'
import { Prose, Section } from '@/docs/Section'
import { Step } from '@/docs/Step'
import { Table } from '@/docs/Table'
import useDebounceTestSrc from '@/shared/hooks/__tests__/useDebounce.test.ts?raw'
import useDarkModeSrc from '@/shared/hooks/useDarkMode.ts?raw'
import useDebounceSrc from '@/shared/hooks/useDebounce.ts?raw'
import useOnClickOutsideSrc from '@/shared/hooks/useOnClickOutside.ts?raw'
import useOnlineStatusSrc from '@/shared/hooks/useOnlineStatus.ts?raw'
import useToggleSrc from '@/shared/hooks/useToggle.ts?raw'
import dropdownTestSrc from '@/shared/ui/__tests__/Dropdown.test.tsx?raw'
import dropdownSrc from '@/shared/ui/Dropdown.tsx?raw'
import { BasicCustomHookDemo } from './examples/basic/BasicCustomHookDemo'
import basicDemoSrc from './examples/basic/BasicCustomHookDemo.tsx?raw'
import likeButtonSrc from './examples/basic/LikeButton.tsx?raw'
import quantityPickerSrc from './examples/basic/QuantityPicker.tsx?raw'
import useCounterSrc from './examples/basic/useCounter.ts?raw'
import { CopyField } from './examples/CopyField'
import copyFieldSrc from './examples/CopyField.tsx?raw'
import { Countdown } from './examples/Countdown'
import countdownSrc from './examples/Countdown.tsx?raw'
import { DebouncedSearch } from './examples/DebouncedSearch'
import debouncedSearchSrc from './examples/DebouncedSearch.tsx?raw'
import { DropdownDemo } from './examples/DropdownDemo'
import { IndependentState } from './examples/IndependentState'
import independentStateSrc from './examples/IndependentState.tsx?raw'
import { MediaQueries } from './examples/MediaQueries'
import mediaQueriesSrc from './examples/MediaQueries.tsx?raw'
import { OnlineIndicator } from './examples/OnlineIndicator'
import onlineIndicatorSrc from './examples/OnlineIndicator.tsx?raw'
import { PersistentNote } from './examples/PersistentNote'
import persistentNoteSrc from './examples/PersistentNote.tsx?raw'
import { PriceTrend } from './examples/PriceTrend'
import priceTrendSrc from './examples/PriceTrend.tsx?raw'

const DIR = 'src/features/custom-hooks/examples'
const HOOKS = 'src/shared/hooks'

export default function CustomHooksPage() {
  return (
    <Page
      title="Custom hook"
      lead="Funzioni che iniziano con use e combinano altri hook: il modo di React per riutilizzare logica con stato tra componenti diversi."
    >
      {/* ------------------------------------------------------------------ */}
      <Section id="primo-esempio" title="Primo esempio, passo per passo">
        <Prose>
          <p>
            Un contatore ci serve in due posti diversi: un pulsante &quot;Mi piace&quot; e un selettore di quantità.
            Invece di riscrivere lo stesso <code>useState</code> e le stesse funzioni in entrambi, li mettiamo in un
            hook nostro.
          </p>
        </Prose>
        <CodeBlock
          language="bash"
          filename="struttura"
          code={`counter/
  useCounter.ts       # 1. the custom hook: state + functions
  LikeButton.tsx      # 2. a component that uses it
  QuantityPicker.tsx  # 3. another component that uses it`}
        />

        <Step n={1} title="Scrivi l'hook in un file">
          <Prose>
            <p>
              Una funzione che inizia con <code>use</code>, chiama <code>useState</code> e restituisce il valore e le
              funzioni per cambiarlo. Nient'altro: niente JSX, niente API speciali.
            </p>
          </Prose>
          <CodeBlock code={useCounterSrc} language="ts" filename="counter/useCounter.ts" />
        </Step>

        <Step n={2} title="Usalo in un componente">
          <Prose>
            <p>
              Il componente chiama <code>useCounter()</code> come un qualsiasi hook di React e prende solo quello che gli
              serve.
            </p>
          </Prose>
          <CodeBlock code={likeButtonSrc} filename="counter/LikeButton.tsx" />
        </Step>

        <Step n={3} title="Riusalo dove vuoi">
          <Prose>
            <p>
              Un altro componente usa lo stesso hook con un valore iniziale diverso. Ognuno ha il{' '}
              <strong>suo</strong> contatore: l'hook condivide il codice, non lo stato.
            </p>
          </Prose>
          <CodeBlock code={quantityPickerSrc} filename="counter/QuantityPicker.tsx" />
        </Step>

        <Example title="Due componenti, un solo hook" code={basicDemoSrc} file={`${DIR}/basic/BasicCustomHookDemo.tsx`}>
          <BasicCustomHookDemo />
        </Example>
        <Callout variant="tip">
          <p>
            Un hook si testa anche da solo, con <code>renderHook</code>: lo trovi in{' '}
            <code>{`${DIR}/basic/__tests__/useCounter.test.ts`}</code>, e più avanti nella sezione{' '}
            <a href="#testare">Testare un custom hook</a>.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="logica-condivisa" title="Logica condivisa, stato separato">
        <Prose>
          <p>
            Un custom hook è una normale funzione JavaScript che <strong>chiama altri hook</strong>. Non c'è nessuna API
            speciale: React lo riconosce solo dal nome, che deve iniziare con <code>use</code> seguito da una maiuscola (
            <code>useToggle</code>, <code>useOnlineStatus</code>). Il prefisso serve a te e al linter per sapere che lì
            dentro valgono le regole degli hook.
          </p>
          <p>
            Il punto chiave: <strong>un custom hook condivide la logica, non lo stato</strong>. Ogni componente che lo
            chiama ottiene il proprio stato indipendente, esattamente come se avesse scritto quelle righe di{' '}
            <code>useState</code> e <code>useEffect</code> direttamente nel suo corpo.
          </p>
        </Prose>
        <Example title="Tre componenti, tre stati indipendenti" code={independentStateSrc} file={`${DIR}/IndependentState.tsx`}>
          <IndependentState />
        </Example>
        <Callout variant="note">
          <p>
            Se invece più componenti devono vedere <strong>lo stesso</strong> stato (utente loggato, tema, carrello), un
            custom hook da solo non basta: serve sollevare lo stato in un antenato comune oppure usare un Context. Spesso le
            due cose si combinano: un <code>AuthProvider</code> con un hook <code>useAuth()</code> per leggerlo (pagina{' '}
            <Link to="/context">Context</Link>).
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="estrarre" title="Come estrarre un hook">
        <Prose>
          <p>
            Il segnale per creare un hook è vedere la <strong>stessa combinazione di stato ed effetti</strong> in più
            componenti, oppure un componente in cui la logica nasconde il JSX. I passi sono sempre gli stessi:
          </p>
          <ol>
            <li>Individua lo stato, gli effetti e gli handler che lavorano insieme.</li>
            <li>
              Spostali in una funzione <code>useQualcosa</code>, nello stesso file per iniziare.
            </li>
            <li>
              Decidi cosa restituire: solo quello che serve al componente (un valore, una tupla o un oggetto).
            </li>
            <li>
              Se è generico, spostalo in <code>src/shared/hooks/</code>; se è legato a una funzionalità, nella cartella di
              quella funzionalità.
            </li>
          </ol>
        </Prose>
        <CodeCompare
          bad={`function StatusBadge() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])

  return <Badge>{isOnline ? 'Online' : 'Offline'}</Badge>
}
// ...and the same 12 lines copied into SaveButton`}
          good={`function StatusBadge() {
  const isOnline = useOnlineStatus()
  return <Badge>{isOnline ? 'Online' : 'Offline'}</Badge>
}

function SaveButton() {
  const isOnline = useOnlineStatus()
  return <Button disabled={!isOnline}>Salva</Button>
}`}
        />
        <Example title="Lo stesso hook in due componenti" code={onlineIndicatorSrc} file={`${DIR}/OnlineIndicator.tsx`}>
          <OnlineIndicator />
        </Example>
        <Prose>
          <p>
            Per provarlo apri gli strumenti per sviluppatori del browser, scheda Network, e imposta &quot;Offline&quot;.
            Ecco l'hook:
          </p>
        </Prose>
        <CodeBlock code={useOnlineStatusSrc} language="ts" filename={`${HOOKS}/useOnlineStatus.ts`} />
        <Callout variant="tip" title="useSyncExternalStore">
          <p>
            Per leggere un valore che vive <strong>fuori da React</strong> e ha un modo per iscriversi ai cambiamenti
            (eventi del browser, uno store esterno, <code>matchMedia</code>), <code>useSyncExternalStore</code> è più
            corretto di <code>useState</code> + <code>useEffect</code>: niente stato duplicato, niente render con un valore
            vecchio. Lo usano anche <code>useOnlineStatus</code> e <code>useMediaQuery</code>.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="api" title="Progettare l'API di un hook">
        <Prose>
          <h3>Cosa restituire</h3>
        </Prose>
        <Table
          head={['Forma', 'Quando', 'Esempio']}
          rows={[
            ['Un valore', 'L’hook espone un solo dato', '`const isOnline = useOnlineStatus()`'],
            [
              'Tupla `[valore, azioni]`',
              'Somiglia a `useState`; chi lo usa sceglie i nomi',
              '`const [isOpen, { toggle }] = useToggle()`',
            ],
            [
              'Oggetto',
              'Più di 2 valori, o valori opzionali da prendere per nome',
              '`const { copied, copy } = useCopyToClipboard()`',
            ],
          ]}
        />
        <Prose>
          <p>
            Con una tupla aggiungi <code>as const</code> al <code>return</code>: senza, TypeScript la tipizza come array
            di un tipo unione e perdi la posizione di ogni elemento.
          </p>
          <h3>Funzioni stabili</h3>
          <p>
            Le funzioni restituite da un hook finiscono spesso nelle dipendenze di effetti o in componenti memoizzati di chi
            lo usa. Se cambiano identità a ogni render, provocano effetti rieseguiti e render inutili. Avvolgile in{' '}
            <code>useCallback</code>: chi usa l'hook non deve preoccuparsene. Il <code>useCounter</code> del primo esempio
            non lo fa, per restare semplice; <code>useToggle</code>, qui sotto, è la versione &quot;da libreria&quot;.
          </p>
        </Prose>
        <CodeBlock code={useToggleSrc} language="ts" filename={`${HOOKS}/useToggle.ts`} />
        <Prose>
          <h3>Parametri e tipi generici</h3>
          <ul>
            <li>
              Con uno o due parametri vanno bene gli argomenti posizionali: <code>useDebounce(value, 300)</code>.
            </li>
            <li>
              Con più di due, o con opzioni facoltative, passa un oggetto: <code>{'useFetch(url, { enabled, retry })'}</code>.
            </li>
            <li>
              Se l'hook lavora con un valore di qualsiasi tipo, rendilo <strong>generico</strong>: il tipo viene dedotto da
              ciò che passi.
            </li>
          </ul>
        </Prose>
        <CodeBlock
          language="ts"
          code={`export function useDebounce<T>(value: T, delayMs = 300): T

const debouncedQuery = useDebounce(query)          // T = string
const debouncedFilters = useDebounce(filters, 500) // T = Filters

export function useLocalStorage<T>(key: string, initialValue: T | (() => T))

const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light') // explicit T`}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="catalogo" title="La libreria di hook del progetto">
        <Prose>
          <p>
            Questi hook stanno in <code>src/shared/hooks/</code>. Non dipendono da nient'altro del progetto (al massimo
            l'uno dall'altro), quindi puoi copiarli così come sono in un altro progetto React 19.
          </p>
        </Prose>
        <Table
          head={['Hook', 'Firma', 'A cosa serve']}
          rows={[
            ['`useToggle`', '`(initial?) → [value, { toggle, setOn, setOff, set }]`', 'Booleani: modali, pannelli, menu'],
            ['`useLocalStorage`', '`(key, initial) → [value, setValue]`', 'Stato persistente, sincronizzato tra schede'],
            ['`useDebounce`', '`(value, delayMs?) → value`', 'Ricerche mentre si digita, filtri'],
            ['`useInterval`', '`(callback, delay | null)`', 'Timer, polling, animazioni a scatti'],
            ['`usePrevious`', '`(value) → previous | undefined`', 'Confronti e transizioni tra valori'],
            ['`useEventListener`', '`(type, handler, target?)`', 'Qualsiasi evento DOM con cleanup automatico'],
            ['`useOnClickOutside`', '`(ref, handler)`', 'Chiudere dropdown e popover'],
            ['`useWindowSize`', '`() → { width, height }`', 'Layout che dipendono dalle dimensioni'],
            ['`useMediaQuery`', '`(query) → boolean`', 'Breakpoint, tema di sistema, preferenze utente'],
            ['`useOnlineStatus`', '`() → boolean`', 'Stato della connessione'],
            ['`useCopyToClipboard`', '`(resetAfterMs?) → { copied, copy }`', 'Pulsanti “Copia”'],
            ['`useDocumentTitle`', '`(title)`', 'Titolo della scheda per pagina'],
            ['`useDarkMode`', '`() → { theme, setTheme, isDark }`', 'Tema chiaro/scuro/di sistema'],
            ['`useAsync`', '`<T>() → { status, data, error, run, reset }`', 'Stato di una promise, senza race condition'],
            ['`useFetch`', '`<T>(url | null) → { status, data, error, refetch }`', 'Caricare JSON con annullamento (vedi Data fetching)'],
            [
              '`useSimpleForm`',
              '`({ initialValues, validate, onSubmit }) → form`',
              'Form piccoli e medi senza librerie (vedi Form con gli hook base)',
            ],
          ]}
        />

        <Prose>
          <h3>useLocalStorage</h3>
          <p>
            Stessa API di <code>useState</code>, più una chiave. Il valore viene salvato come JSON e riletto all'avvio. Se
            apri questa pagina in <strong>due schede</strong> e scrivi in una, l'altra si aggiorna grazie all'evento{' '}
            <code>storage</code>.
          </p>
        </Prose>
        <Example title="Una nota che sopravvive al refresh" code={persistentNoteSrc} file={`${DIR}/PersistentNote.tsx`}>
          <PersistentNote />
        </Example>

        <Prose>
          <h3>useDebounce</h3>
          <p>
            Restituisce il valore solo quando smette di cambiare per un certo tempo. L'input resta reattivo (usa{' '}
            <code>query</code>), mentre l'operazione costosa, di solito una chiamata API, usa <code>debouncedQuery</code> e
            parte una volta per pausa invece che a ogni tasto.
          </p>
        </Prose>
        <Example title="Ricerca con debounce" code={debouncedSearchSrc} file={`${DIR}/DebouncedSearch.tsx`}>
          <DebouncedSearch />
        </Example>
        <CodeBlock code={useDebounceSrc} language="ts" filename={`${HOOKS}/useDebounce.ts`} />
        <Callout variant="note">
          <p>
            Tutto il lavoro lo fa il <strong>cleanup</strong>: ogni nuovo valore cancella il timer precedente prima di
            avviarne uno nuovo. È lo stesso meccanismo visto nella pagina <Link to="/hooks-base#use-effect">Hook di base</Link>.
          </p>
        </Callout>

        <Prose>
          <h3>useInterval</h3>
          <p>
            Un <code>setInterval</code> dentro <code>useEffect</code> ha un problema classico: la callback vede i valori del
            render in cui è stata creata (<em>closure vecchia</em>). <code>useInterval</code> lo risolve con{' '}
            <code>useEffectEvent</code>: la callback legge sempre lo stato aggiornato, e il timer riparte solo se cambia il
            ritardo. Passando <code>null</code> lo metti in pausa.
          </p>
        </Prose>
        <Example title="Conto alla rovescia con pausa e velocità" code={countdownSrc} file={`${DIR}/Countdown.tsx`}>
          <Countdown />
        </Example>

        <Prose>
          <h3>usePrevious</h3>
          <p>
            Restituisce il valore precedente. È implementato con lo stato e non con un ref, perché leggere{' '}
            <code>ref.current</code> durante il render è sconsigliato in React 19 (il motivo è nel commento del file).
          </p>
        </Prose>
        <Example title="Andamento di un prezzo" code={priceTrendSrc} file={`${DIR}/PriceTrend.tsx`}>
          <PriceTrend />
        </Example>

        <Prose>
          <h3>useMediaQuery e useWindowSize</h3>
          <p>
            Preferisci <code>useMediaQuery</code> quando ti serve sapere solo se sei sopra o sotto un breakpoint: provoca
            un render solo quando il risultato cambia, non a ogni pixel di ridimensionamento come{' '}
            <code>useWindowSize</code>. Per il solo layout, le classi responsive di Tailwind (<code>md:</code>,{' '}
            <code>lg:</code>) restano la scelta migliore: niente JavaScript.
          </p>
        </Prose>
        <Example title="Media query dal vivo" code={mediaQueriesSrc} file={`${DIR}/MediaQueries.tsx`}>
          <MediaQueries />
        </Example>

        <Prose>
          <h3>useCopyToClipboard</h3>
          <p>
            Copia un testo e restituisce un flag <code>copied</code> che torna a <code>false</code> da solo. È lo stesso
            hook usato dal pulsante &quot;Copia&quot; dei blocchi di codice di queste note.
          </p>
        </Prose>
        <Example title="Copia negli appunti" code={copyFieldSrc} file={`${DIR}/CopyField.tsx`}>
          <CopyField />
        </Example>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="composizione" title="Comporre gli hook">
        <Prose>
          <p>
            Gli hook si compongono come funzioni: un hook può usarne altri, e un componente può combinarne diversi. Il menu
            qui sotto (<code>src/shared/ui/Dropdown.tsx</code>) mette insieme tre hook del progetto: <code>useToggle</code>{' '}
            per aperto/chiuso, <code>useOnClickOutside</code> per chiuderlo cliccando fuori, <code>useEventListener</code>{' '}
            per il tasto Esc. Il componente contiene solo il JSX e il collegamento tra i pezzi.
          </p>
        </Prose>
        <Example title="Dropdown: tre hook, nessun useEffect scritto a mano" code={dropdownSrc} file="src/shared/ui/Dropdown.tsx">
          <DropdownDemo />
        </Example>
        <Prose>
          <p>
            Anche gli hook stessi sono costruiti così: <code>useOnClickOutside</code> si appoggia a{' '}
            <code>useEventListener</code>, e <code>useDarkMode</code>, usato dal selettore del tema in alto a destra, unisce{' '}
            <code>useLocalStorage</code>, <code>useMediaQuery</code> e un effetto.
          </p>
        </Prose>
        <div className="grid gap-4 lg:grid-cols-2">
          <CodeBlock code={useOnClickOutsideSrc} language="ts" filename={`${HOOKS}/useOnClickOutside.ts`} />
          <CodeBlock code={useDarkModeSrc} language="ts" filename={`${HOOKS}/useDarkMode.ts`} />
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="testare" title="Testare un custom hook">
        <Prose>
          <p>Ci sono due strategie, e conviene usarle entrambe:</p>
          <ul>
            <li>
              <strong>
                <code>renderHook</code>
              </strong>{' '}
              di Testing Library monta l'hook in un componente invisibile. <code>result.current</code> contiene l'ultimo
              valore restituito, <code>rerender(props)</code> simula nuovi argomenti, <code>act()</code> avvolge le azioni
              che aggiornano lo stato. Con <code>vi.useFakeTimers()</code> controlli il tempo per debounce e intervalli.
            </li>
            <li>
              <strong>Attraverso un componente</strong> che lo usa: è il test più realistico, e verifica quello che vede
              l'utente.
            </li>
          </ul>
        </Prose>
        <CodeBlock code={useDebounceTestSrc} language="ts" filename={`${HOOKS}/__tests__/useDebounce.test.ts`} />
        <CodeBlock code={dropdownTestSrc} filename="src/shared/ui/__tests__/Dropdown.test.tsx" />
        <Prose>
          <p>
            Lanciali con <code>npm test</code>. Setup, mock e casi più complessi sono nella pagina{' '}
            <Link to="/testing">Testing con Vitest</Link>.
          </p>
        </Prose>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="errori" title="Errori comuni">
        <Prose>
          <h3>Hook che imitano i metodi del ciclo di vita</h3>
          <p>
            Hook come <code>useMount</code> o <code>useUpdateEffect</code> nascondono le dipendenze e riportano al modello
            mentale delle classi. Un buon hook descrive <strong>cosa</strong> fa (<code>useChatRoom</code>,{' '}
            <code>useOnlineStatus</code>), non <strong>quando</strong>.
          </p>
        </Prose>
        <CodeCompare
          bad={`function useMount(fn: () => void) {
  useEffect(() => {
    fn()
  }, []) // missing dependency hidden from the linter
}

useMount(() => connect(roomId)) // roomId changes? ignored`}
          good={`function useChatRoom(roomId: string) {
  useEffect(() => {
    const connection = connect(roomId)
    return () => connection.close()
  }, [roomId])
}

useChatRoom(roomId)`}
        />
        <Prose>
          <h3>Restituire oggetti o funzioni nuovi a ogni render</h3>
        </Prose>
        <CodeCompare
          bad={`function useCounter() {
  const [count, setCount] = useState(0)
  // new function on every render
  const increment = () => setCount((c) => c + 1)
  return { count, increment }
}

// in a component: runs after EVERY render
useEffect(() => { ... }, [increment])`}
          good={`function useCounter() {
  const [count, setCount] = useState(0)
  const increment = useCallback(
    () => setCount((c) => c + 1),
    [],
  )
  return { count, increment }
}`}
        />
        <Prose>
          <h3>Prefisso use su funzioni che non usano hook</h3>
          <p>
            Se una funzione non chiama nessun hook, è una funzione normale: chiamala <code>formatDate</code>, non{' '}
            <code>useFormatDate</code>. Il prefisso le imporrebbe le regole degli hook (niente <code>if</code>, niente
            cicli) senza alcun motivo.
          </p>
          <h3>Hook che restituiscono JSX</h3>
          <p>
            Se ti trovi a restituire elementi JSX da un hook, quello che stai scrivendo è un <strong>componente</strong>.
            Gli hook restituiscono dati e funzioni; i componenti restituiscono UI.
          </p>
        </Prose>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="checklist" title="Checklist">
        <Prose>
          <ul>
            <li>
              Il nome inizia con <code>use</code> e descrive lo scopo, non il ciclo di vita.
            </li>
            <li>Chiama almeno un altro hook (altrimenti è una funzione normale).</li>
            <li>Restituisce dati e funzioni, mai JSX.</li>
            <li>
              Le funzioni restituite sono stabili (<code>useCallback</code>), le tuple hanno <code>as const</code>.
            </li>
            <li>Ogni effetto ha un cleanup simmetrico e dipendenze complete.</li>
            <li>
              Generico (<code>&lt;T&gt;</code>) quando lavora con valori di qualsiasi tipo.
            </li>
            <li>
              È documentato con JSDoc e un <code>@example</code>: l'editor lo mostra al passaggio del mouse.
            </li>
            <li>Ha un test con <code>renderHook</code> o attraverso un componente.</li>
            <li>
              Sta in <code>src/shared/hooks/</code> se è generico, nella cartella della funzionalità se è specifico.
            </li>
          </ul>
        </Prose>
      </Section>
    </Page>
  )
}
