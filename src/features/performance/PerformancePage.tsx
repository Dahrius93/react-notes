import { Link } from 'react-router'
import { Callout } from '@/docs/Callout'
import { CodeBlock, CodeCompare } from '@/docs/CodeBlock'
import { Example } from '@/docs/Example'
import { Page } from '@/docs/Page'
import { Prose, Section } from '@/docs/Section'
import { Table } from '@/docs/Table'
import { CallbackDemo } from './examples/CallbackDemo'
import callbackDemoSrc from './examples/CallbackDemo.tsx?raw'
import { ChildrenAsProps } from './examples/ChildrenAsProps'
import childrenAsPropsSrc from './examples/ChildrenAsProps.tsx?raw'
import { ExpensiveCalculation } from './examples/ExpensiveCalculation'
import expensiveCalculationSrc from './examples/ExpensiveCalculation.tsx?raw'
import { KeysDemo } from './examples/KeysDemo'
import keysDemoSrc from './examples/KeysDemo.tsx?raw'
import { MemoDemo } from './examples/MemoDemo'
import memoDemoSrc from './examples/MemoDemo.tsx?raw'
import { RenderReasons } from './examples/RenderReasons'
import renderReasonsSrc from './examples/RenderReasons.tsx?raw'
import { StateMovedDown } from './examples/StateMovedDown'
import stateMovedDownSrc from './examples/StateMovedDown.tsx?raw'
import { StateTooHigh } from './examples/StateTooHigh'
import stateTooHighSrc from './examples/StateTooHigh.tsx?raw'

const DIR = 'src/features/performance/examples'

