import { Link } from 'react-router'
import { Callout } from '@/docs/Callout'
import { CodeBlock, CodeCompare } from '@/docs/CodeBlock'
import { Example } from '@/docs/Example'
import { Page } from '@/docs/Page'
import { Prose, Section } from '@/docs/Section'
import { Step } from '@/docs/Step'
import { Table } from '@/docs/Table'
import formsTestSrc from './examples/__tests__/forms.test.tsx?raw'
import schemasTestSrc from './examples/__tests__/schemas.test.ts?raw'
import { SignInForm } from './examples/basic/SignInForm'
import signInFormSrc from './examples/basic/SignInForm.tsx?raw'
import signInSchemaSrc from './examples/basic/signInSchema.ts?raw'
import { InvoiceForm } from './examples/invoice/InvoiceForm'
import invoiceFormSrc from './examples/invoice/InvoiceForm.tsx?raw'
import invoiceLinesSrc from './examples/invoice/InvoiceLines.tsx?raw'
import invoiceSchemaSrc from './examples/invoice/invoiceSchema.ts?raw'
import { ReviewForm } from './examples/review/ReviewForm'
import reviewFormSrc from './examples/review/ReviewForm.tsx?raw'
import { SignupForm } from './examples/signup/SignupForm'
import signupFormSrc from './examples/signup/SignupForm.tsx?raw'
import signupSchemaSrc from './examples/signup/signupSchema.ts?raw'

const DIR = 'src/features/forms-validation/examples'

