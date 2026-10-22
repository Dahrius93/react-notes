import { Link } from 'react-router'
import { Callout } from '@/docs/Callout'
import { CodeBlock, CodeCompare } from '@/docs/CodeBlock'
import { Example } from '@/docs/Example'
import { Page } from '@/docs/Page'
import { Prose, Section } from '@/docs/Section'
import { Table } from '@/docs/Table'
import useAsyncSrc from '@/shared/hooks/useAsync.ts?raw'
import assertNeverSrc from '@/shared/lib/assertNever.ts?raw'
import { Step } from '@/docs/Step'
import { Counter } from './examples/basic/Counter'
import counterSrc from './examples/basic/Counter.tsx?raw'
import counterReducerSrc from './examples/basic/counterReducer.ts?raw'
import counterReducerTestSrc from './examples/basic/__tests__/counterReducer.test.ts?raw'
import { TodoApp } from './examples/todos/TodoApp'
import todoAppSrc from './examples/todos/TodoApp.tsx?raw'
import todoItemSrc from './examples/todos/TodoItem.tsx?raw'
import todosReducerSrc from './examples/todos/todosReducer.ts?raw'
import todosReducerTestSrc from './examples/todos/__tests__/todosReducer.test.ts?raw'
import { UsersLoader } from './examples/UsersLoader'
import usersLoaderSrc from './examples/UsersLoader.tsx?raw'

const DIR = 'src/features/reducer/examples'