export default function PerformancePage() {
  return (
    <Page
      title="Performance"
      lead="Capire quando un componente si ri-renderizza, e le tecniche per evitarlo quando costa: prima la struttura (spostare lo stato, children), poi memo, useMemo e useCallback."
    >
      <Callout variant="note" title="Come leggere le demo">
        <p>
          Ogni riquadro con l'etichetta in alto <strong>lampeggia di rosso</strong> quando il componente si
          ri-renderizza e mostra quanti render ha fatto. È il componente <code>RenderTracker</code> di{' '}
          <code>src/docs/</code>. In sviluppo React esegue ogni render due volte (<code>StrictMode</code>), quindi i
          componenti lenti sono ancora più lenti che in produzione.
        </p>
      </Callout>

      {/* ------------------------------------------------------------------ */}
      <Section id="quando-renderizza" title="Quando un componente si ri-renderizza">
        <Prose>
          <p>Un componente si ri-renderizza per tre motivi, e solo per questi:</p>
          <ol>
            <li>
              cambia il suo <strong>stato</strong> (<code>useState</code>, <code>useReducer</code>);
            </li>
            <li>
              cambia un <strong>context</strong> che legge;
            </li>
            <li>
              si ri-renderizza il <strong>componente padre</strong>, anche se le props sono identiche.
            </li>
          </ol>
          <p>
            Il terzo punto sorprende spesso: &quot;cambiano le props&quot; <strong>non</strong> è il motivo. Il figlio si
            ri-renderizza perché il padre lo ri-crea nel suo JSX, e per default React non controlla se le props sono
            cambiate.
          </p>
        </Prose>
        <Example title="Il figlio senza props si ri-renderizza con il padre" code={renderReasonsSrc} file={`${DIR}/RenderReasons.tsx`}>
          <RenderReasons />
        </Example>
        <Callout variant="tip" title="Un render non è un problema di per sé">
          <p>
            Ri-renderizzare significa rieseguire la funzione del componente e confrontare il JSX: React tocca il DOM
            solo dove qualcosa è davvero cambiato. Per la maggior parte dei componenti costa pochissimo.{' '}
            <strong>Ottimizza solo quando misuri un problema</strong>: interfaccia che scatta, input in ritardo.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="spostare-stato" title="Spostare lo stato verso il basso">
        <Prose>
          <p>
            La prima tecnica non richiede nessuna API: <strong>tieni lo stato il più vicino possibile a chi lo
            usa</strong>. Qui sotto un campo di testo e un componente lento stanno nello stesso padre. Scrivi
            velocemente nel primo esempio: a ogni tasto si ri-renderizza anche <code>SlowPanel</code>, e il campo va a
            scatti.
          </p>
        </Prose>
        <Example title="✗ Stato troppo in alto" code={stateTooHighSrc} file={`${DIR}/StateTooHigh.tsx`}>
          <StateTooHigh />
        </Example>
        <Prose>
          <p>
            La soluzione è spostare il campo e il suo stato in un componente a sé. Il padre non ha più stato, quindi non
            si ri-renderizza, e <code>SlowPanel</code> nemmeno. Prova a scrivere: il campo è fluido e{' '}
            <code>SlowPanel</code> non lampeggia.
          </p>
        </Prose>
        <Example title="✓ Stato spostato nel componente che lo usa" code={stateMovedDownSrc} file={`${DIR}/StateMovedDown.tsx`}>
          <StateMovedDown />
        </Example>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="children" title="Passare il contenuto come children">
        <Prose>
          <p>
            A volte lo stato non si può spostare in basso, perché serve proprio al componente che contiene la parte
            costosa: un wrapper che segue il mouse, uno che gestisce lo scroll o un hover. In quel caso, invece di far
            renderizzare il contenuto al wrapper, <strong>passalo come <code>children</code></strong>.
          </p>
          <p>
            Gli elementi in <code>children</code> sono creati dal componente padre. Quando il wrapper cambia stato,{' '}
            <code>children</code> è lo stesso oggetto di prima, e React salta quel sottoalbero. Muovi il mouse sui due
            riquadri:
          </p>
        </Prose>
        <Example title="Stesso stato, struttura diversa" code={childrenAsPropsSrc} file={`${DIR}/ChildrenAsProps.tsx`}>
          <ChildrenAsProps />
        </Example>
        <Callout variant="note">
          <p>
            È lo stesso motivo per cui un provider di Context non ri-renderizza i suoi <code>children</code>: lo hai visto
            con <code>StaticHint</code> nella pagina <Link to="/context#store">Context</Link>.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="memo" title="memo">
        <Prose>
          <p>
            <code>memo(Component)</code> restituisce una versione del componente che <strong>salta il render</strong>{' '}
            se tutte le props sono uguali alle precedenti. Il confronto è superficiale, prop per prop, con{' '}
            <code>Object.is</code>:
          </p>
          <ul>
            <li>stringhe, numeri e booleani uguali sono uguali;</li>
            <li>
              oggetti, array e funzioni sono uguali <strong>solo se sono lo stesso riferimento</strong>.{' '}
              <code>{'{ a: 1 }'}</code> scritto in due render diversi produce due oggetti diversi.
            </li>
          </ul>
          <p>
            Clicca &quot;Render del padre&quot;: si ri-renderizzano il figlio senza <code>memo</code> e quello con lo{' '}
            <code>style</code> inline, perché riceve un oggetto nuovo a ogni render e <code>memo</code> non serve a
            nulla. &quot;Cambia grassetto&quot; cambia davvero lo stile, quindi lì si aggiornano entrambi i componenti
            con <code>style</code>.
          </p>
        </Prose>
        <Example title="memo e props per riferimento" code={memoDemoSrc} file={`${DIR}/MemoDemo.tsx`}>
          <MemoDemo />
        </Example>
        <Callout variant="warning">
          <p>
            <code>memo</code> ha un costo: a ogni render del padre React confronta tutte le props. Se il componente è
            economico o le props cambiano quasi sempre, il confronto è lavoro sprecato. Usalo su componenti{' '}
            <strong>costosi</strong> che ricevono <strong>spesso le stesse props</strong>.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="use-memo" title="useMemo">
        <Prose>
          <p>
            <code>useMemo(fn, deps)</code> esegue <code>fn</code> e ne ricorda il risultato finché le dipendenze non
            cambiano. Ha due usi:
          </p>
          <ol>
            <li>
              <strong>Evitare calcoli costosi</strong> a ogni render: filtri e ordinamenti di liste grandi, calcoli
              matematici, trasformazioni di dati.
            </li>
            <li>
              <strong>Mantenere lo stesso riferimento</strong> di un oggetto o di un array: per le props di un componente
              con <code>memo</code> (come sopra) o per le dipendenze di un effetto.
            </li>
          </ol>
          <p>
            Nella demo il calcolo dei numeri primi dura decine di millisecondi. Clicca &quot;Render non correlato&quot;:
            con <code>useMemo</code> l'orario di calcolo non cambia, perché il risultato è in cache; senza, il calcolo
            riparte a ogni clic e l'interfaccia rallenta.
          </p>
        </Prose>
        <Example title="Un calcolo costoso" code={expensiveCalculationSrc} file={`${DIR}/ExpensiveCalculation.tsx`}>
          <ExpensiveCalculation />
        </Example>
        <Callout variant="tip" title="Costa davvero?">
          <p>
            Prima di aggiungere <code>useMemo</code>, misura: <code>console.time(&apos;filter&apos;)</code> /{' '}
            <code>console.timeEnd(&apos;filter&apos;)</code> attorno al calcolo. Se resta sotto il millisecondo,{' '}
            <code>useMemo</code> aggiunge solo complessità. Filtrare 100 elementi non è costoso; filtrarne 50.000 sì.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="use-callback" title="useCallback">
        <Prose>
          <p>
            <code>useCallback(fn, deps)</code> restituisce la <strong>stessa funzione</strong> finché le dipendenze non
            cambiano. È l'equivalente di <code>{'useMemo(() => fn, deps)'}</code>. Da solo non rende niente più veloce:
            serve quando la funzione finisce in un posto che confronta i riferimenti, cioè le props di un componente con{' '}
            <code>memo</code> o le dipendenze di un effetto.
          </p>
          <p>
            Nella demo ogni riga è avvolta in <code>memo</code> e riceve <code>onToggle</code>. Togli la spunta da{' '}
            <code>useCallback</code> e clicca &quot;Render del padre&quot;: tutte le righe lampeggiano, perché ricevono
            una funzione nuova. Con <code>useCallback</code> non lampeggia nessuna, e spuntando una riga si aggiorna solo
            quella.
          </p>
        </Prose>
        <Example title="memo + useCallback su una lista" code={callbackDemoSrc} file={`${DIR}/CallbackDemo.tsx`}>
          <CallbackDemo />
        </Example>
        <CodeCompare
          bad={`// Pointless: <button> is not memoized,
// it re-renders anyway
const handleClick = useCallback(() => {
  setOpen(true)
}, [])

return <button onClick={handleClick}>Apri</button>`}
          good={`// Useful: Row is memo() and the function
// must keep its identity between renders
const handleToggle = useCallback((id: number) => {
  setItems((prev) => toggle(prev, id))
}, [])

return items.map((item) => (
  <Row key={item.id} item={item} onToggle={handleToggle} />
))`}
        />
        <Callout variant="tip" title="Meno dipendenze con l'aggiornamento funzionale">
          <p>
            Con <code>{'setItems(prev => ...)'}</code> la funzione non legge <code>items</code>, quindi non serve
            metterlo tra le dipendenze e la funzione resta stabile per sempre. Con <code>setItems(items.map(...))</code>{' '}
            dovresti dipendere da <code>items</code>, e la funzione cambierebbe a ogni modifica.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="liste" title="Liste: key e liste lunghe">
        <Prose>
          <p>
            La <code>key</code> dice a React quale elemento della lista è quale tra un render e l'altro. Con una key
            stabile (l'id) React sposta gli elementi esistenti; con l'<strong>indice</strong>, se aggiungi in cima, ogni
            elemento riceve la key del vicino. Il risultato è che lo stato interno (input, focus, animazioni) resta
            attaccato alla posizione sbagliata, oltre a causare render in più.
          </p>
          <p>
            Scrivi una nota accanto ad Ada e Grace in entrambe le colonne, poi clicca &quot;Aggiungi in cima&quot;:
          </p>
        </Prose>
        <Example title="key = indice vs key = id" code={keysDemoSrc} file={`${DIR}/KeysDemo.tsx`}>
          <KeysDemo />
        </Example>
        <Prose>
          <h3>Liste di migliaia di elementi</h3>
          <p>
            Renderizzare 10.000 righe è lento anche con <code>memo</code>, perché sono 10.000 nodi DOM. Le soluzioni:
          </p>
          <ul>
            <li>
              <strong>Paginazione</strong> o <strong>caricamento progressivo</strong> (&quot;carica altri&quot;): spesso
              è anche la scelta migliore per l'usabilità.
            </li>
            <li>
              <strong>Virtualizzazione</strong>: si renderizzano solo le righe visibili, con librerie come TanStack
              Virtual o react-window.
            </li>
            <li>
              Il CSS <code>content-visibility: auto</code> fa saltare al browser layout e disegno delle parti fuori
              schermo, senza JavaScript.
            </li>
            <li>
              <code>useDeferredValue</code> e <code>useTransition</code> mantengono l'input reattivo mentre la lista si
              aggiorna in background (pagina <Link to="/advanced-hooks">Hook avanzati</Link>).
            </li>
          </ul>
        </Prose>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="misurare" title="Misurare prima di ottimizzare">
        <Prose>
          <ul>
            <li>
              <strong>React DevTools → Profiler</strong>: registra un'interazione e mostra quali componenti si sono
              renderizzati, quanto hanno impiegato e <em>perché</em> (attiva &quot;Record why each component
              rendered&quot; nelle impostazioni).
            </li>
            <li>
              <strong>React DevTools → Highlight updates</strong>: evidenzia i componenti mentre si ri-renderizzano, come
              il <code>RenderTracker</code> di queste note ma su tutta l'app.
            </li>
            <li>
              <strong>Chrome DevTools → Performance</strong>: per capire se il problema è React, il layout o il codice.
            </li>
            <li>
              Il componente <code>{'<Profiler>'}</code> misura un sottoalbero da codice:
            </li>
          </ul>
        </Prose>
        <CodeBlock
          code={`import { Profiler } from 'react'

<Profiler
  id="ProductList"
  onRender={(id, phase, actualDuration) => {
    // phase: 'mount' | 'update' | 'nested-update'
    if (actualDuration > 16) console.warn(\`\${id} \${phase}: \${actualDuration.toFixed(1)}ms\`)
  }}
>
  <ProductList />
</Profiler>`}
        />
        <Callout variant="warning">
          <p>
            Misura con una <strong>build di produzione</strong> (<code>npm run build && npm run preview</code>): in
            sviluppo React fa controlli extra e, con <code>StrictMode</code>, renderizza tutto due volte.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="react-compiler" title="React Compiler">
        <Prose>
          <p>
            Il <strong>React Compiler</strong> è un plugin di build che analizza i componenti e aggiunge da solo
            l'equivalente di <code>memo</code>, <code>useMemo</code> e <code>useCallback</code> dove servono. Con il
            compilatore attivo, gran parte delle ottimizzazioni manuali di questa pagina non serve più.
          </p>
          <p>
            Funziona solo con codice che rispetta le regole di React: componenti puri, niente modifiche a props e stato,
            niente letture di <code>ref.current</code> durante il render. Le regole del linter attive nel progetto (
            <code>react/refs</code>, <code>react/set-state-in-effect</code>) segnalano esattamente queste violazioni.
            Scrivere codice che le rispetta lo rende già pronto per il compilatore.
          </p>
        </Prose>
        <Prose>
          <p>
            Con Vite 8 e <code>@vitejs/plugin-react</code> v6 ci sono due strade. La versione Babel è quella stabile,
            mentre quella in Rust (<code>{'react({ compiler: true })'}</code> con <code>oxc-transform-react</code>) è
            ancora sperimentale.
          </p>
        </Prose>
        <CodeBlock language="bash" code={`npm install -D @rolldown/plugin-babel @babel/core babel-plugin-react-compiler`} />
        <CodeBlock
          language="ts"
          filename="vite.config.ts"
          code={`import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
})`}
        />
        <Prose>
          <p>
            Non è attivo in questo progetto, apposta: le demo devono mostrare il comportamento di React senza
            ottimizzazioni automatiche. Per i dettagli vedi il README di <code>@vitejs/plugin-react</code> e la
            documentazione di React (
            <a href="https://react.dev/learn/react-compiler" target="_blank" rel="noreferrer">
              react.dev/learn/react-compiler
            </a>
            ).
          </p>
        </Prose>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="riepilogo" title="Riepilogo: in che ordine provare">
        <Table
          head={['#', 'Tecnica', 'Quando']}
          rows={[
            ['1', 'Misurare', 'Sempre, prima di tutto: Profiler, build di produzione'],
            ['2', 'Spostare lo stato in basso', 'Lo stato serve solo a una parte dell’albero'],
            ['3', 'Contenuto come `children`', 'Un wrapper con stato contiene una parte costosa'],
            ['4', '`useMemo` su calcoli', 'Un calcolo misurato come costoso a ogni render'],
            ['5', '`memo` + `useCallback`/`useMemo` sulle props', 'Componente costoso che riceve spesso le stesse props'],
            ['6', 'Virtualizzazione, paginazione', 'Migliaia di elementi nel DOM'],
            ['7', '`useTransition`, `useDeferredValue`', 'Aggiornamenti pesanti che bloccano l’input'],
          ]}
        />
      </Section>
    </Page>
  )
}
