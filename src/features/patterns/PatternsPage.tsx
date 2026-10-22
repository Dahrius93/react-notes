import { Link } from 'react-router'
import { Callout } from '@/docs/Callout'
import { CodeBlock, CodeCompare } from '@/docs/CodeBlock'
import { Example } from '@/docs/Example'
import { Page } from '@/docs/Page'
import { Prose, Section } from '@/docs/Section'
import { Step } from '@/docs/Step'
import { Table } from '@/docs/Table'
import errorBoundarySrc from '@/shared/ui/ErrorBoundary.tsx?raw'
import listSrc from '@/shared/ui/List.tsx?raw'
import modalSrc from '@/shared/ui/Modal.tsx?raw'
import tabsSrc from '@/shared/ui/Tabs.tsx?raw'
import patternsTestSrc from './examples/__tests__/patterns.test.tsx?raw'
import { ActivityDemo } from './examples/activity/ActivityDemo'
import activityDemoSrc from './examples/activity/ActivityDemo.tsx?raw'
import buggyCounterSrc from './examples/basic/BuggyCounter.tsx?raw'
import { ErrorBoundaryDemo } from './examples/basic/ErrorBoundaryDemo'
import errorBoundaryDemoSrc from './examples/basic/ErrorBoundaryDemo.tsx?raw'
import { ProductTabs } from './examples/compound/ProductTabs'
import productTabsSrc from './examples/compound/ProductTabs.tsx?raw'
import { GenericsDemo } from './examples/generics/GenericsDemo'
import genericsDemoSrc from './examples/generics/GenericsDemo.tsx?raw'
import itemPickerSrc from './examples/generics/ItemPicker.tsx?raw'
import { LazyChartDemo } from './examples/lazy/LazyChartDemo'
import lazyChartDemoSrc from './examples/lazy/LazyChartDemo.tsx?raw'
import { PortalDemo } from './examples/portal/PortalDemo'
import portalDemoSrc from './examples/portal/PortalDemo.tsx?raw'
import { RefDemo } from './examples/ref/RefDemo'
import refDemoSrc from './examples/ref/RefDemo.tsx?raw'
import searchBoxSrc from './examples/ref/SearchBox.tsx?raw'
import panelSrc from './examples/slots/Panel.tsx?raw'
import { SlotsDemo } from './examples/slots/SlotsDemo'
import slotsDemoSrc from './examples/slots/SlotsDemo.tsx?raw'
import { SuspenseBoundaries } from './examples/suspense/SuspenseBoundaries'
import suspenseBoundariesSrc from './examples/suspense/SuspenseBoundaries.tsx?raw'
import { ViewTransitionDemo } from './examples/view-transition/ViewTransitionDemo'
import viewTransitionDemoSrc from './examples/view-transition/ViewTransitionDemo.tsx?raw'

const DIR = 'src/features/patterns/examples'

