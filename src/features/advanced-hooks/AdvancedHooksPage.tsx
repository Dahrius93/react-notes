import { Link } from 'react-router'
import { Callout } from '@/docs/Callout'
import { CodeBlock, CodeCompare } from '@/docs/CodeBlock'
import { Example } from '@/docs/Example'
import { Page } from '@/docs/Page'
import { Prose, Section } from '@/docs/Section'
import { Step } from '@/docs/Step'
import { Table } from '@/docs/Table'
import useIntervalSrc from '@/shared/hooks/useInterval.ts?raw'
import advancedHooksTestSrc from './examples/__tests__/advancedHooks.test.tsx?raw'
import { NewsletterForm } from './examples/action-state/NewsletterForm'
import newsletterFormSrc from './examples/action-state/NewsletterForm.tsx?raw'
import submitButtonSrc from './examples/action-state/SubmitButton.tsx?raw'
import subscribeActionSrc from './examples/action-state/subscribeAction.ts?raw'
import { DeferredSearch } from './examples/deferred/DeferredSearch'
import deferredSearchSrc from './examples/deferred/DeferredSearch.tsx?raw'
import { NotificationsDemo } from './examples/effect-event/NotificationsDemo'
import notificationsDemoSrc from './examples/effect-event/NotificationsDemo.tsx?raw'
import { TooltipDemo } from './examples/layout-effect/TooltipDemo'
import tooltipDemoSrc from './examples/layout-effect/TooltipDemo.tsx?raw'
import { MessageThread } from './examples/optimistic/MessageThread'
import messageThreadSrc from './examples/optimistic/MessageThread.tsx?raw'
import { RenameUser } from './examples/transition/RenameUser'
import renameUserSrc from './examples/transition/RenameUser.tsx?raw'
import { SlowTabs } from './examples/transition/SlowTabs'
import slowTabsSrc from './examples/transition/SlowTabs.tsx?raw'
import { PasswordFields } from './examples/use-id/PasswordFields'
import passwordFieldsSrc from './examples/use-id/PasswordFields.tsx?raw'
import { UsePromiseDemo } from './examples/use-promise/UsePromiseDemo'
import usePromiseDemoSrc from './examples/use-promise/UsePromiseDemo.tsx?raw'
import userProfileSrc from './examples/use-promise/UserProfile.tsx?raw'
import userResourceSrc from './examples/use-promise/userResource.ts?raw'

const DIR = 'src/features/advanced-hooks/examples'

