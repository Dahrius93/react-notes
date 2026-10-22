import { Link } from 'react-router'
import viteConfigSrc from '../../../vite.config.ts?raw'
import smokeTestSrc from '@/app/__tests__/routes.smoke.test.tsx?raw'
import { Callout } from '@/docs/Callout'
import { CodeBlock, CodeCompare } from '@/docs/CodeBlock'
import { Example } from '@/docs/Example'
import { Page } from '@/docs/Page'
import { Prose, Section } from '@/docs/Section'
import { Step } from '@/docs/Step'
import { Table } from '@/docs/Table'
import counterTestSrc from '@/features/hooks-base/examples/__tests__/Counter.test.tsx?raw'
import useDebounceTestSrc from '@/shared/hooks/__tests__/useDebounce.test.ts?raw'
import mockFetchSrc from '@/test/mockFetch.ts?raw'
import renderWithProvidersTestSrc from '@/test/__tests__/renderWithProviders.test.tsx?raw'
import renderWithProvidersSrc from '@/test/renderWithProviders.tsx?raw'
import setupSrc from '@/test/setup.ts?raw'
import cartLogicTestSrc from './examples/cart/__tests__/cartLogic.test.ts?raw'
import cartSummaryTestSrc from './examples/cart/__tests__/CartSummary.test.tsx?raw'
import { CartSummary } from './examples/cart/CartSummary'
import cartSummarySrc from './examples/cart/CartSummary.tsx?raw'

const DIR = 'src/features/testing/examples/cart'

