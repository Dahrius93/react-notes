import { Link } from 'react-router'
import appRouterSrc from '@/app/router.tsx?raw'
import { Callout } from '@/docs/Callout'
import { CodeBlock, CodeCompare } from '@/docs/CodeBlock'
import { Example } from '@/docs/Example'
import { Page } from '@/docs/Page'
import { Prose, Section } from '@/docs/Section'
import { Step } from '@/docs/Step'
import { Table } from '@/docs/Table'
import loginPageSrc from '@/features/auth/LoginPage.tsx?raw'
import requireAuthSrc from '@/features/auth/RequireAuth.tsx?raw'
import slugifySrc from '@/shared/lib/slugify.ts?raw'
import routingTestSrc from './examples/__tests__/routing.test.tsx?raw'
import basicAppSrc from './examples/basic/App.tsx?raw'
import { BasicRouterDemo } from './examples/basic/BasicRouterDemo'
import basicPagesSrc from './examples/basic/pages.tsx?raw'
import dataComponentsSrc from './examples/data/components.tsx?raw'
import dataLoadersSrc from './examples/data/loaders.ts?raw'
import dataRoutesSrc from './examples/data/routes.ts?raw'
import {
  DataDemo,
  NavigateDemo,
  NavLinksDemo,
  NestedDemo,
  ParamsDemo,
  ProtectedDemo,
  SearchDemo,
  SlugDemo,
} from './examples/demos'
import navLinksAppSrc from './examples/links/NavLinksApp.tsx?raw'
import newPostAppSrc from './examples/navigate/NewPostApp.tsx?raw'
import dashboardAppSrc from './examples/nested/DashboardApp.tsx?raw'
import usersAppSrc from './examples/params/UsersApp.tsx?raw'
import protectedAppSrc from './examples/protected/ProtectedApp.tsx?raw'
import postsSearchSrc from './examples/search/PostsSearch.tsx?raw'
import postsAppSrc from './examples/slug/PostsApp.tsx?raw'

const DIR = 'src/features/routing/examples'