export default function AdvancedHooksPage() {
  return (
    <Page
      title="Hook avanzati"
      lead="Gli hook che servono meno spesso ma risolvono problemi precisi: id accessibili, interfacce che restano reattive, misure del DOM, dati asincroni, form action e aggiornamenti ottimistici di React 19."
    >
      <Callout variant="note" title="Come è organizzata la pagina">
        <p>
          Ogni hook ha la sua sezione: prima il problema che risolve, poi l'<strong>uso minimo</strong> in poche righe,
          poi una demo. <code>use</code> e <code>useActionState</code>, che coinvolgono più file, sono spiegati passo per
          passo.
        </p>
      </Callout>

      {/* ------------------------------------------------------------------ */}
      <Section id="panoramica" title="Panoramica">
        <Table
          head={['Hook', 'Problema che risolve']}
          rows={[
            ['`useId`', 'Id unici per collegare label, input e descrizioni (accessibilità)'],
            ['`useTransition`', 'Un aggiornamento pesante o asincrono non deve bloccare l’interfaccia'],
            ['`useDeferredValue`', 'Una parte lenta della pagina può restare indietro mentre l’input resta fluido'],
            ['`useLayoutEffect`', 'Misurare il DOM e correggere la posizione prima che il browser disegni'],
            ['`use`', 'Leggere una promise (con Suspense) o un context, anche in modo condizionale'],
            ['`useActionState` + `useFormStatus`', 'Form con `action`: stato del risultato e stato di invio, senza `useState` per ogni campo'],
            ['`useOptimistic`', 'Mostrare subito il risultato atteso mentre il server lavora'],
            ['`useEffectEvent`', 'Leggere i valori più recenti in un effetto senza farlo ripartire'],
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="use-id" title="useId">
        <Prose>
          <p>
            Per collegare una <code>{'<label>'}</code> al suo input (<code>htmlFor</code> / <code>id</code>) o un messaggio
            d'errore al campo (<code>aria-describedby</code>) servono id <strong>unici nella pagina</strong>. Scriverli a
            mano (<code>id=&quot;password&quot;</code>) si rompe appena il componente compare due volte.{' '}
            <code>useId()</code> genera un id unico e stabile per ogni istanza.
          </p>
        </Prose>
        <CodeBlock
          code={`const id = useId()
return (
  <>
    <label htmlFor={id}>Password</label>
    <input id={id} aria-describedby={\`\${id}-hint\`} />
    <p id={\`\${id}-hint\`}>Almeno 8 caratteri</p>
  </>
)`}
        />
        <Example title="Lo stesso campo due volte, senza collisioni" code={passwordFieldsSrc} file={`${DIR}/use-id/PasswordFields.tsx`}>
          <PasswordFields />
        </Example>
        <Callout variant="warning">
          <p>
            Non usare <code>useId</code> per le <code>key</code> delle liste: le key devono venire dai dati. Tutti i
            componenti di <code>src/shared/ui/</code> (<code>Input</code>, <code>Select</code>, <code>Checkbox</code>...)
            usano già <code>useId</code> quando non passi un <code>id</code>.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="use-transition" title="useTransition">
        <Prose>
          <p>
            Per default ogni aggiornamento di stato è <strong>urgente</strong>: React lo completa prima di fare qualsiasi
            altra cosa. Se il nuovo render è pesante, la pagina si blocca. Avvolgendo l'aggiornamento in{' '}
            <code>startTransition</code> lo segni come <strong>non urgente</strong>: React lo prepara in background, lo
            interrompe se arriva qualcosa di più urgente (un clic, un tasto), e nel frattempo lascia visibile la vecchia
            interfaccia. <code>isPending</code> dice che una transition è in corso.
          </p>
        </Prose>
        <CodeBlock
          code={`const [isPending, startTransition] = useTransition()

function selectTab(next: Tab) {
  startTransition(() => setTab(next)) // non-urgent: interruptible, old UI stays visible
}`}
        />
        <Prose>
          <p>
            Nella demo la tab &quot;Post&quot; impiega circa 300 ms a renderizzarsi. Clicca &quot;Post&quot; e subito dopo
            &quot;Contatti&quot;: con la transition il secondo clic interrompe il primo; senza, la pagina resta bloccata
            finché la tab lenta non è pronta.
          </p>
        </Prose>
        <Example title="Tab con un render lento" code={slowTabsSrc} file={`${DIR}/transition/SlowTabs.tsx`}>
          <SlowTabs />
        </Example>
        <Prose>
          <h3>Transition asincrone (Actions)</h3>
          <p>
            In React 19 la funzione passata a <code>startTransition</code> può essere <strong>async</strong>: React chiama
            queste funzioni &quot;Actions&quot;. <code>isPending</code> resta <code>true</code> fino alla fine, e così non
            serve uno stato <code>isSaving</code> scritto a mano. Gli aggiornamenti di stato che arrivano{' '}
            <strong>dopo un <code>await</code></strong> vanno avvolti di nuovo in <code>startTransition</code>.
          </p>
        </Prose>
        <Example title="Salvataggio con una transition async" code={renameUserSrc} file={`${DIR}/transition/RenameUser.tsx`}>
          <RenameUser />
        </Example>
        <Callout variant="note">
          <p>
            Il router usa le transition per le navigazioni: per questo, in queste note, la pagina vecchia resta visibile
            mentre si scarica quella nuova (pagina <Link to="/routing#lazy">React Router</Link>). Gli input controllati non
            vanno mai aggiornati in una transition: il testo deve comparire subito.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="use-deferred-value" title="useDeferredValue">
        <Prose>
          <p>
            <code>useDeferredValue(value)</code> restituisce una copia del valore che può <strong>restare
            indietro</strong>. Al primo render vale come <code>value</code>; quando <code>value</code> cambia, React prima
            renderizza con il valore vecchio, quindi in modo veloce, e poi prova in background con quello nuovo,
            interrompendosi se nel frattempo arriva un altro cambiamento.
          </p>
          <p>
            È il gemello di <code>useTransition</code>, ma si usa quando <strong>non controlli l'aggiornamento</strong> (il
            valore arriva da una prop, o deve restare urgente per l'input) e vuoi rimandare solo la parte lenta che lo
            usa.
          </p>
        </Prose>
        <CodeBlock
          code={`const [query, setQuery] = useState('')
const deferredQuery = useDeferredValue(query)
const isStale = query !== deferredQuery

<input value={query} onChange={(e) => setQuery(e.target.value)} />  {/* urgent: always responsive */}
<SlowResults query={deferredQuery} />                               {/* memo + deferred: catches up */}`}
        />
        <Example title="Ricerca su una lista lenta" code={deferredSearchSrc} file={`${DIR}/deferred/DeferredSearch.tsx`}>
          <DeferredSearch />
        </Example>
        <Callout variant="warning" title="Serve memo">
          <p>
            Il trucco funziona solo se il componente lento è avvolto in <code>memo</code>: durante il render urgente riceve
            ancora la query vecchia, e <code>memo</code> gli fa saltare il render. Senza <code>memo</code> si
            ri-renderizzerebbe comunque, e non cambierebbe nulla.
          </p>
        </Callout>
        <Table
          head={['', '`useDeferredValue`', '`useDebounce` (Custom hook)']}
          rows={[
            ['Ritardo', 'Nessuno fisso: si adatta alla velocità del dispositivo', 'Fisso (es. 300 ms)'],
            ['Interrompibile', 'Sì', 'No'],
            ['Riduce le richieste di rete', 'No', 'Sì: usalo per le chiamate API'],
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="use-layout-effect" title="useLayoutEffect">
        <Prose>
          <p>
            <code>useEffect</code> gira <strong>dopo</strong> che il browser ha disegnato la pagina.{' '}
            <code>useLayoutEffect</code> gira prima: dopo che React ha aggiornato il DOM, ma prima che il browser lo
            mostri. Serve quando devi <strong>misurare</strong> qualcosa (dimensioni, posizione) e correggere il layout
            subito, senza che l'utente veda la versione sbagliata.
          </p>
        </Prose>
        <CodeBlock
          code={`const ref = useRef<HTMLDivElement>(null)
const [height, setHeight] = useState(0)

useLayoutEffect(() => {
  setHeight(ref.current!.offsetHeight) // re-render BEFORE the browser paints
}, [])`}
        />
        <Prose>
          <p>
            Il tooltip qui sotto deve misurare la propria altezza per sapere se sta sopra o sotto il pulsante. Passa il
            mouse sui pulsanti con le due modalità: con <code>useEffect</code> si vede per un istante nella posizione
            sbagliata (il render è rallentato apposta), con <code>useLayoutEffect</code> mai.
          </p>
        </Prose>
        <Example title="Tooltip che si posiziona da solo" code={tooltipDemoSrc} file={`${DIR}/layout-effect/TooltipDemo.tsx`}>
          <TooltipDemo />
        </Example>
        <Callout variant="warning">
          <p>
            <code>useLayoutEffect</code> blocca il disegno della pagina finché non ha finito: se è lento, rallenta tutto.
            Usalo solo per misure e correzioni visive. In tutti gli altri casi <code>useEffect</code> è la scelta giusta.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="use" title="use: promise e context">
        <Prose>
          <p>
            <code>use(risorsa)</code> legge il valore di una <strong>promise</strong> o di un <strong>context</strong>. A
            differenza degli altri hook si può chiamare dentro <code>if</code> e cicli. Con una promise, il componente
            &quot;si sospende&quot; finché non è risolta: il caricamento lo gestisce il <code>{'<Suspense>'}</code> più
            vicino, gli errori l'Error Boundary più vicino. Dentro il componente non ci sono più stati di loading né di
            errore.
          </p>
          <h3>use con una promise, passo per passo</h3>
        </Prose>
        <Step n={1} title="Una promise stabile">
          <Prose>
            <p>
              La regola più importante: la promise deve essere <strong>la stessa</strong> tra un render e l'altro. Se la
              crei durante il render (<code>use(fetch(...))</code>) ne nasce una nuova a ogni render, e il componente
              resta sospeso per sempre. Serve una cache, oppure una libreria che la gestisce, come TanStack Query con{' '}
              <code>useSuspenseQuery</code> o un loader del router.
            </p>
          </Prose>
          <CodeBlock code={userResourceSrc} language="ts" filename="use-promise/userResource.ts" />
        </Step>
        <Step n={2} title="Il componente legge con use">
          <CodeBlock code={userProfileSrc} filename="use-promise/UserProfile.tsx" />
        </Step>
        <Step n={3} title="Suspense ed ErrorBoundary attorno">
          <Prose>
            <p>
              <code>{'<Suspense fallback>'}</code> mostra il fallback mentre un figlio è sospeso.{' '}
              <code>ErrorBoundary</code>, un componente riutilizzabile in <code>src/shared/ui/</code>, mostra l'errore se
              la promise viene rifiutata, e con <code>resetKeys</code> riprova quando cambia l'utente. #999 produce un
              404.
            </p>
          </Prose>
          <CodeBlock code={usePromiseDemoSrc} filename="use-promise/UsePromiseDemo.tsx" />
        </Step>
        <Example title="use(promise) con Suspense ed Error Boundary" code={usePromiseDemoSrc} file={`${DIR}/use-promise/UsePromiseDemo.tsx`}>
          <UsePromiseDemo />
        </Example>
        <Prose>
          <h3>use con un context</h3>
          <p>
            <code>use(MyContext)</code> fa la stessa cosa di <code>useContext</code>, ma si può chiamare in modo
            condizionale. Il progetto lo usa in <code>createStrictContext</code> (pagina{' '}
            <Link to="/context">Context</Link>).
          </p>
        </Prose>
        <CodeCompare
          bad={`function Price({ amount, showCurrency }) {
  // ✗ useContext cannot be called conditionally
  if (!showCurrency) return <>{amount}</>
  const { currency } = useContext(SettingsContext)
  return <>{amount} {currency}</>
}`}
          good={`function Price({ amount, showCurrency }) {
  if (!showCurrency) return <>{amount}</>
  // ✓ use can be called after an early return
  const { currency } = use(SettingsContext)
  return <>{amount} {currency}</>
}`}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="use-action-state" title="useActionState e useFormStatus">
        <Prose>
          <p>
            In React 19 un <code>{'<form>'}</code> può ricevere una <strong>funzione</strong> in <code>action</code>: React
            la chiama con il <code>FormData</code> all'invio. Non serve <code>onSubmit</code> né{' '}
            <code>preventDefault</code>, e non serve <code>useState</code> per ogni campo, perché gli input sono non
            controllati. <code>useActionState</code> aggiunge lo <strong>stato del risultato</strong> (errori, messaggio di
            successo) e <code>isPending</code>; <code>useFormStatus</code> permette a un componente figlio di sapere se il
            form è in invio.
          </p>
        </Prose>
        <Step n={1} title="L'action: stato precedente + FormData → nuovo stato">
          <Prose>
            <p>
              Una funzione normale, anche async, in un file a parte e quindi testabile senza React. Qui valida l'email con
              Zod e la invia a JSONPlaceholder. Gli indirizzi <code>@example.com</code> simulano un rifiuto del server.
            </p>
          </Prose>
          <CodeBlock code={subscribeActionSrc} language="ts" filename="newsletter/subscribeAction.ts" />
        </Step>
        <Step n={2} title="Un pulsante che sa se il form sta inviando">
          <Prose>
            <p>
              <code>useFormStatus()</code>, da <code>react-dom</code>, legge lo stato del <code>{'<form>'}</code>{' '}
              <strong>genitore</strong>. Per questo va usato in un componente figlio del form, e non nello stesso
              componente che lo renderizza.
            </p>
          </Prose>
          <CodeBlock code={submitButtonSrc} filename="newsletter/SubmitButton.tsx" />
        </Step>
        <Step n={3} title="Il form con useActionState">
          <CodeBlock code={newsletterFormSrc} filename="newsletter/NewsletterForm.tsx" />
        </Step>
        <Example title="Iscrizione alla newsletter con form action" code={newsletterFormSrc} file={`${DIR}/action-state/NewsletterForm.tsx`}>
          <NewsletterForm />
        </Example>
        <Callout variant="note" title="Il form si svuota dopo l'action">
          <p>
            Dopo un'action, React resetta i campi non controllati del form. Per non far perdere all'utente quello che ha
            scritto quando c'è un errore, l'action restituisce il valore nello stato e il campo lo rimette con{' '}
            <code>defaultValue</code>.
          </p>
        </Callout>
        <Table
          head={['', 'Form action + `useActionState`', 'React Hook Form + Zod']}
          rows={[
            ['Ideale per', 'Form semplici, invio al server, progressive enhancement', 'Form complessi e interattivi'],
            ['Validazione', 'All’invio, nell’action', 'Per campo, mentre si compila'],
            ['Stato dei campi', 'Nel DOM (`FormData`)', 'Nel form (`register`)'],
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="use-optimistic" title="useOptimistic">
        <Prose>
          <p>
            <code>useOptimistic(stato, aggiorna)</code> restituisce una versione dello stato a cui puoi aggiungere
            modifiche <strong>provvisorie</strong> durante un'action. Le modifiche spariscono quando l'action termina: se è
            andata bene, nel frattempo hai aggiornato lo stato vero, che le sostituisce; se è fallita, spariscono e basta.
            Il rollback è automatico.
          </p>
        </Prose>
        <CodeBlock
          code={`const [optimisticMessages, addOptimistic] = useOptimistic(messages, (current, newMessage) => [
  ...current,
  { ...newMessage, sending: true },
])

async function sendAction(formData: FormData) {
  addOptimistic({ id: crypto.randomUUID(), text: formData.get('text') }) // shown at once
  const saved = await send(formData)                                     // slow server
  startTransition(() => setMessages((prev) => [...prev, saved]))          // the real state
}`}
        />
        <Example title="Messaggi con invio ottimistico" code={messageThreadSrc} file={`${DIR}/optimistic/MessageThread.tsx`}>
          <MessageThread />
        </Example>
        <Callout variant="tip" title="useOptimistic o TanStack Query?">
          <p>
            Con i dati gestiti da TanStack Query, l'aggiornamento ottimistico si fa nella mutation (<code>onMutate</code>{' '}
            / <code>onError</code>, pagina <Link to="/data-fetching#ottimistici">Data fetching</Link>).{' '}
            <code>useOptimistic</code> è perfetto per lo stato locale e le form action.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="use-effect-event" title="useEffectEvent">
        <Prose>
          <p>
            A volte un effetto deve leggere un valore (un'impostazione, una prop) <strong>senza</strong> ripartire quando
            quel valore cambia. Metterlo nelle dipendenze riconnette o riavvia tutto; toglierlo fa leggere al codice un
            valore vecchio. <code>useEffectEvent</code> (stabile da React 19.2) crea una funzione che legge sempre i valori
            più recenti ma <strong>non è reattiva</strong>: si chiama dentro l'effetto e non va nelle dipendenze.
          </p>
        </Prose>
        <CodeBlock
          code={`const onMessage = useEffectEvent((text: string) => {
  notify(text, { muted }) // always the latest \`muted\`
})

useEffect(() => {
  const connection = connect(roomId)
  connection.on('message', onMessage)
  return () => connection.close()
}, [roomId]) // reconnect only when the room changes, not when \`muted\` changes`}
        />
        <Example title="Silenziare senza riconnettersi" code={notificationsDemoSrc} file={`${DIR}/effect-event/NotificationsDemo.tsx`}>
          <NotificationsDemo />
        </Example>
        <Prose>
          <p>
            Il progetto lo usa in due hook riutilizzabili: <code>useEventListener</code> e <code>useInterval</code>. La
            callback può cambiare a ogni render, ma il listener o il timer non vengono ricreati.
          </p>
        </Prose>
        <CodeBlock code={useIntervalSrc} language="ts" filename="src/shared/hooks/useInterval.ts" />
        <Callout variant="warning">
          <p>
            Una funzione creata con <code>useEffectEvent</code> si chiama <strong>solo dagli effetti</strong>: non passarla
            ad altri componenti e non chiamarla durante il render. Non è un modo per &quot;zittire&quot; il linter sulle
            dipendenze: serve per la logica che reagisce a un evento, non a un cambiamento.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="altri" title="Altri hook, in breve">
        <Table
          head={['Hook', 'A cosa serve', 'Dove lo trovi']}
          rows={[
            ['`useSyncExternalStore`', 'Leggere uno stato che vive fuori da React (eventi del browser, store esterni)', '`useOnlineStatus`, `useMediaQuery` (Custom hook)'],
            ['`useImperativeHandle`', 'Esporre a un `ref` solo alcuni metodi (es. `focus()`, `scrollToBottom()`)', 'Pagina Pattern'],
            ['`useDebugValue`', 'Etichetta per un custom hook nei React DevTools', '`useDebugValue(isOnline ? "Online" : "Offline")`'],
            ['`useInsertionEffect`', 'Iniettare stili prima del layout: solo per librerie CSS-in-JS', 'Non serve nel codice applicativo'],
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="test" title="Testare questi hook">
        <Prose>
          <ul>
            <li>
              Un componente che si <strong>sospende</strong> (<code>use</code>, <code>useSuspenseQuery</code>, lazy) va
              renderizzato dentro un <code>act</code> <strong>atteso</strong>:{' '}
              <code>{'await act(async () => { render(<App />) })'}</code>. Altrimenti React ignora la risoluzione della
              promise e il test aspetta per sempre.
            </li>
            <li>
              Per le form action e <code>useOptimistic</code> si controlla prima lo stato provvisorio (&quot;invio…&quot;,
              pulsante disabilitato), poi quello finale.
            </li>
          </ul>
        </Prose>
        <CodeBlock code={advancedHooksTestSrc} filename={`${DIR}/__tests__/advancedHooks.test.tsx`} />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="riepilogo" title="Riepilogo">
        <Table
          head={['Hook', 'Uso tipico']}
          rows={[
            ['`useId()`', '`<label htmlFor={id}>` + `<input id={id}>`'],
            ['`useTransition()`', '`startTransition(() => setTab(next))`, anche async'],
            ['`useDeferredValue(value)`', 'Rimandare una parte lenta (con `memo`) che dipende da un input'],
            ['`useLayoutEffect(fn, deps)`', 'Misurare il DOM e correggere prima del disegno'],
            ['`use(promise)` / `use(context)`', 'Dati con Suspense / context anche condizionale'],
            ['`useActionState(action, initial)`', '`<form action={formAction}>` con stato del risultato'],
            ['`useFormStatus()`', '`pending` del form genitore, nei pulsanti di invio'],
            ['`useOptimistic(state, update)`', 'Modifiche provvisorie durante un’action'],
            ['`useEffectEvent(fn)`', 'Valori più recenti in un effetto, senza dipendenze'],
          ]}
        />
      </Section>
    </Page>
  )
}
