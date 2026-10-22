import { Link } from 'react-router'
import { Callout } from '@/docs/Callout'
import { CodeBlock, CodeCompare } from '@/docs/CodeBlock'
import { Example } from '@/docs/Example'
import { Page } from '@/docs/Page'
import { Prose, Section } from '@/docs/Section'
import { Step } from '@/docs/Step'
import { Table } from '@/docs/Table'
import useSimpleFormSrc from '@/shared/hooks/useSimpleForm.ts?raw'
import fieldSrc from '@/shared/ui/Field.tsx?raw'
import fieldAttributesSrc from '@/shared/ui/fieldAttributes.ts?raw'
import { ContactForm } from './examples/basic/ContactForm'
import contactFormSrc from './examples/basic/ContactForm.tsx?raw'
import { ControlledInput } from './examples/ControlledInput'
import controlledInputSrc from './examples/ControlledInput.tsx?raw'
import { MultiFieldState } from './examples/MultiFieldState'
import multiFieldStateSrc from './examples/MultiFieldState.tsx?raw'
import { SignupForm } from './examples/SignupForm'
import signupFormSrc from './examples/SignupForm.tsx?raw'
import signupValidationSrc from './examples/signupValidation.ts?raw'
import signupFormTestSrc from './examples/__tests__/SignupForm.test.tsx?raw'
import { UncontrolledForm } from './examples/UncontrolledForm'
import uncontrolledFormSrc from './examples/UncontrolledForm.tsx?raw'
import { ValidationTiming } from './examples/ValidationTiming'
import validationTimingSrc from './examples/ValidationTiming.tsx?raw'

const DIR = 'src/features/form-base/examples'