export default function PatternsPage() {
  return (
    <Page
      title="Pattern"
      lead="Soluzioni ricorrenti per costruire componenti robusti e riutilizzabili: gestire errori e caricamenti, caricare codice su richiesta, uscire dal DOM del genitore, dividere un componente in parti, tipizzarlo in modo generico."
    >
      {/* ------------------------------------------------------------------ */}
      <Section id="primo-esempio" title="Primo esempio: Error Boundary passo per passo">
        <Prose>
          <p>
            Per default, se un componente lancia un errore durante il render, React smonta <strong>tutta l'app</strong>{' '}
            e la pagina resta bianca. Un <strong>Error Boundary</strong> è un componente che cattura gli errori dei suoi
            figli e mostra un'interfaccia di riserva al loro posto, così un widget rotto non porta giù il resto.
          </p>
        </Prose>
        <CodeBlock
          language="bash"
          filename="struttura"
          code={`src/shared/ui/ErrorBoundary.tsx  # 1. the boundary (reusable, written once)
widgets/BuggyCounter.tsx         # 2. a component that can crash
widgets/Dashboard.tsx            # 3. boundaries around the risky parts`}
        />
        <Step n={1} title="Il componente ErrorBoundary">
          <Prose>
            <p>
              È l'unico caso in cui oggi serve ancora una <strong>classe</strong>: non esiste un hook equivalente a{' '}
              <code>getDerivedStateFromError</code>. Lo si scrive una volta, o si usa la libreria{' '}
              <code>react-error-boundary</code>. Questo accetta un <code>fallback</code> (anche come funzione, con{' '}
              <code>error</code> e <code>reset</code>), dei <code>resetKeys</code> per riprovare quando cambia qualcosa, e
              un <code>onError</code> per mandare l'errore a un servizio di monitoraggio.
            </p>
          </Prose>
          <CodeBlock code={errorBoundarySrc} filename="src/shared/ui/ErrorBoundary.tsx" />
        </Step>
        <Step n={2} title="Un componente che si rompe">
          <CodeBlock code={buggyCounterSrc} filename="widgets/BuggyCounter.tsx" />
        </Step>
        <Step n={3} title="Avvolgi le parti a rischio">
          <Prose>
            <p>
              Ogni widget ha il suo boundary: se uno si rompe, l'altro continua a funzionare. &quot;Riprova&quot; chiama{' '}
              <code>reset</code> e rimonta il contenuto da zero.
            </p>
          </Prose>
          <CodeBlock code={errorBoundaryDemoSrc} filename="widgets/Dashboard.tsx" />
        </Step>
        <Example title="Due widget, due Error Boundary" code={errorBoundaryDemoSrc} file={`${DIR}/basic/ErrorBoundaryDemo.tsx`}>
          <ErrorBoundaryDemo />
        </Example>
        <Callout variant="warning" title="Cosa NON catturano">
          <p>
            Solo gli errori lanciati <strong>durante il render</strong> (e nei metodi del ciclo di vita) dei figli. Restano
            fuori: errori negli <strong>event handler</strong>, nel codice <strong>asincrono</strong> (
            <code>setTimeout</code>, promise non lette con <code>use</code>) e nel boundary stesso. Per quelli usa{' '}
            <code>try/catch</code> e uno stato d'errore.
          </p>
        </Callout>
        <CodeCompare
          bad={`<button onClick={() => {
  // Not caught by any Error Boundary:
  // the app keeps running, the error is lost
  JSON.parse(badInput)
}}>`}
          good={`const [error, setError] = useState<Error | null>(null)

<button onClick={() => {
  try { JSON.parse(badInput) }
  catch (e) { setError(e as Error) } // show it
}}>`}
        />
        <Prose>
          <p>
            Dove metterli: uno attorno all'intera app (l'ultima rete di sicurezza, qui è l'<code>ErrorBoundary</code> del
            router), poi attorno alle parti indipendenti, come widget, pannelli o pagine. Per gli errori non catturati da
            nessun boundary, React 19 offre <code>onUncaughtError</code> e <code>onCaughtError</code> in{' '}
            <code>createRoot(el, {'{ ... }'})</code>, utili per il logging.
          </p>
        </Prose>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="suspense" title="Suspense">
        <Prose>
          <p>
            <code>{'<Suspense fallback={...}>'}</code> è il gemello dell'Error Boundary per il <strong>caricamento</strong>:
            se un figlio &quot;si sospende&quot;, mostra il <code>fallback</code> finché non è pronto. Si sospendono:
          </p>
          <ul>
            <li>
              i componenti caricati con <code>React.lazy</code> (sezione successiva);
            </li>
            <li>
              <code>use(promise)</code> (pagina <Link to="/advanced-hooks#use">Hook avanzati</Link>);
            </li>
            <li>
              <code>useSuspenseQuery</code> di TanStack Query.
            </li>
          </ul>
          <p>
            <strong>Dove</strong> metti i boundary decide l'esperienza: uno solo attorno a tutto aspetta la parte più lenta;
            boundary separati mostrano ogni parte appena è pronta. Prova le due modalità e &quot;Ricarica&quot;:
          </p>
        </Prose>
        <Example title="Un boundary o due?" code={suspenseBoundariesSrc} file={`${DIR}/suspense/SuspenseBoundaries.tsx`}>
          <SuspenseBoundaries />
        </Example>
        <Callout variant="tip" title="Niente lampi di fallback">
          <p>
            Se un aggiornamento in una <code>startTransition</code> fa sospendere un componente già visibile, React{' '}
            <strong>non</strong> torna al fallback: tiene il contenuto vecchio finché quello nuovo è pronto. È il motivo per
            cui il router, che naviga con le transition, non mostra spinner tra una pagina e l'altra.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="lazy" title="Lazy loading dei componenti">
        <Prose>
          <p>
            <code>React.lazy(() =&gt; import(&apos;./Componente&apos;))</code> divide il codice: il componente diventa un
            file JavaScript separato, scaricato solo la prima volta che serve. È utile per parti pesanti e non sempre
            usate (grafici, editor, mappe, pannelli di amministrazione). Va sempre dentro un <code>{'<Suspense>'}</code>.
          </p>
        </Prose>
        <CodeBlock
          code={`// default export
const SalesChart = lazy(() => import('./SalesChart'))

// named export: lazy wants { default: Component }
const Editor = lazy(() => import('./Editor').then((module) => ({ default: module.Editor })))

<Suspense fallback={<Spinner />}>
  <SalesChart />
</Suspense>`}
        />
        <Example title="Grafico caricato su richiesta" code={lazyChartDemoSrc} file={`${DIR}/lazy/LazyChartDemo.tsx`}>
          <LazyChartDemo />
        </Example>
        <Prose>
          <p>
            Il pulsante avvia il download già al passaggio del mouse (<strong>preload</strong>), così spesso al clic il
            codice è già arrivato. Il primo caricamento è rallentato apposta di un secondo. Per le pagine intere, con
            React Router si usa la proprietà <code>lazy</code> delle route (pagina{' '}
            <Link to="/routing#lazy">React Router</Link>), che è ciò che fanno queste note.
          </p>
        </Prose>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="portali" title="Portali">
        <Prose>
          <p>
            <code>createPortal(jsx, nodoDom)</code> renderizza un componente in un altro punto del DOM, di solito in{' '}
            <code>{'<body>'}</code>, pur restando suo figlio per React: riceve props e context, e i suoi eventi risalgono
            l'<strong>albero React</strong>, non quello del DOM. Serve per tutto ciò che deve stare sopra la pagina e non
            deve essere tagliato da un genitore con <code>overflow: hidden</code>, <code>transform</code> o{' '}
            <code>z-index</code>: modali, tooltip, menu, notifiche.
          </p>
        </Prose>
        <Example title="Senza portale vs con portale" code={portalDemoSrc} file={`${DIR}/portal/PortalDemo.tsx`}>
          <PortalDemo />
        </Example>
        <Prose>
          <p>
            <code>Modal</code> è un componente riutilizzabile di <code>src/shared/ui/</code>. Oltre al portale gestisce
            l'accessibilità: <code>role=&quot;dialog&quot;</code> e <code>aria-modal</code>, il titolo collegato con{' '}
            <code>aria-labelledby</code>, il focus portato dentro e restituito alla chiusura, Esc, clic sullo sfondo, scroll
            della pagina bloccato e il resto dell'app <code>inert</code>, così Tab non esce dalla modale.
          </p>
        </Prose>
        <CodeBlock code={modalSrc} filename="src/shared/ui/Modal.tsx" />
        <Callout variant="note" title="E l'elemento <dialog>?">
          <p>
            Il <code>{'<dialog>'}</code> nativo con <code>showModal()</code> offre già top layer, focus trap ed Esc senza
            portale. È un'ottima alternativa; il portale resta utile per tooltip, menu e notifiche, e quando serve
            controllo completo su animazioni e stili.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="compound" title="Compound component">
        <Prose>
          <p>
            Un <strong>compound component</strong> è un componente diviso in parti che funzionano insieme, come{' '}
            <code>{'<select>'}</code> e <code>{'<option>'}</code> in HTML. Il componente radice tiene lo stato e lo
            condivide con le parti tramite un <strong>context privato</strong>. Chi lo usa compone il markup come vuole,
            invece di passare un grande oggetto di configurazione.
          </p>
        </Prose>
        <CodeCompare
          bad={`// Config props: every new need = a new prop
<Tabs
  items={[
    { label: 'Dettagli', content: <Details /> },
    { label: 'Recensioni', content: <Reviews />,
      badge: 12, badgeTone: 'info' },
  ]}
  tabClassName="..."
  renderTabLabel={(item) => ...}
/>`}
          good={`// Compound: the caller composes the parts
<Tabs.Root defaultValue="details">
  <Tabs.List label="Prodotto">
    <Tabs.Trigger value="details">Dettagli</Tabs.Trigger>
    <Tabs.Trigger value="reviews">
      Recensioni <Badge>12</Badge>
    </Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value="details"><Details /></Tabs.Panel>
  <Tabs.Panel value="reviews"><Reviews /></Tabs.Panel>
</Tabs.Root>`}
        />
        <Example title="Tab non controllate e controllate" code={productTabsSrc} file={`${DIR}/compound/ProductTabs.tsx`}>
          <ProductTabs />
        </Example>
        <Prose>
          <p>Cose da notare in <code>src/shared/ui/Tabs.tsx</code>:</p>
          <ul>
            <li>
              <strong>controllato o non controllato</strong>: con <code>defaultValue</code> lo stato è interno, con{' '}
              <code>value</code> + <code>onValueChange</code> lo decide il padre, ad esempio per sincronizzarlo con l'URL;
            </li>
            <li>
              <strong>accessibilità</strong>: ruoli <code>tablist</code> / <code>tab</code> / <code>tabpanel</code>, id
              collegati con <code>useId</code>, frecce ← → per spostarsi, solo la tab attiva raggiungibile con Tab;
            </li>
            <li>
              <strong>esportazione a namespace</strong>: il file esporta <code>Root</code>, <code>List</code>,{' '}
              <code>Trigger</code> e <code>Panel</code>, e si importa con <code>import * as Tabs</code>, come fa Radix UI.
              L'alternativa <code>Object.assign(Tabs, {'{ List, ... }'})</code> funziona, ma il linter non la riconosce come
              componente e il Fast Refresh si rompe.
            </li>
          </ul>
        </Prose>
        <CodeBlock code={tabsSrc} filename="src/shared/ui/Tabs.tsx" />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="generici" title="Componenti generici">
        <Prose>
          <p>
            Un componente può avere un <strong>parametro di tipo</strong>, come una funzione generica.{' '}
            <code>{'List<T>'}</code> non sa cosa contiene: <code>T</code> viene dedotto da <code>items</code>, e{' '}
            <code>renderItem</code> e <code>getKey</code> ricevono l'elemento con il suo tipo reale, senza{' '}
            <code>any</code> né cast. Lo stesso componente funziona con utenti, post o qualsiasi altra cosa.
          </p>
        </Prose>
        <CodeBlock
          code={`type ListProps<T> = {
  items: readonly T[]
  getKey: (item: T) => Key
  renderItem: (item: T, index: number) => ReactNode
}

export function List<T>({ items, getKey, renderItem }: ListProps<T>) { ... }

<List items={users} getKey={(u) => u.id} renderItem={(u) => u.name} />  // u: User
<List items={posts} getKey={(p) => p.id} renderItem={(p) => p.title} /> // p: Post`}
        />
        <Example title="List<T> e ItemPicker<T> con dati veri" code={genericsDemoSrc} file={`${DIR}/generics/GenericsDemo.tsx`}>
          <GenericsDemo />
        </Example>
        <div className="grid gap-4 xl:grid-cols-2">
          <CodeBlock code={listSrc} filename="src/shared/ui/List.tsx" />
          <CodeBlock code={itemPickerSrc} filename={`${DIR}/generics/ItemPicker.tsx`} />
        </div>
        <Callout variant="note" title="Generici nei file .tsx">
          <p>
            Con le <code>function</code> la sintassi è quella normale: <code>{'function List<T>(...)'}</code>. Con una arrow
            function in un file <code>.tsx</code>, <code>{'<T>'}</code> verrebbe letto come un tag JSX: si scrive{' '}
            <code>{'<T,>(props) => ...'}</code>, con la virgola.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="ref" title="ref come prop e useImperativeHandle">
        <Prose>
          <p>
            In React 19 <code>ref</code> è una <strong>prop normale</strong> dei componenti funzione: per passarlo a un
            elemento interno non serve più <code>forwardRef</code>, che diventerà deprecato. Tutti i campi di{' '}
            <code>src/shared/ui/</code> funzionano così, ed è per questo che <code>register()</code> di React Hook Form li
            collega senza problemi.
          </p>
        </Prose>
        <CodeCompare
          bad={`// React 18
const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(props, ref) {
    return <input ref={ref} {...props} />
  },
)`}
          good={`// React 19
function Input({ ref, ...props }: InputProps) {
  return <input ref={ref} {...props} />
}
// ComponentProps<'input'> already includes \`ref\``}
        />
        <Prose>
          <h3>Esporre solo alcuni metodi</h3>
          <p>
            A volte il padre deve comandare il figlio: dargli il focus, svuotarlo, far scorrere una lista in fondo. Invece
            di esporre l'intero nodo DOM, con <code>useImperativeHandle</code> il figlio decide cosa ricevere nel ref: qui
            solo <code>focus()</code> e <code>clear()</code>. Premi <code>/</code> ovunque nella pagina per dare il focus al
            campo.
          </p>
        </Prose>
        <Example title="Un campo di ricerca comandato dal padre" code={refDemoSrc} file={`${DIR}/ref/RefDemo.tsx`}>
          <RefDemo />
        </Example>
        <CodeBlock code={searchBoxSrc} filename={`${DIR}/ref/SearchBox.tsx`} />
        <Callout variant="tip" title="Ref callback con cleanup (React 19)">
          <p>
            Un ref può essere anche una funzione, chiamata con il nodo quando appare. In React 19 può restituire una
            funzione di <strong>cleanup</strong>, chiamata quando il nodo sparisce:{' '}
            <code>{'<div ref={(node) => { const obs = observe(node); return () => obs.disconnect() }} />'}</code>.
          </p>
        </Callout>
        <Callout variant="warning">
          <p>
            Usa i ref imperativi con moderazione: se qualcosa si può esprimere con le props (<code>isOpen</code>,{' '}
            <code>value</code>), è meglio. I ref servono per azioni puntuali che non sono stato: focus, scroll, play/pause.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="slot" title="Slot, children e render props">
        <Prose>
          <p>
            Una prop non deve per forza essere un dato: può essere <strong>JSX</strong>. <code>children</code> è lo slot
            principale; altri slot con nome (<code>actions</code>, <code>footer</code>, <code>icon</code>) permettono a chi
            usa il componente di decidere <strong>cosa</strong> mettere, mentre il componente decide <strong>dove</strong>.
            È più flessibile di una prop per ogni variante (<code>showExportButton</code>, <code>footerText</code>...).
          </p>
        </Prose>
        <Example title="Un pannello con slot" code={slotsDemoSrc} file={`${DIR}/slots/SlotsDemo.tsx`}>
          <SlotsDemo />
        </Example>
        <CodeBlock code={panelSrc} filename={`${DIR}/slots/Panel.tsx`} />
        <Prose>
          <h3>Render props</h3>
          <p>
            Una <strong>render prop</strong> è una prop-funzione che restituisce JSX: il componente la chiama passandole dei
            dati. <code>renderItem</code> di <code>List</code> ne è un esempio, ed è ancora il modo giusto per far decidere
            al chiamante <em>come</em> disegnare qualcosa. Prima degli hook si usava anche per condividere{' '}
            <em>logica</em>; oggi per quello c'è un custom hook.
          </p>
        </Prose>
        <CodeCompare
          bad={`// Render prop to share logic (pre-hooks)
<MousePosition
  render={({ x, y }) => <Cursor x={x} y={y} />}
/>`}
          good={`// Custom hook: same logic, plain JSX
const { x, y } = useMousePosition()
return <Cursor x={x} y={y} />`}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="activity" title="<Activity>: nascondere senza perdere lo stato">
        <Prose>
          <p>
            Con il rendering condizionale (<code>{'{tab === "a" && <A />}'}</code>), ciò che si nasconde viene{' '}
            <strong>smontato</strong> e il suo stato si perde. <code>{'<Activity mode="hidden">'}</code>, stabile da React
            19.2, invece lo nasconde e basta: conserva stato e DOM, mette in pausa gli effetti (fa il loro cleanup) e li
            riavvia quando torna <code>visible</code>. Utile per tab, pannelli laterali e passaggi di un wizard.
          </p>
          <p>
            Scrivi una bozza, passa al cronometro e torna indietro: con <code>Activity</code> il testo c'è ancora, e il
            cronometro si ferma mentre è nascosto. Togli la spunta per vedere la differenza.
          </p>
        </Prose>
        <Example title="Tab che ricordano lo stato" code={activityDemoSrc} file={`${DIR}/activity/ActivityDemo.tsx`}>
          <ActivityDemo />
        </Example>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="view-transition" title="<ViewTransition>: animare i cambi di interfaccia">
        <Prose>
          <p>
            <code>{'<ViewTransition>'}</code> (React 19.3) collega React alla View Transitions API del browser: quando il
            contenuto cambia, il browser fotografa lo stato vecchio e quello nuovo e li anima, con una dissolvenza come
            impostazione predefinita. L'animazione parte solo per gli aggiornamenti <strong>non urgenti</strong>:{' '}
            <code>startTransition</code>, <code>useDeferredValue</code>, Actions, e il passaggio da fallback a contenuto di
            Suspense. Negli aggiornamenti normali il cambio è immediato.
          </p>
        </Prose>
        <Example title="Dissolvenza tra slide" code={viewTransitionDemoSrc} file={`${DIR}/view-transition/ViewTransitionDemo.tsx`}>
          <ViewTransitionDemo />
        </Example>
        <Prose>
          <p>L'animazione si personalizza in CSS, assegnando una classe:</p>
        </Prose>
        <CodeBlock
          language="css"
          code={`/* <ViewTransition default="slide"> */
::view-transition-old(.slide) { animation: 200ms ease-out both slide-out; }
::view-transition-new(.slide) { animation: 200ms ease-out both slide-in; }`}
        />
        <Callout variant="note">
          <p>
            Nei browser senza View Transitions API il contenuto cambia senza animazione, quindi si può adottare senza
            rischi. React Router v8 ha deprecato le sue API di view transition proprio a favore di questo componente.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="storici" title="Pattern storici, e cosa si usa oggi">
        <Prose>
          <p>Li trovi ancora in codice esistente e in vecchie guide, quindi è bene riconoscerli:</p>
        </Prose>
        <Table
          head={['Pattern', 'Cos’era', 'Oggi']}
          rows={[
            ['Higher-Order Component', '`withAuth(Component)`: una funzione che avvolge un componente e aggiunge props', 'Custom hook (`useAuth()`) o un componente guardia come `RequireAuth`'],
            ['Render props per la logica', '`<Mouse render={(pos) => ...} />`', 'Custom hook'],
            ['Class component', '`class X extends Component` con `setState` e lifecycle', 'Componenti funzione + hook (eccetto gli Error Boundary)'],
            ['`forwardRef`', 'Necessario per passare un ref a un componente', '`ref` come prop (React 19)'],
            ['`<Context.Provider>`', 'Il provider di un context', '`<Context value>` (React 19)'],
            ['`defaultProps` sui componenti funzione', 'Valori di default delle props', 'Default nella destrutturazione: `({ size = "md" })`'],
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="test" title="Testare i pattern">
        <Prose>
          <ul>
            <li>
              Gli Error Boundary registrano l'errore in console: nei test si silenzia con{' '}
              <code>{"vi.spyOn(console, 'error')"}</code>.
            </li>
            <li>
              Per <code>React.lazy</code> e Suspense, l'interazione che provoca la sospensione va avvolta in un{' '}
              <code>act</code> atteso.
            </li>
            <li>
              I portali si cercano in tutto il documento: <code>screen</code> lo fa già, perché parte da{' '}
              <code>document.body</code>.
            </li>
          </ul>
        </Prose>
        <CodeBlock code={patternsTestSrc} filename={`${DIR}/__tests__/patterns.test.tsx`} />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="riepilogo" title="Riepilogo">
        <Table
          head={['Pattern', 'Quando usarlo', 'Nel progetto']}
          rows={[
            ['Error Boundary', 'Isolare i crash di parti indipendenti', '`shared/ui/ErrorBoundary.tsx`'],
            ['Suspense', 'Mostrare un fallback mentre qualcosa carica', 'Con `lazy`, `use`, `useSuspenseQuery`'],
            ['`React.lazy`', 'Codice pesante usato solo a volte', 'Route `lazy` per le pagine'],
            ['Portale', 'Modali, tooltip, menu sopra la pagina', '`shared/ui/Modal.tsx`'],
            ['Compound component', 'Componenti in più parti componibili', '`shared/ui/Tabs.tsx`'],
            ['Componente generico', 'Stesso componente, tipi diversi', '`shared/ui/List.tsx`'],
            ['`ref` come prop + `useImperativeHandle`', 'Azioni imperative puntuali (focus, scroll)', 'Tutti i campi di `shared/ui`'],
            ['Slot / render props', 'Far decidere al chiamante cosa e come renderizzare', '`Panel`, `List.renderItem`'],
            ['`<Activity>`', 'Nascondere senza perdere lo stato', 'Tab, wizard, pannelli'],
            ['`<ViewTransition>`', 'Animare i cambi non urgenti', 'Con `startTransition`'],
          ]}
        />
      </Section>
    </Page>
  )
}