export default function ReducerPage() {
  return (
    <Page
      title="useReducer"
      lead="Quando lo stato ha molte regole di aggiornamento, raccoglile in una funzione pura: il reducer. I componenti si limitano a dire cosa è successo."
    >
      {/* ------------------------------------------------------------------ */}
      <Section id="primo-esempio" title="Primo esempio, passo per passo">
        <Prose>
          <p>
            Con <code>useState</code> la logica di aggiornamento è sparsa negli event handler. Con{' '}
            <code>useReducer</code> la sposti in un'unica funzione, il <strong>reducer</strong>, che riceve lo stato attuale
            e un'<strong>azione</strong> (un oggetto che descrive cosa è successo) e restituisce il nuovo stato. Il nome
            viene da <code>Array.prototype.reduce</code>: come <code>reduce</code> accumula un risultato da una lista di
            valori, il reducer accumula lo stato da una sequenza di azioni.
          </p>
          <p>Un contatore con passo variabile, in due file più il test:</p>
        </Prose>
        <CodeBlock
          language="bash"
          filename="struttura"
          code={`counter/
  counterReducer.ts              # 1. state, actions and reducer (no React)
  Counter.tsx                    # 2. useReducer + dispatch in the component
  __tests__/counterReducer.test.ts  # 3. test the reducer as a plain function`}
        />

        <Step n={1} title="Scrivi stato, azioni e reducer">
          <Prose>
            <p>
              Tre cose, in un file <code>.ts</code> che non importa nulla da React: il <strong>tipo dello stato</strong>,
              l'elenco delle <strong>azioni</strong> possibili (ognuna con un <code>type</code> diverso) e la{' '}
              <strong>funzione reducer</strong>, che per ogni azione restituisce un nuovo stato senza modificare quello
              vecchio.
            </p>
          </Prose>
          <CodeBlock code={counterReducerSrc} language="ts" filename="counter/counterReducer.ts" />
        </Step>

        <Step n={2} title="Usalo nel componente">
          <Prose>
            <p>
              <code>useReducer(reducer, statoIniziale)</code> restituisce lo stato attuale e <code>dispatch</code>. Gli
              event handler non calcolano niente: chiamano <code>{"dispatch({ type: 'incremented' })"}</code> e il reducer
              decide come cambia lo stato. Dopo ogni azione React ri-renderizza il componente con il nuovo stato.
            </p>
          </Prose>
          <CodeBlock code={counterSrc} filename="counter/Counter.tsx" />
        </Step>

        <Step n={3} title="Testa il reducer">
          <Prose>
            <p>
              Il reducer è una funzione normale: gli passi uno stato e un'azione e controlli cosa restituisce. Nessun
              render, nessun click simulato.
            </p>
          </Prose>
          <CodeBlock code={counterReducerTestSrc} language="ts" filename="counter/__tests__/counterReducer.test.ts" />
        </Step>

        <Example title="Contatore con useReducer" code={counterSrc} file={`${DIR}/basic/Counter.tsx`}>
          <Counter />
        </Example>
        <Callout variant="tip" title="Azioni come eventi">
          <p>
            Dai alle azioni nomi al passato che descrivono <strong>cosa è successo</strong> (<code>added</code>,{' '}
            <code>filterChanged</code>), non comandi che dicono come modificare lo stato (<code>setTodos</code>,{' '}
            <code>pushItem</code>). Così il componente non deve sapere com'è fatto lo stato, e una stessa azione può
            aggiornare più campi.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="azioni-tipizzate" title="Azioni tipizzate con TypeScript">
        <Prose>
          <p>
            Le azioni si descrivono con una <strong>union discriminata</strong>: ogni variante ha un campo{' '}
            <code>type</code> letterale diverso e i propri dati. Dentro lo <code>switch</code>, TypeScript restringe il
            tipo di <code>action</code> a ogni <code>case</code>, quindi in <code>case &apos;edited&apos;</code>{' '}
            <code>action.text</code> esiste, in <code>case &apos;deleted&apos;</code> no.
          </p>
        </Prose>
        <CodeBlock
          language="ts"
          code={`type TodosAction =
  | { type: 'added'; id: string; text: string }
  | { type: 'toggled'; id: string }
  | { type: 'deleted'; id: string }
  | { type: 'filterChanged'; filter: Filter }

dispatch({ type: 'added', text: 'Ciao' })      // ✗ error: 'id' is missing
dispatch({ type: 'toggled', id: 1 })           // ✗ error: id must be a string
dispatch({ type: 'removed', id: 'a' })         // ✗ error: unknown action type`}
        />
        <Prose>
          <h3>Controllo di esaustività</h3>
          <p>
            Cosa succede se aggiungi un'azione alla union e ti dimentichi di gestirla? Con un <code>default</code> che
            chiama <code>assertNever(action)</code>, TypeScript dà un errore di compilazione: nel <code>default</code>{' '}
            <code>action</code> dovrebbe essere <code>never</code>, perché tutti i casi sono stati gestiti, e se non lo è
            ti indica proprio quello mancante.
          </p>
        </Prose>
        <CodeBlock code={assertNeverSrc} language="ts" filename="src/shared/lib/assertNever.ts" />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="esempio-completo" title="Esempio completo: lista di attività">
        <Prose>
          <p>
            La stessa lista della pagina <Link to="/hooks-base#use-state">Hook di base</Link>, cresciuta: modifica in linea
            (pulsante o doppio clic), filtri, &quot;completa tutte&quot;, &quot;elimina completate&quot; e salvataggio in{' '}
            <code>localStorage</code>. Ricarica la pagina: le attività restano.
          </p>
        </Prose>
        <Example title="Todo app con useReducer" code={todoAppSrc} file={`${DIR}/todos/TodoApp.tsx`}>
          <TodoApp />
        </Example>
        <Prose>
          <p>
            Tutta la logica sta in un file <code>.ts</code> senza React: tipi, stato iniziale, reducer e{' '}
            <strong>selettori</strong>, cioè funzioni che calcolano dati derivati (attività visibili, conteggi) senza
            salvarli nello stato.
          </p>
        </Prose>
        <CodeBlock code={todosReducerSrc} language="ts" filename={`${DIR}/todos/todosReducer.ts`} />
        <Prose>
          <p>
            Ogni riga riceve <code>dispatch</code> come prop. <code>dispatch</code> ha un'identità{' '}
            <strong>stabile</strong>: non cambia tra un render e l'altro, quindi non serve <code>useCallback</code>. Lo
            stato &quot;sto modificando questa riga&quot; invece è puramente visivo e resta locale nel componente:
          </p>
        </Prose>
        <CodeBlock code={todoItemSrc} filename={`${DIR}/todos/TodoItem.tsx`} />
        <Callout variant="note" title="Il terzo argomento di useReducer">
          <p>
            <code>useReducer(reducer, initialArg, init)</code> calcola lo stato iniziale chiamando{' '}
            <code>init(initialArg)</code> <strong>una sola volta</strong>, come l'inizializzazione lazy di{' '}
            <code>useState</code>. Qui serve a leggere <code>localStorage</code> solo al mount e non a ogni render.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="regole" title="Le regole di un reducer">
        <Prose>
          <p>
            Un reducer deve essere una <strong>funzione pura</strong>: stesso stato e stessa azione danno sempre lo stesso
            risultato, senza effetti collaterali. In <code>StrictMode</code> React lo chiama due volte apposta, per farti
            notare se non lo è.
          </p>
          <ul>
            <li>
              <strong>Non modificare</strong> <code>state</code>: restituisci oggetti e array nuovi (spread,{' '}
              <code>map</code>, <code>filter</code>).
            </li>
            <li>
              <strong>Niente effetti collaterali</strong>: niente fetch, timer, <code>localStorage</code>,{' '}
              <code>console.log</code> di produzione. Vanno negli event handler o negli effetti.
            </li>
            <li>
              <strong>Niente valori casuali o dipendenti dall'ora</strong>: <code>crypto.randomUUID()</code> e{' '}
              <code>Date.now()</code> si calcolano prima e si passano nell'azione.
            </li>
            <li>
              Se non cambia nulla, <strong>restituisci lo stesso oggetto</strong> <code>state</code>: React salterà il
              re-render.
            </li>
          </ul>
        </Prose>
        <CodeCompare
          language="ts"
          bad={`case 'added':
  state.todos.push({
    id: crypto.randomUUID(), // impure
    text: action.text,
    done: false,
  })
  return state // same object: no re-render`}
          good={`case 'added':
  return {
    ...state,
    todos: [
      ...state.todos,
      { id: action.id, text: action.text, done: false },
    ],
  }`}
        />
        <Callout variant="tip" title="Stato molto annidato?">
          <p>
            Se gli spread diventano illeggibili (<code>{'{ ...state, a: { ...state.a, b: { ...state.a.b, c } } }'}</code>),
            prima prova ad appiattire lo stato. Se non basta, la libreria <strong>Immer</strong> (
            <code>useImmerReducer</code>) permette di scrivere <code>draft.a.b.c = x</code> e produce comunque un oggetto
            nuovo.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="macchina-a-stati" title="Il reducer come macchina a stati">
        <Prose>
          <p>
            Un uso molto pratico: modellare un'operazione asincrona. Con tre <code>useState</code> separati si possono
            rappresentare combinazioni <strong>impossibili</strong>, come caricamento ed errore insieme, oppure successo
            senza dati. Con uno stato <code>status</code> e un reducer, ogni transizione è esplicita e le combinazioni
            impossibili non sono rappresentabili.
          </p>
        </Prose>
        <CodeCompare
          language="ts"
          bad={`const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState<Error | null>(null)
const [data, setData] = useState<User[] | null>(null)

// isLoading && error? data && error?
// Every handler must remember to reset the others`}
          good={`type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'pending'; data?: T }
  | { status: 'success'; data: T }
  | { status: 'error'; data?: T; error: Error }

// One field decides the state: exactly one at a time`}
        />
        <Prose>
          <p>
            In <code>src/shared/hooks/useAsync.ts</code> questa macchina a stati diventa un hook riutilizzabile.{' '}
            <code>run(promise)</code> segue la promise; se ne lanci una nuova prima che la vecchia finisca, la risposta
            vecchia viene <strong>ignorata</strong>. È la stessa race condition vista con <code>useEffect</code>, risolta
            con un contatore in un ref.
          </p>
        </Prose>
        <Example title="Caricare utenti con useAsync" code={usersLoaderSrc} file={`${DIR}/UsersLoader.tsx`}>
          <UsersLoader />
        </Example>
        <CodeBlock code={useAsyncSrc} language="ts" filename="src/shared/hooks/useAsync.ts" />
        <Callout variant="note">
          <p>
            Nella pagina <Link to="/data-fetching">Data fetching</Link> costruiamo <code>useFetch</code> sopra questo hook,
            aggiungendo il caricamento automatico e l'annullamento con <code>AbortController</code>.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="test" title="Testare un reducer">
        <Prose>
          <p>
            Il vantaggio più concreto di un reducer: si testa <strong>senza React</strong>. Niente render, niente
            utente simulato, niente attese: stato in ingresso, azione, controllo del risultato. I test girano in pochi
            millisecondi e documentano ogni regola di aggiornamento.
          </p>
        </Prose>
        <CodeBlock code={todosReducerTestSrc} language="ts" filename={`${DIR}/todos/__tests__/todosReducer.test.ts`} />
        <Prose>
          <p>
            Accanto c'è anche <code>TodoApp.test.tsx</code>, un test di integrazione che verifica che i componenti
            inviino le azioni giuste: aggiunta, completamento, filtri, modifica in linea e persistenza.
          </p>
        </Prose>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="confronto" title="useState o useReducer?">
        <Table
          head={['', '`useState`', '`useReducer`']}
          rows={[
            ['Stato', 'Valori semplici e indipendenti', 'Oggetti con più campi che cambiano insieme'],
            ['Logica di aggiornamento', 'Negli event handler', 'Centralizzata nel reducer'],
            ['Codice', 'Meno', 'Più (tipi delle azioni, switch)'],
            ['Debug', 'Cerca chi chiama `setX`', 'Un `console.log(action)` nel reducer mostra tutto'],
            ['Test', 'Tramite il componente', 'Reducer testabile da solo, come funzione pura'],
            ['Passare la logica ai figli', 'Più callback', 'Un solo `dispatch`, stabile'],
          ]}
        />
        <Prose>
          <p>
            Non c'è una scelta giusta in assoluto, e si possono usare entrambi nello stesso componente. Una buona regola:
            parti con <code>useState</code> e passa a <code>useReducer</code> quando ti accorgi che più handler
            aggiornano gli stessi pezzi di stato in modi diversi, o quando un bug ti fa desiderare un posto unico dove
            guardare.
          </p>
        </Prose>
        <Callout variant="tip" title="Prossimo passo: reducer + Context">
          <p>
            Un reducer combinato con un Context diventa uno store globale leggero, senza librerie esterne: lo stato e{' '}
            <code>dispatch</code> disponibili a tutto l'albero dei componenti. È uno dei pattern della pagina{' '}
            <Link to="/context">Context</Link>.
          </p>
        </Callout>
      </Section>
    </Page>
  )
}