export default function FormBasePage() {
  return (
    <Page
      title="Form con gli hook base"
      lead="Un form completo con useState: input controllati, un solo stato per tutti i campi, validazione derivata, invio asincrono e accessibilità. Poi tutto racchiuso in un hook riutilizzabile."
    >
      {/* ------------------------------------------------------------------ */}
      <Section id="primo-esempio" title="Primo esempio, passo per passo">
        <Prose>
          <p>
            Un form di contatto con tre campi, scritto con il solo <code>useState</code>. Tre passi, tutti nello stesso
            file:
          </p>
        </Prose>

        <Step n={1} title="Uno stato per ogni campo">
          <Prose>
            <p>Ogni campo del form è un valore che cambia: quindi è stato. Si parte sempre da una stringa vuota.</p>
          </Prose>
          <CodeBlock
            code={`const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [message, setMessage] = useState('')`}
          />
        </Step>

        <Step n={2} title="Collega ogni input al suo stato">
          <Prose>
            <p>
              <code>value</code> fa mostrare all'input il valore dello stato; <code>onChange</code> aggiorna lo stato a
              ogni tasto. È un <strong>input controllato</strong>: React è l'unica fonte di verità.
            </p>
          </Prose>
          <CodeBlock code={`<Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} />`} />
        </Step>

        <Step n={3} title="Gestisci l'invio">
          <Prose>
            <p>
              Il form chiama <code>onSubmit</code> sia con il pulsante <code>type=&quot;submit&quot;</code> sia premendo
              Invio. <code>event.preventDefault()</code> impedisce al browser di ricaricare la pagina; a quel punto i
              valori sono già nello stato, pronti da usare.
            </p>
          </Prose>
          <CodeBlock
            code={`function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
  sendMessage({ name, email, message })
}

<form onSubmit={handleSubmit}>...</form>`}
          />
        </Step>

        <Prose>
          <p>
            Ecco il componente completo. Il pulsante resta disabilitato finché nome ed email sono vuoti: è un valore{' '}
            <strong>derivato</strong> (<code>canSubmit</code>), calcolato dallo stato e non salvato a parte.
          </p>
        </Prose>
        <Example title="Form di contatto" code={contactFormSrc} file={`${DIR}/basic/ContactForm.tsx`}>
          <ContactForm />
        </Example>
        <Prose>
          <p>
            Il resto della pagina parte da qui e aggiunge un pezzo alla volta: un solo stato per tutti i campi, la
            validazione con i messaggi d'errore, l'invio asincrono a un'API vera e un hook riutilizzabile.
          </p>
        </Prose>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="controllati" title="Input controllati e non controllati">
        <Prose>
          <p>
            Un input è <strong>controllato</strong> quando il suo valore arriva dallo stato React (<code>value</code>) e
            ogni modifica passa da <code>onChange</code>. React è l'unica fonte di verità: puoi trasformare, limitare o
            validare il valore mentre l'utente scrive.
          </p>
        </Prose>
        <Example title="Input controllato con trasformazione" code={controlledInputSrc} file={`${DIR}/ControlledInput.tsx`}>
          <ControlledInput />
        </Example>
        <Prose>
          <p>
            Un input è <strong>non controllato</strong> quando il valore vive nel DOM: imposti solo quello iniziale con{' '}
            <code>defaultValue</code> e lo leggi quando serve, di solito all'invio con <code>FormData</code>. Meno codice e
            nessun re-render a ogni tasto, ma non puoi reagire al valore mentre cambia.
          </p>
        </Prose>
        <Example title="Form non controllato con FormData" code={uncontrolledFormSrc} file={`${DIR}/UncontrolledForm.tsx`}>
          <UncontrolledForm />
        </Example>
        <Table
          head={['', 'Controllato', 'Non controllato']}
          rows={[
            ['Valore', '`value` + `onChange`', '`defaultValue`, letto con `FormData` o un ref'],
            ['Re-render', 'A ogni tasto', 'Nessuno mentre si scrive'],
            ['Validazione live, campi dipendenti, formattazione', 'Sì', 'Difficile'],
            ['Ideale per', 'Form interattivi', 'Form semplici, `<form action>` di React 19'],
          ]}
        />
        <Callout variant="danger" title="Da controllato a non controllato">
          <p>
            <code>value={'{undefined}'}</code> rende l'input non controllato: se poi il valore diventa una stringa, React
            avvisa nella console. Inizializza sempre i campi con <code>''</code>, mai con <code>undefined</code> o{' '}
            <code>null</code>.
          </p>
        </Callout>
        <Callout variant="note" title="E le form action di React 19?">
          <p>
            React 19 permette di passare una funzione a <code>{'<form action={fn}>'}</code>, che riceve direttamente il{' '}
            <code>FormData</code>, insieme agli hook <code>useActionState</code> e <code>useFormStatus</code>. È
            l'approccio non controllato portato al massimo, e lo vediamo nella pagina{' '}
            <Link to="/advanced-hooks">Hook avanzati</Link>.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="piu-campi" title="Un solo stato per tutti i campi">
        <Prose>
          <p>
            Uno <code>useState</code> per campo diventa scomodo già con 4 o 5 campi. Meglio un unico oggetto e un solo
            handler: l'attributo <code>name</code> dell'input dice quale chiave aggiornare, mentre le checkbox usano{' '}
            <code>checked</code> invece di <code>value</code>.
          </p>
        </Prose>
        <CodeBlock
          code={`function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
  const { name, value } = event.target
  const isCheckbox = event.target instanceof HTMLInputElement && event.target.type === 'checkbox'
  setValues((prev) => ({ ...prev, [name]: isCheckbox ? (event.target as HTMLInputElement).checked : value }))
}`}
        />
        <Example title="Tutti i tipi di campo con un solo handler" code={multiFieldStateSrc} file={`${DIR}/MultiFieldState.tsx`}>
          <MultiFieldState />
        </Example>
        <Callout variant="tip" title="Numeri come stringhe">
          <p>
            Tieni anche i campi numerici come <strong>stringhe</strong> nello stato: l'utente deve poter cancellare tutto
            e scrivere da capo, e <code>Number('')</code> darebbe <code>0</code>. Converti a numero solo nella
            validazione e all'invio.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="validazione" title="Validazione">
        <Prose>
          <p>
            La regola più importante: <strong>gli errori non sono stato, si derivano</strong>. Scrivi una funzione pura{' '}
            <code>validate(values)</code> che restituisce un oggetto <code>{'{ campo: messaggio }'}</code> e chiamala
            durante il render. Così gli errori sono sempre coerenti con i valori, senza effetti né sincronizzazioni.
          </p>
        </Prose>
        <CodeCompare
          bad={`const [email, setEmail] = useState('')
const [error, setError] = useState('')

useEffect(() => {
  setError(isEmail(email) ? '' : 'Email non valida')
}, [email])`}
          good={`const [email, setEmail] = useState('')

// Always in sync, no extra render
const error = isEmail(email) ? undefined : 'Email non valida'`}
        />
        <Prose>
          <h3>Quando mostrare l'errore</h3>
          <p>
            Che un errore esista è una cosa, quando mostrarlo è un'altra. Mostrare &quot;email non valida&quot; mentre
            l'utente sta ancora scrivendo è fastidioso; aspettare l'invio è tardi. Prova le tre strategie:
          </p>
        </Prose>
        <Example title="Tre momenti per mostrare gli errori" code={validationTimingSrc} file={`${DIR}/ValidationTiming.tsx`}>
          <ValidationTiming />
        </Example>
        <Callout variant="tip" title="La combinazione che funziona meglio">
          <p>
            Mostra l'errore di un campo <strong>dopo che l'utente lo ha lasciato</strong> (stato <code>touched</code>,
            impostato in <code>onBlur</code>) oppure <strong>dopo il primo tentativo di invio</strong>. Da quel momento
            l'errore si aggiorna in tempo reale e sparisce appena il valore diventa valido. È quello che fa{' '}
            <code>getError</code> in <code>useSimpleForm</code>.
          </p>
        </Callout>
        <Prose>
          <p>
            Le regole del form completo stanno in un file a parte. Sono una funzione pura, quindi si testano senza
            renderizzare nulla, e le singole regole riusano i validatori di <code>src/shared/lib/validators.ts</code>:
          </p>
        </Prose>
        <CodeBlock code={signupValidationSrc} language="ts" filename={`${DIR}/signupValidation.ts`} />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="invio" title="Invio asincrono">
        <Prose>
          <p>Un invio fatto bene gestisce quattro cose:</p>
          <ol>
            <li>
              <code>event.preventDefault()</code>, altrimenti il browser ricarica la pagina.
            </li>
            <li>
              Se ci sono errori: niente richiesta, mostra tutti gli errori e <strong>sposta il focus</strong> sul primo
              campo non valido.
            </li>
            <li>
              Durante la richiesta: stato <code>isSubmitting</code>, pulsante disabilitato con un testo che spiega cosa sta
              succedendo, <strong>niente doppio invio</strong>.
            </li>
            <li>
              Alla fine: in caso di errore un messaggio leggibile con <code>role=&quot;alert&quot;</code>, letto anche dagli
              screen reader; in caso di successo un feedback e il reset del form.
            </li>
          </ol>
        </Prose>
        <CodeBlock
          code={`async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
  if (isSubmitting) return
  setIsSubmitted(true)

  if (!isValid) {
    focusFirstInvalid(event.currentTarget, Object.keys(errors))
    return
  }

  setIsSubmitting(true)
  setSubmitError(null)
  try {
    await onSubmit(values)
  } catch (error) {
    setSubmitError(error instanceof Error ? error.message : 'Invio non riuscito')
  } finally {
    setIsSubmitting(false)
  }
}`}
        />
        <Callout variant="note" title="noValidate">
          <p>
            Con <code>{'<form noValidate>'}</code> disattivi i fumetti di validazione nativi del browser (quelli di{' '}
            <code>required</code> o <code>type=&quot;email&quot;</code>), che hanno uno stile diverso in ogni browser, e
            mostri i tuoi messaggi. Gli attributi <code>type</code> e <code>autoComplete</code> restano utili: tastiera
            giusta su mobile e compilazione automatica.
          </p>
        </Callout>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="use-simple-form" title="Un hook riutilizzabile: useSimpleForm">
        <Prose>
          <p>
            Valori, campi toccati, errori derivati, invio, reset: è sempre lo stesso codice. Racchiuso in un custom hook
            diventa riutilizzabile in qualsiasi form semplice. Restituisce tre helper (<code>getFieldProps</code>,{' '}
            <code>getCheckboxProps</code>, <code>getRadioProps</code>) che collegano un campo con uno spread:
          </p>
        </Prose>
        <CodeBlock
          code={`const form = useSimpleForm({ initialValues, validate, onSubmit })

<form onSubmit={form.handleSubmit} noValidate>
  <Input label="Email" {...form.getFieldProps('email')} error={form.getError('email')} />
  <Checkbox label="Accetto" {...form.getCheckboxProps('terms')} error={form.getError('terms')} />
  <Button type="submit" disabled={form.isSubmitting}>Invia</Button>
</form>`}
        />
        <CodeBlock code={useSimpleFormSrc} language="ts" filename="src/shared/hooks/useSimpleForm.ts" />
        <Prose>
          <p>Alcune scelte da notare:</p>
          <ul>
            <li>
              <code>errors</code>, <code>isValid</code> e <code>isDirty</code> sono <strong>calcolati</strong>, non
              salvati nello stato.
            </li>
            <li>
              I nomi dei campi sono tipizzati: <code>{"getFieldProps('emial')"}</code> è un errore di compilazione, perché{' '}
              <code>keyof T</code> conosce solo le chiavi di <code>initialValues</code>.
            </li>
            <li>
              Il focus sul primo campo non valido segue l'<strong>ordine del DOM</strong>, non quello delle chiavi.
            </li>
          </ul>
        </Prose>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="form-completo" title="Il form completo">
        <Prose>
          <p>
            Registrazione di un utente su JSONPlaceholder (<code>POST /users</code>). Da provare:
          </p>
          <ul>
            <li>premi &quot;Registrati&quot; con il form vuoto: compaiono gli errori e il focus va sul primo campo;</li>
            <li>scrivi un'email incompleta e passa al campo successivo;</li>
            <li>
              usa lo username <code>admin</code>, oppure spunta &quot;Simula errore 500&quot;, per vedere un errore del
              server;
            </li>
            <li>
              compila tutto correttamente: vedrai la risposta dell'API con <code>id: 11</code>. JSONPlaceholder finge di
              salvare, ma non salva davvero.
            </li>
          </ul>
        </Prose>
        <Example title="Registrazione utente" code={signupFormSrc} file={`${DIR}/SignupForm.tsx`}>
          <SignupForm />
        </Example>
        <Prose>
          <p>
            Il form è coperto da test di integrazione che simulano l'utente e sostituiscono <code>fetch</code> con un mock,
            quindi non usano la rete:
          </p>
        </Prose>
        <CodeBlock code={signupFormTestSrc} filename={`${DIR}/__tests__/SignupForm.test.tsx`} />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="accessibilita" title="Accessibilità">
        <Prose>
          <p>
            I componenti <code>Input</code>, <code>Select</code>, <code>Textarea</code> e <code>Checkbox</code> di{' '}
            <code>src/shared/ui/</code> applicano le stesse regole attraverso un <code>Field</code> comune:
          </p>
          <ul>
            <li>
              ogni campo ha una <code>{'<label htmlFor>'}</code> collegata al suo <code>id</code>, generato con{' '}
              <code>useId</code> se non lo passi;
            </li>
            <li>
              un campo con errore ha <code>aria-invalid=&quot;true&quot;</code>;
            </li>
            <li>
              suggerimento o errore sono collegati al campo con <code>aria-describedby</code>, così lo screen reader li
              legge quando il campo riceve il focus;
            </li>
            <li>
              i gruppi di radio stanno in un <code>{'<fieldset>'}</code> con <code>{'<legend>'}</code>;
            </li>
            <li>
              l'errore generale del server ha <code>role=&quot;alert&quot;</code>.
            </li>
          </ul>
          <p>
            Un bonus: i test trovano i campi con <code>getByLabelText</code>, cioè come li trova un utente. Se il test
            funziona, anche l'etichetta è collegata correttamente.
          </p>
        </Prose>
        <div className="grid gap-4 xl:grid-cols-2">
          <CodeBlock code={fieldSrc} filename="src/shared/ui/Field.tsx" />
          <CodeBlock code={fieldAttributesSrc} language="ts" filename="src/shared/ui/fieldAttributes.ts" />
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section id="limiti" title="Limiti e prossimi passi">
        <Prose>
          <p>
            Questo approccio è ottimo per capire come funzionano i form e basta per form piccoli o medi. Con form grandi
            emergono i limiti:
          </p>
        </Prose>
        <Table
          head={['Problema', 'Con useState', 'Con React Hook Form + Zod']}
          rows={[
            ['Re-render', 'Tutto il form a ogni tasto', 'Solo i campi che cambiano (input non controllati)'],
            ['Campi annidati e array dinamici', 'Da scrivere a mano', '`register("address.city")`, `useFieldArray`'],
            ['Errori dal server su un campo', 'Stato extra a mano', '`setError("username", ...)`'],
            ['Tipi', 'Tipo dei valori + funzione `validate` separati', 'Un unico schema Zod: tipo e validazione insieme'],
          ]}
        />
        <Prose>
          <p>
            Nella pagina <Link to="/forms-validation">Form e validazione</Link> rifacciamo lo stesso form di registrazione
            con React Hook Form e Zod, così i due approcci si possono confrontare riga per riga.
          </p>
        </Prose>
      </Section>
    </Page>
  )
}