export default function TestingPage() {
  return (
    <Page
      title="Testing con Vitest"
      lead="Test automatici per funzioni, componenti e hook con Vitest e Testing Library: si testa quello che vede e fa l'utente, non come è scritto il codice."
    >
      {/* ------------------------------------------------------------------ */}
      <Section id="primo-esempio" title="Primo esempio, passo per passo">
        <Prose>
          <p>
            <strong>Vitest</strong> è il test runner pensato per Vite: usa la stessa configurazione, gli stessi alias e gli
            stessi plugin, quindi i test vedono il codice esattamente come l'app. <strong>Testing Library</strong> serve a
            renderizzare componenti e a interrogarli come farebbe un utente. In questo progetto: Vitest 5.0,
            @testing-library/react 16, user-event 14, jest-dom 7, jsdom 30.
          </p>
        </Prose>

        <Step n={1} title="Installa">
          <CodeBlock
            language="bash"
            code={`npm install -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom`}
          />
          <Prose>
            <ul>
              <li>
                <code>jsdom</code>: un browser simulato in Node, con <code>document</code>, eventi e DOM;
              </li>
              <li>
                <code>@testing-library/react</code>: <code>render</code>, <code>screen</code>, <code>renderHook</code>;
              </li>
              <li>
                <code>@testing-library/user-event</code>: simula l'utente (clic, digitazione, tastiera);
              </li>
              <li>
                <code>@testing-library/jest-dom</code>: matcher per il DOM come <code>toBeInTheDocument()</code> e{' '}
                <code>toBeDisabled()</code>.
              </li>
            </ul>
          </Prose>
        </Step>

        <Step n={2} title="Configura Vitest in vite.config.ts">
          <Prose>
            <p>
              Il blocco <code>test</code> sta nella stessa configurazione di Vite. <code>defineConfig</code> si importa da{' '}
              <code>vitest/config</code>, così TypeScript conosce anche le opzioni dei test.
            </p>
          </Prose>
          <CodeBlock code={viteConfigSrc} language="ts" filename="vite.config.ts" />
        </Step>

        <Step n={3} title="Il file di setup">
          <Prose>
            <p>
              Gira prima di ogni file di test: attiva i matcher di jest-dom, pulisce dopo ogni test e aggiunge le API del
              browser che jsdom non ha.
            </p>
          </Prose>
          <CodeBlock code={setupSrc} language="ts" filename="src/test/setup.ts" />
        </Step>

        <Step n={4} title="Gli script">
          <CodeBlock
            language="json"
            filename="package.json"
            code={`"scripts": {
  "test": "vitest",                     // watch mode: re-runs the tests of the files you change
  "test:run": "vitest run",             // once, e.g. in CI
  "coverage": "vitest run --coverage"   // with the coverage report
}`}
          />
        </Step>

        <Step n={5} title="Il primo test: una funzione">
          <Prose>
            <p>
              Un file <code>*.test.ts</code> accanto al codice. <code>describe</code> raggruppa, <code>it</code> descrive
              un comportamento, <code>expect</code> verifica. Le funzioni pure sono le più facili da testare: dati in
              ingresso, risultato in uscita.
            </p>
          </Prose>
          <CodeBlock code={cartLogicTestSrc} language="ts" filename={`${DIR}/__tests__/cartLogic.test.ts`} />
          <Callout variant="note" title="Un test che ha trovato un errore">
            <p>
              L'ultimo controllo su <code>formatEuro</code> l'ho scritto convinto che <code>1234,5</code> diventasse{' '}
              <code>1.234,50 €</code>. Il test è fallito: in italiano il separatore delle migliaia compare solo da 5 cifre
              in su. È esattamente il tipo di sorpresa che un test fa emergere prima dell'utente.
            </p>
          </Callout>
        </Step>

        <Step n={6} title="Il primo test di un componente">
          <Prose>
            <ul>
              <li>
                <code>render(&lt;Counter /&gt;)</code> monta il componente nel DOM di jsdom;
              </li>
              <li>
                <code>screen.getByRole(&apos;button&apos;, {'{ name }'})</code> trova un elemento come lo troverebbe un
                utente: per ruolo e testo;
              </li>
              <li>
                <code>await userEvent.click(...)</code> simula il clic, con tutti gli eventi che il browser emetterebbe;
              </li>
              <li>
                <code>expect(...).toBeInTheDocument()</code> verifica il risultato visibile.
              </li>
            </ul>
          </Prose>
          <CodeBlock code={counterTestSrc} filename="src/features/hooks-base/examples/__tests__/Counter.test.tsx" />
        </Step>

        <Prose>
          <p>
            Lancia <code>npm test</code>: Vitest trova tutti i file <code>*.test.ts(x)</code>, li esegue e resta in ascolto.
            Ogni volta che salvi un file rilancia solo i test collegati. Premi <code>p</code> per filtrare per nome di file,{' '}
            <code>t</code> per nome di test.
          </p>
        </Prose>
        <CodeBlock
          language="bash"
          code={`$ npm test

 ✓ src/features/testing/examples/cart/__tests__/cartLogic.test.ts (4 tests) 4ms
 ✓ src/features/hooks-base/examples/__tests__/Counter.test.tsx (2 tests) 98ms
 ...
 Test Files  36 passed (36)
      Tests  154 passed (154)`}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="anatomia" title="Anatomia di un test">
        <Prose>
          <p>
            Ogni test segue lo schema <strong>Arrange – Act – Assert</strong>: prepara (render, dati, mock), agisci (clic,
            digitazione), verifica (<code>expect</code>). Un test, un comportamento, con un nome che lo descrive in modo
            leggibile: <em>&quot;mostra l'errore se il codice sconto non è valido&quot;</em>, non{' '}
            <em>&quot;test 3&quot;</em>.
          </p>
        </Prose>
        <Table
          head={['API / matcher', 'A cosa serve']}
          rows={[
            ['`describe`, `it` (o `test`)', 'Gruppo di test, singolo test'],
            ['`it.each([[a, b], ...])`', 'Lo stesso test con dati diversi'],
            ['`beforeEach`, `afterEach`', 'Preparazione e pulizia comuni'],
            ['`toBe(x)` / `toEqual(obj)`', 'Uguaglianza stretta / uguaglianza di contenuto (oggetti, array)'],
            ['`toThrow(msg)`, `rejects.toThrow()`', 'Errori sincroni / promise rifiutate'],
            ['`toHaveBeenCalledWith(...)`, `toHaveBeenCalledTimes(n)`', 'Verifiche sui mock'],
            ['`toBeInTheDocument()`, `toBeVisible()`', 'Presenza e visibilità (jest-dom)'],
            ['`toHaveTextContent()`, `toHaveValue()`, `toHaveAttribute()`', 'Contenuto, valore dei campi, attributi'],
            ['`toBeDisabled()`, `toHaveFocus()`, `toBeChecked()`', 'Stato di pulsanti, focus, checkbox'],
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="query" title="Trovare gli elementi: le query di Testing Library">
        <Prose>
          <p>
            Il principio di Testing Library: <em>più il test somiglia a come il software viene usato, più fiducia ti
            dà</em>. Per questo gli elementi si cercano come li cerca un utente, per ruolo e testo visibile, e non per
            classe CSS o struttura del DOM. Così il test non si rompe se cambi il markup, e verifica anche l'accessibilità:
            se <code>getByLabelText</code> non trova il campo, l'etichetta non è collegata.
          </p>
          <p>Il componente su cui lavoriamo nel resto della pagina:</p>
        </Prose>
        <Example title="Carrello con codice sconto" code={cartSummarySrc} file={`${DIR}/CartSummary.tsx`}>
          <CartSummary />
        </Example>
        <Table
          head={['Priorità', 'Query', 'Quando']}
          rows={[
            ['1', '`getByRole("button", { name: "Applica" })`', 'Quasi sempre: ruolo ARIA + nome accessibile'],
            ['2', '`getByLabelText("Codice sconto")`', 'Campi dei form'],
            ['3', '`getByPlaceholderText`, `getByText`, `getByDisplayValue`', 'Testo visibile non interattivo'],
            ['4', '`getByAltText`, `getByTitle`', 'Immagini, elementi con title'],
            ['5', '`getByTestId("cart-total")`', 'Ultima risorsa, quando niente di visibile identifica l’elemento'],
          ]}
        />
        <Table
          head={['Variante', 'Se non trova', 'Se ne trova più di uno', 'Usala per']}
          rows={[
            ['`getBy…`', 'Errore', 'Errore', 'Elementi che devono esserci adesso'],
            ['`queryBy…`', '`null`', 'Errore', 'Verificare che qualcosa NON ci sia'],
            ['`findBy…` (async)', 'Errore dopo l’attesa', 'Errore', 'Elementi che compariranno (dopo un fetch, un timer)'],
            ['`getAllBy…` / `queryAllBy…` / `findAllBy…`', 'come sopra', 'Array', 'Liste'],
          ]}
        />
        <Prose>
          <p>
            <code>within(elemento)</code> limita la ricerca a una parte della pagina, ad esempio solo dentro il carrello.
            I test del carrello:
          </p>
        </Prose>
        <CodeBlock code={cartSummaryTestSrc} filename={`${DIR}/__tests__/CartSummary.test.tsx`} />
        <Callout variant="tip" title="Non sai che query usare?">
          <p>
            <code>screen.debug()</code> stampa il DOM corrente; <code>screen.logTestingPlaygroundURL()</code> genera un link
            a uno strumento che suggerisce la query migliore per ogni elemento.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="user-event" title="Simulare l'utente: userEvent">
        <Prose>
          <p>
            <code>userEvent</code> riproduce le interazioni reali: <code>type</code> preme un tasto alla volta (keydown,
            keypress, input, keyup), <code>click</code> sposta anche il focus, i pulsanti disabilitati non rispondono. Si
            crea un'istanza con <code>userEvent.setup()</code> all'inizio del test, e ogni azione va attesa con{' '}
            <code>await</code>.
          </p>
        </Prose>
        <Table
          head={['Azione', 'Esempio']}
          rows={[
            ['Clic, doppio clic', '`await user.click(button)`, `await user.dblClick(el)`'],
            ['Scrivere, svuotare', '`await user.type(input, "ciao")`, `await user.clear(input)`'],
            ['Tasti speciali', '`await user.keyboard("{Enter}")`, `"{Escape}"`, `"{ArrowRight}"`'],
            ['Spostare il focus', '`await user.tab()`'],
            ['Select, checkbox', '`await user.selectOptions(select, "it")`, `await user.click(checkbox)`'],
            ['Passaggio del mouse', '`await user.hover(el)`, `await user.unhover(el)`'],
          ]}
        />
        <CodeCompare
          bad={`// fireEvent: a single synthetic event.
// Doesn't type char by char, ignores disabled,
// doesn't move the focus.
fireEvent.change(input, { target: { value: 'ciao' } })
fireEvent.click(button)`}
          good={`// userEvent: what a real user would do
const user = userEvent.setup()
await user.type(input, 'ciao')
await user.click(button)`}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="async" title="Codice asincrono">
        <Prose>
          <p>
            Quando l'interfaccia cambia dopo un fetch, un timer o una promise, il test deve <strong>aspettare</strong>.
            Non con un <code>sleep</code>, che è lento e instabile, ma con le API che riprovano finché la condizione è vera
            o scade il tempo:
          </p>
        </Prose>
        <Table
          head={['API', 'Uso']}
          rows={[
            ['`await screen.findByText("…")`', 'Aspetta che un elemento compaia (default 1 s, `{ timeout }` per cambiarlo)'],
            ['`await waitFor(() => expect(…))`', 'Riprova un’asserzione qualsiasi finché passa'],
            ['`await waitForElementToBeRemoved(() => screen.queryByText("Caricamento…"))`', 'Aspetta che qualcosa sparisca'],
          ]}
        />
        <Callout variant="warning" title="Il warning di act">
          <p>
            &quot;An update was not wrapped in act(...)&quot; significa che lo stato è cambiato dopo la fine del test, o
            mentre il test non stava aspettando. Quasi sempre la soluzione è aspettare il risultato con{' '}
            <code>findBy</code> o <code>waitFor</code>, non aggiungere <code>act</code> a mano. L'eccezione sono i
            componenti che si <strong>sospendono</strong> (<code>use</code>, <code>lazy</code>): vanno renderizzati dentro
            un <code>await act(async () =&gt; ...)</code> (pagina <Link to="/advanced-hooks#test">Hook avanzati</Link>).
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="mock" title="Mock: sostituire le dipendenze">
        <Prose>
          <p>
            Un mock sostituisce una dipendenza con una versione controllata dal test. Si usa al <strong>confine</strong>{' '}
            del sistema (rete, tempo, storage, servizi esterni), non per i propri componenti: un test che sostituisce
            mezzo albero non verifica più nulla.
          </p>
        </Prose>
        <Table
          head={['Strumento', 'Cosa fa', 'Esempio']}
          rows={[
            ['`vi.fn()`', 'Una funzione finta che registra le chiamate', '`const onSave = vi.fn()`, poi `expect(onSave).toHaveBeenCalledWith(…)`'],
            ['`vi.spyOn(obj, "metodo")`', 'Osserva (o sostituisce) un metodo esistente', '`vi.spyOn(console, "error").mockImplementation(() => {})`'],
            ['`vi.mock("./modulo")`', 'Sostituisce un intero modulo importato', '`vi.mock("../couponService", () => ({ validateCoupon: vi.fn() }))`'],
            ['`vi.mocked(fn)`', 'Tipizza una funzione mockata', '`vi.mocked(validateCoupon).mockResolvedValue(…)`'],
            ['`vi.stubGlobal("fetch", …)`', 'Sostituisce una variabile globale', 'Annullato da `vi.unstubAllGlobals()` nel setup'],
            ['`vi.useFakeTimers()`', 'Controlla `setTimeout`, `setInterval`, `Date`', '`vi.advanceTimersByTime(300)`'],
          ]}
        />
        <Prose>
          <h3>Simulare l'API: mockFetch</h3>
          <p>
            Per i componenti che chiamano JSONPlaceholder, il progetto ha un piccolo helper che sostituisce{' '}
            <code>fetch</code> con un finto server. Le rotte si scrivono come <code>&quot;GET /users/1&quot;</code>, le
            risposte come dati o funzioni, e le rotte sconosciute rispondono 404.
          </p>
        </Prose>
        <CodeBlock code={mockFetchSrc} language="ts" filename="src/test/mockFetch.ts" />
        <Callout variant="note" title="MSW">
          <p>
            Nei progetti più grandi lo standard è <strong>Mock Service Worker</strong> (<code>msw</code>): intercetta le
            richieste a livello di rete, quindi funziona con <code>fetch</code>, axios e qualsiasi client, e gli stessi
            handler si usano nei test, nello sviluppo e in Storybook. <code>mockFetch</code> è la versione minima dello
            stesso concetto.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="hook-timer" title="Hook e timer">
        <Prose>
          <p>
            <code>renderHook(() =&gt; useQualcosa(args))</code> monta l'hook in un componente invisibile:{' '}
            <code>result.current</code> è l'ultimo valore restituito, <code>rerender(nuoveProps)</code> cambia gli
            argomenti, <code>act(() =&gt; ...)</code> avvolge le chiamate che aggiornano lo stato. Con{' '}
            <code>vi.useFakeTimers()</code> il tempo lo controlla il test: un debounce di 300 ms si verifica in un istante.
          </p>
        </Prose>
        <CodeBlock code={useDebounceTestSrc} language="ts" filename="src/shared/hooks/__tests__/useDebounce.test.ts" />
        <Callout variant="tip" title="userEvent con i timer finti">
          <p>
            <code>userEvent</code> usa dei piccoli ritardi interni: con i timer finti va configurato perché li faccia
            avanzare, altrimenti resta in attesa:{' '}
            <code>{'userEvent.setup({ advanceTimers: vi.advanceTimersByTime })'}</code>.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="provider" title="Router, TanStack Query e autenticazione: renderWithProviders">
        <Prose>
          <p>
            Un componente che usa <code>useNavigate</code>, <code>useQuery</code> o <code>useAuth</code> ha bisogno dei
            provider anche nei test. Invece di ripeterli in ogni file, il progetto ha un <code>renderWithProviders</code>{' '}
            che monta tutto con le opzioni più utili:
          </p>
          <ul>
            <li>
              un router in memoria, con la URL iniziale (<code>route</code>), il pattern della route (<code>path</code>,
              per <code>useParams</code>) e altre route raggiungibili (<code>routes</code>);
            </li>
            <li>
              un <strong>QueryClient nuovo per ogni test</strong>, senza retry;
            </li>
            <li>
              l'<code>AuthProvider</code>, con un utente già autenticato se passi <code>user</code>.
            </li>
          </ul>
          <p>
            Restituisce anche <code>user</code> (userEvent), <code>router</code> (per verificare i redirect) e{' '}
            <code>queryClient</code>.
          </p>
        </Prose>
        <CodeBlock code={renderWithProvidersSrc} filename="src/test/renderWithProviders.tsx" />
        <CodeBlock code={renderWithProvidersTestSrc} filename="src/test/__tests__/renderWithProviders.test.tsx" />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="progetto" title="Test di progetto: smoke test e architettura">
        <Prose>
          <p>
            Oltre ai test dei singoli pezzi, due test controllano il progetto nel suo insieme, e sono tra i più utili:
          </p>
          <ul>
            <li>
              lo <strong>smoke test</strong> delle route renderizza ogni pagina delle note e verifica che il titolo
              compaia. Ha trovato bug veri, come <code>Element.animate</code>, che mancava in jsdom e faceva crollare la
              pagina Context;
            </li>
            <li>
              il <strong>test di architettura</strong> verifica la direzione delle dipendenze tra cartelle (pagina{' '}
              <Link to="/architecture#dipendenze">Architettura</Link>).
            </li>
          </ul>
        </Prose>
        <CodeBlock code={smokeTestSrc} filename="src/app/__tests__/routes.smoke.test.tsx" />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="coverage" title="Copertura del codice">
        <CodeBlock language="bash" code={`npm install -D @vitest/coverage-v8   # same version as vitest
npm run coverage                      # → summary in the terminal + coverage/index.html`} />
        <Prose>
          <p>
            La copertura dice quali righe, rami e funzioni sono stati eseguiti dai test. La configurazione è nel blocco{' '}
            <code>coverage</code> di <code>vite.config.ts</code> (passo 2). In questo progetto è intorno all'80% delle
            righe. Il report HTML in <code>coverage/index.html</code> evidenzia in rosso il codice mai eseguito, e la
            cartella è esclusa da git.
          </p>
        </Prose>
        <Callout variant="warning" title="Copertura non è qualità">
          <p>
            Una riga eseguita non è una riga verificata: un test senza <code>expect</code> utili alza la copertura senza
            proteggere nulla. Usala per trovare le parti <strong>mai</strong> testate, non come obiettivo da inseguire. Se
            imposti delle soglie minime (<code>coverage.thresholds</code>), tienile realistiche.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="cosa-testare" title="Cosa testare, e cosa no">
        <Table
          head={['Sì', 'No']}
          rows={[
            ['Logica pura: reducer, validazioni, calcoli, trasformazioni', 'Dettagli interni: stato di un componente, nomi di funzioni private'],
            ['Comportamenti visibili: “cliccando X compare Y”', 'Stili e classi CSS'],
            ['Casi limite: lista vuota, errore del server, input non valido', 'Il codice delle librerie (React, TanStack Query, Zod sono già testati)'],
            ['Accessibilità di base: etichette, ruoli, focus', 'Snapshot di interi componenti: si aggiornano senza guardarli'],
            ['Integrazione: un form completo con l’API simulata', 'Tutto con i mock: alla fine si testano solo i mock'],
          ]}
        />
        <Prose>
          <p>
            Una buona distribuzione, il cosiddetto &quot;testing trophy&quot;: molti test di <strong>integrazione</strong>{' '}
            (un componente vero con le sue dipendenze, rete simulata), test <strong>unitari</strong> per la logica pura,
            pochi test <strong>end-to-end</strong> in un browser vero (Playwright) per i percorsi critici come login e
            pagamento, e alla base TypeScript e il linter, che eliminano intere categorie di errori.
          </p>
        </Prose>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="riepilogo" title="Riepilogo">
        <Table
          head={['Comando / API', 'A cosa serve']}
          rows={[
            ['`npm test`', 'Watch mode: rilancia i test collegati ai file modificati'],
            ['`npm run test:run`', 'Una volta sola (CI)'],
            ['`npx vitest run src/features/testing`', 'Solo una cartella'],
            ['`npx vitest run -t "coupon"`', 'Solo i test il cui nome contiene “coupon”'],
            ['`npm run coverage`', 'Report di copertura'],
            ['`render`, `screen`, `within`', 'Montare e interrogare un componente'],
            ['`getBy` / `queryBy` / `findBy`', 'Deve esserci / non deve esserci / comparirà'],
            ['`userEvent.setup()`', 'Interazioni realistiche, sempre con `await`'],
            ['`renderHook`, `act`', 'Testare un hook da solo'],
            ['`vi.fn`, `vi.spyOn`, `vi.mock`, `vi.stubGlobal`', 'Mock di funzioni, metodi, moduli, globali'],
            ['`vi.useFakeTimers()`, `vi.advanceTimersByTime(ms)`', 'Controllare il tempo'],
            ['`renderWithProviders`, `mockFetch`', 'Helper del progetto: provider e API finta'],
          ]}
        />
      </Section>
    </Page>
  )
}