export default function FormsValidationPage() {
  return (
    <Page
      title="Form e validazione"
      lead="React Hook Form gestisce lo stato del form, Zod descrive i dati e le regole in uno schema da cui nascono anche i tipi TypeScript. Un resolver li collega."
    >
      {/* ------------------------------------------------------------------ */}
      <Section id="perche" title="Perché una libreria">
        <Prose>
          <p>
            Nella pagina <Link to="/form-base">Form con gli hook base</Link> abbiamo scritto un form completo con{' '}
            <code>useState</code> e un hook <code>useSimpleForm</code>. Funziona, ma con form grandi emergono i limiti:
            tutto il form si ri-renderizza a ogni tasto, campi annidati e liste dinamiche vanno scritti a mano, e il tipo
            dei valori e la funzione di validazione vanno tenuti allineati separatamente. Qui la divisione dei compiti è:
          </p>
        </Prose>
        <Table
          head={['Pezzo', 'Ruolo']}
          rows={[
            ['React Hook Form', 'Stato del form: valori, campi toccati, errori, invio. Usa input non controllati: niente re-render a ogni tasto.'],
            ['Zod', 'Schema dei dati: forma, regole e messaggi. Da qui si ricava il tipo TypeScript con `z.infer`.'],
            ['@hookform/resolvers', 'Il ponte: `zodResolver(schema)` fa validare il form da Zod.'],
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="installazione" title="Installazione e versioni">
        <CodeBlock language="bash" code="npm install react-hook-form zod @hookform/resolvers" />
        <Prose>
          <p>
            In questo progetto: <strong>React Hook Form 7.90</strong>, <strong>Zod 4.6</strong> e{' '}
            <strong>@hookform/resolvers 5.9</strong>, che supporta sia Zod 3 sia Zod 4 e ricava da solo i tipi dallo
            schema.
          </p>
          <h3>Zod 4: cosa cambia rispetto alla 3</h3>
          <p>
            Molte guide online sono ancora scritte per Zod 3. Nella 4 i formati di stringa sono diventati funzioni di
            primo livello, e il messaggio personalizzato si passa con <code>error</code> invece di <code>message</code>.
            Le forme vecchie funzionano ancora, ma sono deprecate.
          </p>
        </Prose>
        <CodeCompare
          language="ts"
          bad={`// Zod 3
z.string().email({ message: 'Email non valida' })
z.string().url()
z.string().min(8, { message: 'Almeno 8 caratteri' })`}
          good={`// Zod 4
z.email({ error: 'Email non valida' })
z.url()
z.string().min(8, { error: 'Almeno 8 caratteri' })`}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="primo-esempio" title="Primo esempio, passo per passo">
        <CodeBlock
          language="bash"
          filename="struttura"
          code={`sign-in/
  signInSchema.ts  # 1. Zod schema + type
  SignInForm.tsx   # 2. useForm + zodResolver + register`}
        />

        <Step n={1} title="Descrivi i dati con uno schema Zod">
          <Prose>
            <p>
              Lo schema dice <strong>com'è fatto</strong> il dato valido, con i messaggi d'errore. Da qui{' '}
              <code>z.infer</code> ricava il tipo TypeScript: c'è una sola fonte di verità, quindi non può succedere che
              tipo e validazione dicano cose diverse.
            </p>
          </Prose>
          <CodeBlock code={signInSchemaSrc} language="ts" filename="sign-in/signInSchema.ts" />
        </Step>

        <Step n={2} title="Collega il form con useForm">
          <Prose>
            <ul>
              <li>
                <code>{'useForm({ resolver: zodResolver(schema), defaultValues })'}</code> crea il form; i tipi arrivano
                dallo schema.
              </li>
              <li>
                <code>{"{...register('email')}"}</code> collega un input: restituisce <code>name</code>,{' '}
                <code>onChange</code>, <code>onBlur</code> e <code>ref</code>. Il valore resta nel DOM (input non
                controllato), e React Hook Form lo legge tramite il ref. In React 19 <code>ref</code> è una prop normale,
                quindi funziona anche con il nostro componente <code>Input</code>.
              </li>
              <li>
                <code>handleSubmit(onSubmit)</code> blocca il ricaricamento, valida e chiama <code>onSubmit</code> solo
                se è tutto valido, con dati già tipizzati.
              </li>
              <li>
                <code>formState.errors.email?.message</code> è il messaggio dello schema; <code>isSubmitting</code> resta{' '}
                <code>true</code> finché la promise di <code>onSubmit</code> non finisce.
              </li>
            </ul>
          </Prose>
          <CodeBlock code={signInFormSrc} filename="sign-in/SignInForm.tsx" />
        </Step>

        <Example title="Login con React Hook Form + Zod" code={signInFormSrc} file={`${DIR}/basic/SignInForm.tsx`}>
          <SignInForm />
        </Example>
        <Prose>
          <p>
            Premi &quot;Accedi&quot; con i campi vuoti: compaiono i messaggi dello schema e il focus va sul primo campo
            sbagliato, senza codice in più. Per default la validazione parte all'invio, poi si ripete a ogni modifica dei
            campi con errore.
          </p>
        </Prose>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="zod" title="Zod in breve">
        <Table
          head={['Schema', 'Accetta']}
          rows={[
            ['`z.string().trim().min(2).max(50)`', 'Stringa, spazi esterni tolti, lunghezza 2–50'],
            ['`z.email()`, `z.url()`, `z.uuid()`', 'Formati di stringa (Zod 4: funzioni di primo livello)'],
            ['`z.string().regex(/^[a-z]+$/)`', 'Stringa che rispetta un’espressione regolare'],
            ['`z.number().int().min(0)`', 'Numero intero ≥ 0 (rifiuta `NaN`)'],
            ['`z.coerce.number()`', 'Converte l’input in numero prima di validarlo (`"42"` → `42`)'],
            ['`z.boolean()`', '`true` / `false`'],
            ['`z.enum(["a", "b"])`', 'Uno dei valori elencati'],
            ['`z.literal("")`', 'Esattamente quel valore'],
            ['`z.union([a, b])`', 'Valido se lo è almeno uno dei due'],
            ['`z.array(schema).min(1)`', 'Array di elementi validi, almeno uno'],
            ['`z.object({ ... })`', 'Oggetto con quei campi (quelli in più vengono scartati)'],
            ['`.optional()`, `.nullable()`, `.default(x)`', 'Ammette `undefined`, `null`, o usa un valore di default'],
            ['`.refine(fn, { error, path })`', 'Regola personalizzata, anche tra più campi'],
          ]}
        />
        <Prose>
          <p>
            Uno schema si usa anche fuori dai form. <code>schema.parse(dati)</code> restituisce i dati validati o lancia
            un errore; <code>schema.safeParse(dati)</code> restituisce <code>{'{ success, data, error }'}</code> senza
            lanciare. Un uso molto pratico è <strong>validare le risposte delle API</strong>: se il backend cambia formato,
            te ne accorgi subito, con un errore chiaro, invece che con un <code>undefined</code> che salta fuori tre
            componenti più in là.
          </p>
        </Prose>
        <CodeBlock
          language="ts"
          code={`const UserSchema = z.object({ id: z.number(), name: z.string(), email: z.email() })
type User = z.infer<typeof UserSchema>

async function getUser(id: number): Promise<User> {
  const json = await request<unknown>(\`/users/\${id}\`)
  return UserSchema.parse(json) // throws if the API returns something unexpected
}`}
        />
        <Callout variant="note" title="z.infer, z.input, z.output">
          <p>
            Di solito input e output di uno schema coincidono. Si differenziano con trasformazioni e coercizioni:{' '}
            <code>z.coerce.number()</code> accetta qualsiasi cosa in input (<code>z.input</code>) e restituisce un numero
            (<code>z.output</code>, uguale a <code>z.infer</code>). <code>zodResolver</code> lo gestisce da solo: il form
            contiene il tipo di input, <code>onSubmit</code> riceve quello di output.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="confronto" title="Lo stesso form di registrazione, con React Hook Form">
        <Prose>
          <p>
            Lo stesso form della pagina <Link to="/form-base#form-completo">Form con gli hook base</Link>, più password e
            conferma. Lo schema sostituisce la funzione <code>validateSignup</code> e il tipo <code>SignupValues</code>{' '}
            scritti a mano:
          </p>
        </Prose>
        <CodeBlock code={signupSchemaSrc} language="ts" filename={`${DIR}/signup/signupSchema.ts`} />
        <Callout variant="warning" title="refine tra più campi e l'opzione when">
          <p>
            Zod esegue i <code>refine</code> di un oggetto solo se <strong>tutti</strong> i campi sono validi. Senza{' '}
            <code>when</code>, &quot;le password non coincidono&quot; comparirebbe solo dopo aver sistemato ogni altro
            errore del form. <code>when</code> dice a Zod di eseguire la regola appena i due campi di password sono validi.
          </p>
        </Callout>
        <Prose>
          <p>Da provare nella demo:</p>
          <ul>
            <li>
              <code>{"mode: 'onTouched'"}</code>: un campo viene validato quando lo lasci, poi a ogni modifica;
            </li>
            <li>
              username <code>Bret</code>: il controllo sul server (JSONPlaceholder) lo trova già usato, e{' '}
              <code>setError</code> mette l'errore sul campo e ci sposta il focus;
            </li>
            <li>
              &quot;Simula errore 500&quot;: un errore non legato a un campo, in <code>errors.root.server</code>;
            </li>
            <li>
              il contatore della bio usa <code>useWatch</code>, che ri-renderizza solo quando cambia quel campo;
            </li>
            <li>
              l'invio passa da una <code>useMutation</code> di TanStack Query: il form valida, la mutation salva.
            </li>
          </ul>
        </Prose>
        <Example title="Registrazione con React Hook Form, Zod e useMutation" code={signupFormSrc} file={`${DIR}/signup/SignupForm.tsx`}>
          <SignupForm />
        </Example>
        <Table
          head={['', '`useSimpleForm` (fatto a mano)', 'React Hook Form + Zod']}
          rows={[
            ['Regole', 'Funzione `validate(values)` con `if`', 'Schema dichiarativo'],
            ['Tipi', 'Tipo scritto a parte', '`z.infer<typeof schema>`'],
            ['Re-render', 'Tutto il form a ogni tasto', 'Solo dove serve (errori, `useWatch`)'],
            ['Errori dal server', 'Solo un messaggio generale', '`setError` su un campo o su `root`'],
            ['Liste dinamiche, campi annidati', 'Da scrivere', '`useFieldArray`, `register("a.b.c")`'],
            ['Componenti non nativi', 'Da collegare a mano', '`<Controller>`'],
            ['Dipendenze', 'Nessuna', 'Due librerie + resolver'],
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="modalita" title="Quando validare: mode">
        <Table
          head={['`mode`', 'Prima validazione di un campo']}
          rows={[
            ['`onSubmit` (default)', 'Al primo invio'],
            ['`onBlur`', 'Quando l’utente lascia il campo'],
            ['`onTouched`', 'Al primo blur, poi a ogni modifica (il buon compromesso visto nella pagina sui form base)'],
            ['`onChange`', 'A ogni tasto: più render, messaggi anche mentre l’utente sta ancora scrivendo'],
            ['`all`', 'Blur e change'],
          ]}
        />
        <Prose>
          <p>
            Dopo il primo invio conta <code>reValidateMode</code> (default <code>onChange</code>): un campo con errore
            viene ricontrollato a ogni modifica, così il messaggio sparisce appena il valore diventa valido.
          </p>
        </Prose>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="controller" title="Componenti controllati: Controller">
        <Prose>
          <p>
            <code>register</code> funziona con gli input nativi, perché legge il valore dal DOM. Un componente con{' '}
            <code>value</code> e <code>onChange</code> propri, come un selettore a stelle, un date picker o una select di
            una libreria UI, si collega con <code>{'<Controller>'}</code>. La sua funzione <code>render</code> riceve{' '}
            <code>field</code> (<code>value</code>, <code>onChange</code>, <code>onBlur</code>, <code>ref</code>) e{' '}
            <code>fieldState</code> (con <code>error</code>).
          </p>
          <p>
            <code>StarRating</code> (<code>src/shared/ui/StarRating.tsx</code>) è un componente riutilizzabile di questo
            tipo: inoltra <code>ref</code> alla prima stella, così React Hook Form ci può spostare il focus in caso di
            errore.
          </p>
        </Prose>
        <Example title="Recensione con stelle (Controller) e commento (register)" code={reviewFormSrc} file={`${DIR}/review/ReviewForm.tsx`}>
          <ReviewForm />
        </Example>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="field-array" title="Liste dinamiche: useFieldArray">
        <Prose>
          <p>
            Per un numero variabile di righe (voci di una fattura, contatti, indirizzi) c'è <code>useFieldArray</code>:
            restituisce <code>fields</code> da mostrare e le funzioni <code>append</code>, <code>remove</code>,{' '}
            <code>insert</code>, <code>move</code>. Ogni campo si registra con un percorso:{' '}
            <code>{'register(`lines.${index}.price`)'}</code>.
          </p>
          <ul>
            <li>
              Come <code>key</code> usa <code>field.id</code>, generato da React Hook Form, e{' '}
              <strong>non l'indice</strong> (pagina <Link to="/performance#liste">Performance</Link>).
            </li>
            <li>
              Per i numeri, <code>{'{ valueAsNumber: true }'}</code> converte il testo dell'input in numero, e un campo
              vuoto diventa <code>NaN</code>, che <code>z.number()</code> rifiuta.
            </li>
            <li>
              <code>{'<FormProvider>'}</code> + <code>useFormContext()</code> permettono di spezzare un form grande in
              sotto-componenti senza passare <code>register</code> e <code>control</code> come props: è un Context.
            </li>
            <li>
              <code>useWatch</code> calcola il totale in tempo reale.
            </li>
          </ul>
        </Prose>
        <Example title="Fattura con righe dinamiche" code={invoiceFormSrc} file={`${DIR}/invoice/InvoiceForm.tsx`}>
          <InvoiceForm />
        </Example>
        <div className="grid gap-4 xl:grid-cols-2">
          <CodeBlock code={invoiceLinesSrc} filename={`${DIR}/invoice/InvoiceLines.tsx`} />
          <CodeBlock code={invoiceSchemaSrc} language="ts" filename={`${DIR}/invoice/invoiceSchema.ts`} />
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="server" title="Errori dal server e validazione asincrona">
        <Prose>
          <p>Alcune regole si possono verificare solo sul server (username libero, codice sconto valido). Due modi:</p>
          <ol>
            <li>
              <strong>All'invio</strong>, con <code>setError</code>: è quello usato nella demo di registrazione. Il
              server risponde, tu metti l'errore sul campo giusto. Va sempre previsto, perché il server ha l'ultima
              parola.
            </li>
            <li>
              <strong>Nello schema</strong>, con un <code>refine</code> asincrono: l'errore compare prima dell'invio, ma
              ogni validazione fa una richiesta. Ha senso con <code>{"mode: 'onBlur'"}</code>, non con{' '}
              <code>onChange</code>.
            </li>
          </ol>
        </Prose>
        <CodeBlock
          language="ts"
          code={`// 1. On submit (always needed: the server has the last word)
setError('username', { type: 'server', message: 'Username già in uso' }, { shouldFocus: true })
setError('root.server', { message: 'Servizio non disponibile' }) // not tied to a field → errors.root.server

// 2. In the schema: async refine (one request per validation)
const schema = z.object({
  username: z.string().refine(async (username) => !(await findUserByUsername(username)), {
    error: 'Username già in uso',
  }),
})`}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="test" title="Testare form e schemi">
        <Prose>
          <p>
            Gli schemi si testano come funzioni pure, con <code>safeParse</code>. I form si testano come li usa l'utente:
            si scrive nei campi trovati tramite etichetta, si clicca, si controllano messaggi e focus.
          </p>
        </Prose>
        <CodeBlock code={schemasTestSrc} language="ts" filename={`${DIR}/__tests__/schemas.test.ts`} />
        <CodeBlock code={formsTestSrc} filename={`${DIR}/__tests__/forms.test.tsx`} />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="riepilogo" title="Riepilogo">
        <Table
          head={['API', 'A cosa serve']}
          rows={[
            ['`z.object({...})`, `z.infer<typeof schema>`', 'Schema dei dati e tipo ricavato'],
            ['`useForm({ resolver: zodResolver(schema), defaultValues, mode })`', 'Crea il form validato dallo schema'],
            ['`register("campo", { valueAsNumber })`', 'Collega un input nativo'],
            ['`handleSubmit(onSubmit)`', 'Valida e invia con dati tipizzati'],
            ['`formState: { errors, isSubmitting, isDirty }`', 'Errori e stato del form'],
            ['`setError(name | "root.x")`, `reset()`', 'Errori dal server, ritorno ai valori iniziali'],
            ['`<Controller>`', 'Componenti controllati non nativi'],
            ['`useFieldArray`', 'Liste di campi dinamiche'],
            ['`useWatch`', 'Leggere valori in tempo reale con render mirati'],
            ['`<FormProvider>` + `useFormContext()`', 'Spezzare un form grande in sotto-componenti'],
            ['`.refine(fn, { path, when })`', 'Regole tra più campi'],
            ['`schema.safeParse(dati)`', 'Validare dati qualsiasi, anche le risposte delle API'],
          ]}
        />
      </Section>
    </Page>
  )
}