export default function RoutingPage() {
  return (
    <Page
      title="React Router"
      lead="Collegare gli URL ai componenti: una sola pagina HTML, tante &quot;pagine&quot; React, navigazione senza ricaricare. Versione 8."
    >
      <Callout variant="note" title="Come funzionano le demo di questa pagina">
        <p>
          Ogni demo è un'app a sé, con una <strong>barra degli indirizzi finta</strong>: puoi usare indietro/avanti,
          scrivere un URL e premere Invio. A destra vedi lo stato della navigazione (<code>idle</code>,{' '}
          <code>loading</code>, <code>submitting</code>). Le demo usano un router in memoria perché queste note girano già
          dentro un router, e React Router non ne permette due annidati. In un'app vera useresti{' '}
          <code>{'<BrowserRouter>'}</code> o <code>createBrowserRouter</code>, come mostrato nel codice.
        </p>
      </Callout>

      {/* ------------------------------------------------------------------ */}
      <Section id="installazione" title="Installazione e versione">
        <Prose>
          <p>
            Queste note riguardano <strong>React Router 8</strong> (in questo progetto la 8.5). Si installa un solo
            pacchetto:
          </p>
        </Prose>
        <CodeBlock language="bash" code="npm install react-router" />
        <Prose>
          <h3>Cosa cambia rispetto alle versioni precedenti</h3>
          <ul>
            <li>
              <strong>Il pacchetto <code>react-router-dom</code> non esiste più.</strong> Nella v7 era rimasto solo per
              compatibilità; nella v8 tutto si importa da <code>react-router</code>, tranne <code>RouterProvider</code>,
              che sta in <code>react-router/dom</code>. Molte guide online sono ancora scritte per la v6 con{' '}
              <code>react-router-dom</code>: i concetti sono gli stessi, cambiano gli import.
            </li>
            <li>
              Requisiti: <strong>React 19.2.7+</strong>, <strong>Node 22.22+</strong>, pacchetto solo ESM.
            </li>
            <li>
              Il middleware delle route è sempre attivo. Le API di view transition del router sono deprecate in favore del
              componente <code>{'<ViewTransition>'}</code> di React.
            </li>
          </ul>
        </Prose>
        <CodeCompare
          bad={`// v6
import { BrowserRouter, Link } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'`}
          good={`// v8
import { BrowserRouter, Link } from 'react-router'
import { RouterProvider } from 'react-router/dom'`}
        />
        <Prose>
          <h3>Tre modi di usarlo</h3>
          <p>
            React Router si può usare a tre livelli. Ognuno aggiunge funzionalità al precedente, e si può passare dall'uno
            all'altro senza riscrivere i componenti:
          </p>
        </Prose>
        <Table
          head={['Modalità', 'Come si configura', 'Cosa offre']}
          rows={[
            [
              'Declarative',
              '`<BrowserRouter>` + `<Routes>` / `<Route>` nel JSX',
              'Routing, link, parametri, navigazione. Il più semplice.',
            ],
            [
              'Data',
              '`createBrowserRouter([...])` + `<RouterProvider>`',
              'Tutto il precedente + `loader`, `action`, stato di caricamento, error boundary per route, `lazy`.',
            ],
            [
              'Framework',
              'Plugin Vite `@react-router/dev`, route da file',
              'Tutto il precedente + rendering lato server, pre-rendering, type safety generata. È l’evoluzione di Remix.',
            ],
          ]}
        />
        <Prose>
          <p>
            Questa pagina parte dalla modalità <strong>declarative</strong> per i concetti di base e poi passa alla{' '}
            <strong>data</strong>, che è quella usata da queste note (<code>src/app/router.tsx</code>). La modalità
            framework richiede un setup di progetto diverso e non è trattata qui.
          </p>
        </Prose>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="primo-esempio" title="Primo esempio, passo per passo">
        <Prose>
          <p>Un sito con due pagine e una 404, in modalità declarative:</p>
        </Prose>
        <CodeBlock
          language="bash"
          filename="struttura"
          code={`src/
  main.tsx    # 1. <BrowserRouter> around the app
  pages.tsx   # 2. the pages: plain components
  App.tsx     # 3. <Routes>, <Route> and <Link>`}
        />

        <Step n={1} title="Avvolgi l'app in <BrowserRouter>">
          <Prose>
            <p>
              <code>{'<BrowserRouter>'}</code> legge l'URL della barra degli indirizzi e lo tiene sincronizzato con
              l'app. Va messo una sola volta, il più in alto possibile: tutto quello che sta dentro può usare il router.
            </p>
          </Prose>
          <CodeBlock
            filename="src/main.tsx"
            code={`import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)`}
          />
        </Step>

        <Step n={2} title="Scrivi le pagine">
          <Prose>
            <p>
              Una &quot;pagina&quot; è un normale componente React. Non sa nulla del router: è il router a decidere quando
              mostrarla.
            </p>
          </Prose>
          <CodeBlock code={basicPagesSrc} filename="src/pages.tsx" />
        </Step>

        <Step n={3} title="Collega URL e pagine con <Routes> e <Route>, naviga con <Link>">
          <Prose>
            <ul>
              <li>
                <code>{'<Route path="/about" element={<AboutPage />} />'}</code>: &quot;quando l'URL è{' '}
                <code>/about</code>, mostra <code>AboutPage</code>&quot;.
              </li>
              <li>
                <code>{'<Routes>'}</code> contiene le route, sceglie quella che corrisponde meglio all'URL corrente e
                renderizza solo quella. Dove metti <code>{'<Routes>'}</code> è dove compaiono le pagine.
              </li>
              <li>
                <code>{'<Link to="/about">'}</code> produce un normale <code>{'<a>'}</code>, ma al clic cambia l'URL
                senza ricaricare la pagina: lo stato dell'app resta, e il cambio è istantaneo.
              </li>
              <li>
                <code>path=&quot;*&quot;</code> corrisponde a qualsiasi URL non gestito dalle altre route: è la 404.
              </li>
            </ul>
          </Prose>
          <CodeBlock code={basicAppSrc} filename="src/App.tsx" />
        </Step>

        <Example title="Il primo router" code={basicAppSrc} file={`${DIR}/basic/App.tsx`}>
          <BasicRouterDemo />
        </Example>
        <Callout variant="danger" title="Non usare <a href> per i link interni">
          <p>
            Un <code>{'<a href="/about">'}</code> fa ricaricare tutta la pagina al browser: perdi lo stato, rifai il
            download di JavaScript e CSS, e l'utente vede un lampo bianco. Per gli URL della tua app usa sempre{' '}
            <code>{'<Link>'}</code>; <code>{'<a>'}</code> va bene per i siti esterni.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="link-navlink" title="Link e NavLink">
        <Prose>
          <p>
            <code>{'<NavLink>'}</code> è un <code>{'<Link>'}</code> che sa se è <strong>attivo</strong>, cioè se l'URL
            corrente corrisponde al suo <code>to</code>. Ideale per menu e tab. Riceve <code>isActive</code> (e{' '}
            <code>isPending</code> in modalità data) in <code>className</code>, <code>style</code> e{' '}
            <code>children</code>, e senza configurazione aggiunge la classe <code>active</code>. Questa app lo usa nella
            sidebar.
          </p>
        </Prose>
        <Table
          head={['Prop', 'Su', 'Cosa fa']}
          rows={[
            ['`to`', 'entrambi', 'Destinazione: `"/docs"`, `"settings"` (relativo), `".."` (livello sopra), `{ pathname, search }`'],
            ['`replace`', 'entrambi', 'Sostituisce la voce corrente della cronologia invece di aggiungerne una'],
            ['`state`', 'entrambi', 'Dati passati alla pagina di destinazione (`useLocation().state`), non visibili nell’URL'],
            ['`reloadDocument`', 'entrambi', 'Forza un caricamento completo, come un `<a>` normale'],
            ['`end`', '`NavLink`', 'Attivo solo se l’URL corrisponde esattamente, non anche per i sotto-percorsi'],
            ['`className` / `style` / `children` come funzione', '`NavLink`', 'Ricevono `{ isActive, isPending }`'],
          ]}
        />
        <Prose>
          <p>
            Nella demo: &quot;Home&quot; ha <code>end</code>, altrimenti sarebbe attivo su tutti gli URL perché tutti
            iniziano con <code>/</code>. &quot;Docs&quot; invece è attivo anche su <code>/docs/install</code>. Prova anche
            &quot;Docs (replace)&quot; e poi il pulsante indietro.
          </p>
        </Prose>
        <Example title="NavLink attivo, end, replace e state" code={navLinksAppSrc} file={`${DIR}/links/NavLinksApp.tsx`}>
          <NavLinksDemo />
        </Example>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="annidate" title="Route annidate, layout e route index">
        <Prose>
          <p>
            Le route si possono annidare. Il componente della route padre decide <strong>dove</strong> compaiono i figli
            con <code>{'<Outlet />'}</code>, e i path dei figli si aggiungono a quello del padre. È così che si costruiscono
            i layout: header, sidebar o tab restano fermi mentre cambia solo il contenuto.
          </p>
          <ul>
            <li>
              <strong>Route index</strong> (<code>index</code>): il figlio di default, mostrato all'URL del padre (
              <code>/dashboard</code>).
            </li>
            <li>
              <strong>Layout route</strong>: una route <strong>senza <code>path</code></strong>. Aggiunge un layout ai figli
              senza aggiungere segmenti all'URL.
            </li>
            <li>
              <strong>Prefisso</strong>: una route con <code>path</code> ma <strong>senza <code>element</code></strong>.
              Aggiunge un segmento all'URL senza layout.
            </li>
            <li>
              <strong>Link relativi</strong>: dentro una route annidata, <code>to=&quot;settings&quot;</code> (senza{' '}
              <code>/</code> iniziale) si risolve rispetto alla route corrente, e <code>to=&quot;..&quot;</code> risale di
              un livello.
            </li>
          </ul>
        </Prose>
        <Example title="Sito → Dashboard → pagine" code={dashboardAppSrc} file={`${DIR}/nested/DashboardApp.tsx`}>
          <NestedDemo />
        </Example>
        <Table
          head={['URL', 'Componenti renderizzati (dall’esterno verso l’interno)']}
          rows={[
            ['`/`', '`SiteLayout` → `Home`'],
            ['`/dashboard`', '`SiteLayout` → `DashboardLayout` → `Overview` (index)'],
            ['`/dashboard/settings`', '`SiteLayout` → `DashboardLayout` → `Settings`'],
            ['`/dashboard/xyz`', '`SiteLayout` → `DashboardLayout` → `DashboardNotFound` (404 locale)'],
            ['`/xyz`', '`SiteLayout` → `NotFound` (404 globale)'],
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="parametri" title="Parametri dinamici">
        <Prose>
          <p>
            Un segmento che inizia con <code>:</code> è un <strong>parametro</strong>: <code>/users/:userId</code>{' '}
            corrisponde a <code>/users/1</code>, <code>/users/42</code> e così via. Il valore si legge con{' '}
            <code>useParams()</code>.
          </p>
        </Prose>
        <Example title="Lista e dettaglio utenti da JSONPlaceholder" code={usersAppSrc} file={`${DIR}/params/UsersApp.tsx`}>
          <ParamsDemo />
        </Example>
        <Callout variant="warning" title="I parametri sono sempre stringhe">
          <p>
            <code>useParams()</code> restituisce stringhe, oppure <code>undefined</code>: <code>{"'42'"}</code>, non{' '}
            <code>42</code>. Convertili (<code>Number(userId)</code>) e <strong>validali</strong>, perché l'utente può
            scrivere qualsiasi cosa nella barra degli indirizzi. Prova <code>/users/abc</code> nella demo.
          </p>
        </Callout>
        <Table
          head={['Pattern', 'Corrisponde a', 'Parametri']}
          rows={[
            ['`/users/:userId`', '`/users/7`', '`{ userId: "7" }`'],
            ['`/c/:category/p/:productId`', '`/c/libri/p/99`', '`{ category: "libri", productId: "99" }`'],
            ['`/:lang?/about`', '`/about`, `/it/about`', '`{ lang: undefined }` / `{ lang: "it" }` (opzionale)'],
            ['`/users/:id/edit?`', '`/users/7`, `/users/7/edit`', 'segmento statico opzionale'],
            ['`/files/*`', '`/files/a/b/c.txt`', '`{ "*": "a/b/c.txt" }` (splat: tutto il resto)'],
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="slug" title="Lo slug">
        <Prose>
          <p>
            Uno <strong>slug</strong> è la versione &quot;da URL&quot; di un testo: minuscolo, senza accenti, spazi
            sostituiti da trattini. <code>&quot;Città &amp; Caffè: 10 idee!&quot;</code> diventa{' '}
            <code>citta-caffe-10-idee</code>. Rende gli URL leggibili, condivisibili e migliori per i motori di ricerca:{' '}
            <code>/posts/3/ea-molestias-quasi</code> invece di <code>/posts/3</code>.
          </p>
        </Prose>
        <CodeBlock code={slugifySrc} language="ts" filename="src/shared/lib/slugify.ts" />
        <Prose>
          <h3>Id + slug: il pattern più robusto</h3>
          <p>
            Usare <strong>solo</strong> lo slug come chiave (<code>/posts/:slug</code>) crea due problemi: due titoli
            uguali producono lo stesso slug, e se il titolo cambia i vecchi link si rompono. Il pattern usato da molti siti
            (Stack Overflow, ad esempio) è mettere <strong>entrambi</strong>: l'id trova il contenuto, lo slug è
            decorativo. Se lo slug manca o è vecchio, si fa un redirect all'URL corretto, detto{' '}
            <strong>canonico</strong>.
          </p>
          <p>
            La demo si apre su <code>/posts/3</code>, senza slug: guarda la barra degli indirizzi correggersi da sola. Prova
            anche a scrivere uno slug sbagliato.
          </p>
        </Prose>
        <Example title="URL canonico con id e slug" code={postsAppSrc} file={`${DIR}/slug/PostsApp.tsx`}>
          <SlugDemo />
        </Example>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="query-string" title="Query string con useSearchParams">
        <Prose>
          <p>
            La query string (<code>?q=react&amp;page=2</code>) è il posto giusto per lo stato che deve sopravvivere al
            ricaricamento, essere <strong>condivisibile con un link</strong> e funzionare con indietro/avanti: ricerche,
            filtri, ordinamento, paginazione, tab selezionata.
          </p>
          <p>
            <code>useSearchParams()</code> funziona come <code>useState</code>, ma lo stato vive nell'URL: restituisce un{' '}
            <code>URLSearchParams</code> da leggere con <code>.get(&apos;q&apos;)</code> e una funzione per aggiornarlo.
            Nella demo cerca, cambia autore e pagina, poi usa indietro e avanti: ogni stato è un URL.
          </p>
        </Prose>
        <Example title="Ricerca, filtro e paginazione nell'URL" code={postsSearchSrc} file={`${DIR}/search/PostsSearch.tsx`}>
          <SearchDemo />
        </Example>
        <Callout variant="danger" title="Più parametri? Un solo aggiornamento">
          <p>
            <code>setSearchParams</code> sostituisce tutta la query string. Due chiamate di fila, come{' '}
            <code>setQ(&apos;x&apos;)</code> e poi <code>setPage(&apos;1&apos;)</code>, non si sommano: la seconda parte
            dall'URL vecchio e cancella la prima. Per questo la demo ha un solo <code>updateParams()</code>, che copia i
            parametri esistenti e applica tutte le modifiche insieme.
          </p>
        </Callout>
        <Callout variant="tip">
          <p>
            Mentre l'utente scrive, aggiorna con <code>{'{ replace: true }'}</code>: altrimenti ogni lettera diventa una
            voce della cronologia, e &quot;indietro&quot; toglie un carattere alla volta. Tutto il resto (risultati,
            numero di pagine) si <strong>deriva</strong> dai parametri, senza stato duplicato.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="navigazione" title="Navigare da codice">
        <Prose>
          <p>
            Per la navigazione che parte dall'utente usa <code>{'<Link>'}</code>: è accessibile, funziona con
            &quot;apri in nuova scheda&quot; e con il tasto destro. Per la navigazione che parte dal{' '}
            <strong>codice</strong> ci sono:
          </p>
        </Prose>
        <Table
          head={['API', 'Quando', 'Esempio']}
          rows={[
            ['`useNavigate()`', 'In un event handler, dopo un’operazione', '`navigate("/created", { state: { post } })`'],
            ['`navigate(-1)` / `navigate(1)`', 'Come i pulsanti indietro/avanti del browser', '`<Button onClick={() => navigate(-1)}>`'],
            ['`{ replace: true }`', 'La pagina corrente non deve restare nella cronologia', 'dopo un login, un redirect'],
            ['`<Navigate to="..." />`', 'Durante il render: redirect dichiarativo', '`if (!post) return <Navigate to="/" replace />`'],
            ['`useLocation()`', 'Leggere URL corrente e `state`', '`location.pathname`, `location.state`'],
          ]}
        />
        <Example title="Form → navigate con state → pagina di conferma" code={newPostAppSrc} file={`${DIR}/navigate/NewPostApp.tsx`}>
          <NavigateDemo />
        </Example>
        <Callout variant="warning" title="location.state non è permanente">
          <p>
            Lo <code>state</code> sopravvive a indietro/avanti e al ricaricamento della stessa voce, ma non esiste se
            l'utente apre l'URL da un link o da un'altra scheda. Prevedi sempre il caso <code>state === null</code>, come
            fa <code>Created</code> con un redirect. Per i dati che devono stare nell'URL usa parametri o query string.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="404" title="Pagine non trovate">
        <Prose>
          <p>Ci sono tre tipi di &quot;non trovato&quot;, da gestire in modi diversi:</p>
          <ol>
            <li>
              <strong>Nessuna route corrisponde all'URL</strong>: una route <code>path=&quot;*&quot;</code> in fondo,
              come in tutti gli esempi sopra. In queste note è <code>NotFoundPage</code>: prova{' '}
              <Link to="/pagina-inesistente">/pagina-inesistente</Link>.
            </li>
            <li>
              <strong>404 locale</strong>: un <code>path=&quot;*&quot;</code> dentro una route annidata mantiene il layout
              del padre. Prova <code>/dashboard/xyz</code> nella demo delle route annidate.
            </li>
            <li>
              <strong>La route esiste ma il dato no</strong> (<code>/users/999</code>): il pattern corrisponde, quindi
              decide il componente. In modalità declarative mostri un messaggio quando la richiesta fallisce (demo dei
              parametri). In modalità data il loader lancia un errore 404 e lo gestisce l'<code>ErrorBoundary</code>
              della route (più sotto).
            </li>
          </ol>
        </Prose>
        <Callout variant="note" title="404 su un server vero">
          <p>
            In una SPA il server deve rispondere con <code>index.html</code> per <strong>qualsiasi</strong> URL, così
            l'app si carica e il router decide. Il server di sviluppo di Vite lo fa già. In produzione va configurato
            l'hosting (&quot;SPA fallback&quot; o &quot;rewrite&quot;), altrimenti ricaricando <code>/about</code> ottieni
            il 404 del server.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="protette" title="Route protette">
        <Prose>
          <p>
            Una route protetta mostra il contenuto solo all'utente autenticato. Il resto viene mandato al login, e{' '}
            <strong>dopo il login torna dove voleva andare</strong>. Il pattern ha tre pezzi:
          </p>
        </Prose>
        <Step n={1} title="Un componente guardia: RequireAuth">
          <Prose>
            <p>
              Legge <code>useAuth()</code> (pagina <Link to="/context#auth">Context</Link>). Se l'utente non è autenticato
              restituisce <code>{'<Navigate to="/login" replace state={{ from: location }} />'}</code>, salvando nello{' '}
              <code>state</code> la pagina richiesta. Senza <code>children</code> renderizza <code>{'<Outlet />'}</code>,
              così si usa come layout route.
            </p>
          </Prose>
          <CodeBlock code={requireAuthSrc} filename="src/features/auth/RequireAuth.tsx" />
        </Step>
        <Step n={2} title="Proteggi un gruppo di route">
          <Prose>
            <p>
              Una layout route senza <code>path</code> con <code>{'<RequireAuth />'}</code> protegge tutti i suoi figli:
              aggiungere una pagina protetta significa solo metterla lì dentro.
            </p>
          </Prose>
          <CodeBlock
            code={`<Route element={<RequireAuth />}>
  <Route path="orders" element={<Orders />} />
  <Route path="account" element={<AccountPage />} />
</Route>`}
          />
        </Step>
        <Step n={3} title="Dopo il login, torna alla pagina richiesta">
          <Prose>
            <p>
              La pagina di login legge <code>location.state.from</code> e, a login riuscito, chiama{' '}
              <code>{'navigate(from, { replace: true })'}</code>. Il <code>replace</code> toglie <code>/login</code> dalla
              cronologia: premendo indietro l'utente non ci torna.
            </p>
          </Prose>
          <CodeBlock code={loginPageSrc} filename="src/features/auth/LoginPage.tsx" />
        </Step>
        <Prose>
          <p>
            Nella demo apri &quot;Ordini&quot; da non autenticato, accedi con <code>Bret</code> e una password qualsiasi:
            torni direttamente agli ordini. La demo ha una sessione separata da quella delle note.
          </p>
        </Prose>
        <Example title="Login con ritorno alla pagina richiesta" code={protectedAppSrc} file={`${DIR}/protected/ProtectedApp.tsx`}>
          <ProtectedDemo />
        </Example>
        <Prose>
          <p>
            Gli stessi componenti proteggono una route vera di queste note: <Link to="/account">/account</Link>. Se non
            hai effettuato l'accesso ti porta a <code>/login</code>, poi torna lì. Trovi anche &quot;Accedi&quot; e
            &quot;Il mio account&quot; nel menu in alto a destra.
          </p>
        </Prose>
        <Callout variant="danger" title="La protezione lato client non è sicurezza">
          <p>
            <code>RequireAuth</code> nasconde le pagine, ma il codice JavaScript arriva comunque al browser e chiunque può
            modificarlo. La vera protezione è sul <strong>server</strong>: ogni API deve verificare il token o la
            sessione. Il guard del router serve all'esperienza utente, non alla sicurezza.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="data-mode" title="Modalità data: loader, action, errori">
        <Prose>
          <p>
            Nella modalità data le route sono oggetti passati a <code>createBrowserRouter</code>, e ogni route può avere un{' '}
            <strong>loader</strong>, che carica i dati prima di mostrare la pagina, e un <strong>action</strong>, che
            gestisce l'invio di un form. Il router coordina tutto: avvia i loader in parallelo, annulla quelli superati da
            una nuova navigazione, mostra lo stato di caricamento e ricarica i dati dopo un'action. Nei componenti
            spariscono <code>useEffect</code>, gli stati di loading e le race condition.
          </p>
        </Prose>
        <CodeBlock
          language="bash"
          filename="struttura"
          code={`users/
  loaders.ts      # 1. loader and action: plain async functions
  components.tsx  # 2. pages that read useLoaderData / useActionData
  routes.ts       # 3. route objects: path + loader + Component + ErrorBoundary
main.tsx          # 4. createBrowserRouter(routes) + <RouterProvider>`}
        />
        <Step n={1} title="Loader e action">
          <Prose>
            <ul>
              <li>
                Un <strong>loader</strong> riceve <code>{'{ params, request }'}</code> e restituisce i dati. Usa{' '}
                <code>request.signal</code> per annullare la richiesta se l'utente cambia pagina.
              </li>
              <li>
                Per un errore con status, lancia <code>{"data('Utente non trovato', { status: 404 })"}</code>.
              </li>
              <li>
                Un <strong>action</strong> riceve la <code>request</code> con i dati del form. Può restituire errori di
                validazione o <code>redirect()</code> a un'altra pagina.
              </li>
            </ul>
          </Prose>
          <CodeBlock code={dataLoadersSrc} language="ts" filename="users/loaders.ts" />
        </Step>
        <Step n={2} title="I componenti leggono i dati già pronti">
          <Prose>
            <ul>
              <li>
                <code>{'useLoaderData<typeof loader>()'}</code>: i dati del loader, tipizzati.
              </li>
              <li>
                <code>useNavigation().state</code>: <code>loading</code> o <code>submitting</code>, per spinner e pulsanti
                disabilitati.
              </li>
              <li>
                <code>{'<Form method="post">'}</code>: con la F maiuscola, invia i dati all'action della route.{' '}
                <code>useActionData()</code> restituisce quello che l'action ha restituito.
              </li>
              <li>
                <code>useRouteError()</code> + <code>isRouteErrorResponse()</code> nell'<code>ErrorBoundary</code>.
              </li>
            </ul>
          </Prose>
          <CodeBlock code={dataComponentsSrc} filename="users/components.tsx" />
        </Step>
        <Step n={3} title="Le route come oggetti">
          <Prose>
            <p>
              Stesse regole di <code>{'<Route>'}</code> (<code>path</code>, <code>index</code>, <code>children</code>), più
              le proprietà dei dati. <code>Component</code> riceve il componente, <code>element</code> il JSX già creato:
              sono equivalenti, e in un file <code>.ts</code> senza JSX si usa <code>Component</code>.
            </p>
          </Prose>
          <CodeBlock code={dataRoutesSrc} language="ts" filename="users/routes.ts" />
        </Step>
        <Step n={4} title="Crea il router e rendilo">
          <Prose>
            <p>
              Il router si crea <strong>una volta</strong>, fuori dai componenti, e si passa a{' '}
              <code>{'<RouterProvider>'}</code>. Nella v8 <code>RouterProvider</code> si importa da{' '}
              <code>react-router/dom</code>.
            </p>
          </Prose>
          <CodeBlock
            filename="src/main.tsx"
            code={`import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { dataRoutes } from './users/routes'

const router = createBrowserRouter(dataRoutes)

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />)`}
          />
        </Step>
        <Prose>
          <p>
            Prova: apri un utente e guarda lo stato <code>loading</code> a destra della barra degli indirizzi. La pagina
            vecchia resta visibile, sbiadita, finché quella nuova è pronta. Poi apri l'utente #999 per l'
            <code>ErrorBoundary</code>, e invia &quot;Nuovo post&quot; vuoto per gli errori dell'action.
          </p>
        </Prose>
        <Example title="Loader, action, pending UI ed error boundary" code={dataRoutesSrc} file={`${DIR}/data/routes.ts`}>
          <DataDemo />
        </Example>
        <Callout variant="note" title="Loader o TanStack Query?">
          <p>
            Non si escludono: il loader decide <strong>quando</strong> caricare (prima di mostrare la pagina), TanStack Query
            gestisce <strong>la cache</strong> (dati condivisi tra pagine, refetch in background, invalidazione). Spesso il
            loader chiama <code>queryClient.ensureQueryData(...)</code>. Lo vediamo nella pagina{' '}
            <Link to="/data-fetching">Data fetching</Link>.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="lazy" title="Code splitting con lazy">
        <Prose>
          <p>
            Ogni pagina di queste note è un file JavaScript separato, scaricato solo quando la visiti. In modalità data si
            usa la proprietà <code>lazy</code> della route: una funzione che importa il modulo e restituisce il componente
            (e, se serve, <code>loader</code>, <code>action</code> ed <code>ErrorBoundary</code>).
          </p>
          <p>
            Rispetto a <code>React.lazy</code> + <code>Suspense</code>, il router <strong>aspetta il codice prima di
            navigare</strong>: la pagina vecchia resta visibile mentre la nuova si scarica, senza lampi di spinner.
            Durante l'attesa <code>useNavigation().state</code> è <code>loading</code>, ed è così che funziona la sottile
            barra blu in cima allo schermo quando cambi pagina (<code>RootLayout.tsx</code>).{' '}
            <code>HydrateFallback</code> si mostra solo al primo caricamento.
          </p>
          <p>Questo è il router vero di queste note:</p>
        </Prose>
        <CodeBlock code={appRouterSrc} filename="src/app/router.tsx" />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="altro" title="Altri strumenti utili">
        <Prose>
          <h3>Titoli e breadcrumb con handle e useMatches</h3>
          <p>
            <code>handle</code> è un oggetto libero che metti su una route. <code>useMatches()</code> restituisce tutte le
            route che corrispondono all'URL corrente, dalla radice alla foglia, ognuna con il suo <code>handle</code>.
            Queste note lo usano per il titolo della scheda di <code>/login</code> e <code>/account</code>:
          </p>
        </Prose>
        <CodeBlock
          code={`// router.tsx
{ path: 'login', handle: { title: 'Accedi' }, lazy: ... }

// RootLayout.tsx
const title = useMatches()
  .map((match) => (match.handle as { title?: string } | undefined)?.title)
  .findLast(Boolean)

// Breadcrumbs: same idea, keep every title instead of the last one`}
        />
        <Prose>
          <h3>Bloccare la navigazione con modifiche non salvate</h3>
          <p>
            <code>useBlocker</code> (solo modalità data) intercetta le navigazioni interne dell'app e permette di chiedere
            conferma. Per la chiusura della scheda o il ricaricamento serve anche l'evento <code>beforeunload</code>.
          </p>
        </Prose>
        <CodeBlock
          code={`const blocker = useBlocker(isDirty) // or ({ currentLocation, nextLocation }) => boolean

{blocker.state === 'blocked' && (
  <ConfirmDialog
    message="Hai modifiche non salvate. Uscire comunque?"
    onConfirm={() => blocker.proceed()}
    onCancel={() => blocker.reset()}
  />
)}`}
        />
        <Prose>
          <h3>Costruire URL in modo sicuro</h3>
          <p>
            <code>generatePath</code> riempie un pattern con i parametri e fa l'encoding dei caratteri speciali. Evita le
            concatenazioni a mano, che si rompono con spazi e caratteri come <code>/</code> o <code>?</code>.
          </p>
        </Prose>
        <CodeBlock
          code={`import { generatePath } from 'react-router'

generatePath('/users/:userId/posts/:postId', { userId: '7', postId: '42' }) // "/users/7/posts/42"
generatePath('/files/*', { '*': 'docs/readme.md' })                          // "/files/docs/readme.md"`}
        />
        <Prose>
          <h3>Ripristino dello scroll</h3>
          <p>
            Cambiando pagina il browser non torna in cima da solo, perché tecnicamente è sempre la stessa pagina.{' '}
            <code>{'<ScrollRestoration />'}</code>, una volta nel layout radice (modalità data), porta in cima alle pagine
            nuove e ripristina la posizione quando torni indietro. Queste note lo usano in <code>RootLayout</code>.
          </p>
          <h3>Middleware</h3>
          <p>
            Nella v8 il middleware delle route è sempre attivo: funzioni che girano prima e dopo i loader di una route e
            dei suoi figli, utili per autenticazione o logging centralizzati (proprietà <code>middleware</code> della
            route). Per le SPA di questo progetto bastano i guard come <code>RequireAuth</code>, ma è bene sapere che
            esiste.
          </p>
        </Prose>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="test" title="Testare il routing">
        <Prose>
          <ul>
            <li>
              Componenti con <code>{'<Routes>'}</code> e link: avvolgili in <code>{'<MemoryRouter initialEntries={[\'/url\']}>'}</code>,
              un router che tiene la cronologia in memoria.
            </li>
            <li>
              Route in modalità data: <code>createMemoryRouter(routes, {'{ initialEntries }'})</code> +{' '}
              <code>{'<RouterProvider>'}</code>; puoi navigare con <code>router.navigate()</code> e leggere{' '}
              <code>router.state</code>.
            </li>
            <li>
              Per verificare un redirect, renderizza accanto all'app un piccolo componente che mostra{' '}
              <code>useLocation().pathname</code>.
            </li>
          </ul>
        </Prose>
        <CodeBlock code={routingTestSrc} filename={`${DIR}/__tests__/routing.test.tsx`} />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="riepilogo" title="Riepilogo">
        <Table
          head={['API', 'A cosa serve']}
          rows={[
            ['`<BrowserRouter>` / `createBrowserRouter` + `<RouterProvider>`', 'Attivano il router (declarative / data)'],
            ['`<Routes>`, `<Route path element>`', 'Collegano URL e componenti'],
            ['`<Link to>`, `<NavLink to end>`', 'Navigazione senza ricaricare; NavLink sa se è attivo'],
            ['`<Outlet />`', 'Dove compaiono le route figlie in un layout'],
            ['`index`, route senza `path`', 'Figlio di default; layout senza segmento nell’URL'],
            ['`:param`, `:param?`, `*`', 'Parametro, parametro opzionale, splat'],
            ['`useParams()`', 'Legge i parametri (sempre stringhe)'],
            ['`useSearchParams()`', 'Legge e scrive la query string'],
            ['`useNavigate()`, `<Navigate>`', 'Navigazione da codice / redirect durante il render'],
            ['`useLocation()`', 'URL corrente e `state`'],
            ['`loader` + `useLoaderData()`', 'Dati caricati prima del render'],
            ['`action` + `<Form>` + `useActionData()`', 'Invio di form gestito dal router'],
            ['`useNavigation()`', 'Stato: idle / loading / submitting'],
            ['`ErrorBoundary` + `useRouteError()`', 'Errori e 404 per route'],
            ['`lazy`', 'Code splitting per route'],
            ['`handle` + `useMatches()`', 'Metadati per route: titoli, breadcrumb'],
            ['`useBlocker()`', 'Conferma prima di uscire'],
            ['`MemoryRouter`, `createMemoryRouter`', 'Router per i test'],
          ]}
        />
      </Section>
    </Page>
  )
}
