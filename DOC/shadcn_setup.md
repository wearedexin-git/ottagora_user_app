# Guida all'Installazione e Configurazione di shadcn/ui

## Introduzione
**shadcn/ui** non è una tradizionale libreria di componenti distribuita tramite npm come pacchetto unico. Si tratta di una collezione di componenti accessibili e riutilizzabili che possono essere copiati e incollati (tramite CLI) direttamente nel codice sorgente del progetto. Questo approccio offre il controllo completo sul codice, lo stile e l'accessibilità di ogni singolo componente.

Per il progetto Ottagora, utilizzeremo **Next.js** (App Router) e **Tailwind CSS**, in quanto sono lo stack predefinito e maggiormente supportato da shadcn/ui.

---

## 1. Installazione (Metodo con Next.js)

Ci sono due modi per avviare un nuovo progetto con shadcn/ui:

### Opzione A: Usare `shadcn/create` (Consigliato per nuovi progetti)
Permette di costruire visivamente il preset (colori, font, ecc.) e genera il comando.
1. Visita [shadcn/create](https://ui.shadcn.com/create)
2. Seleziona Next.js e configura il tuo tema.
3. Esegui il comando generato, ad esempio:
   ```bash
   npx shadcn@latest init --preset [CODICE_GENERATO] --template next
   ```

### Opzione B: Inizializzazione Manuale con CLI
Se hai già un progetto o preferisci la riga di comando classica:

1. **Crea il progetto Next.js** (se non esiste):
   ```bash
   npx create-next-app@latest ottagora-web
   ```
   *Assicurati di selezionare "Yes" per Tailwind CSS, TypeScript e App Router.*

2. **Inizializza shadcn/ui**:
   Nel terminale, all'interno della cartella del progetto, esegui:
   ```bash
   npx shadcn@latest init
   ```
   Durante l'installazione, ti verranno poste delle domande:
   - **Style**: Scegli tra `Default` o `New York`.
   - **Base color**: Scegli un colore base (es. `Slate`, `Zinc`, `Neutral`).
   - **CSS variables**: `yes` (Fortemente consigliato per abilitare il theming).

---

## 2. Struttura del Progetto post-inizializzazione

Dopo aver eseguito il comando `init`, verranno creati/modificati i seguenti file:

- `components.json`: È il file di configurazione vitale per shadcn/ui. Dice alla CLI dove posizionare i componenti e quali alias TypeScript utilizzare.
- `app/globals.css`: Verrà popolato con le variabili CSS necessarie per il tema scelto (colori di base, muted, accent, destructive, border, ecc.).
- `lib/utils.ts`: Contiene la funzione `cn` fondamentale per unire le classi Tailwind senza conflitti (usa `clsx` e `tailwind-merge`).
- `tailwind.config.ts`: Aggiornato per includere le animazioni, i plugin e l'estensione del tema legata alle variabili CSS.

---

## 3. Aggiungere Componenti

A differenza delle librerie tradizionali, con shadcn aggiungi solo i componenti che ti servono realmente.

Per aggiungere un componente (es. Button o Card), usa la CLI:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

I componenti verranno salvati in `components/ui/` all'interno del progetto. A questo punto, il codice del componente è di tua proprietà e puoi modificarlo a piacimento.

### Utilizzo:
```tsx
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <Button variant="outline" size="lg">
      Clicca Qui
    </Button>
  )
}
```

---

## 4. Theming (Temi e Colori)

shadcn/ui gestisce i temi attraverso le **CSS Variables**. In `app/globals.css` troverai la radice `:root` (tema chiaro) e la classe `.dark` (tema scuro).

Per modificare il tema, puoi cambiare i valori HSL di queste variabili. 
Esempio:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 47.4% 11.2%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... altre variabili */
}
```

### Abilitare la Dark Mode
Se usi Next.js, per implementare lo switch tra tema chiaro e scuro si consiglia l'installazione di `next-themes`:
```bash
npm install next-themes
```
E creare un `ThemeProvider` in un file separato per wrappare la root del tuo layout.

---

## Best Practices per Ottagora

1. **Nuovo sistema `render` vs `asChild`**: In seguito ai recenti aggiornamenti di shadcn/ui (basati su `@base-ui/react`), molti componenti come `SidebarMenuButton` **non** usano più la prop `asChild` di Radix UI. Per incapsulare un link (es. in Next.js), utilizza la prop `render`:
   ```tsx
   // Sbagliato (vecchio metodo)
   <SidebarMenuButton asChild>
     <Link href="/dashboard">Dashboard</Link>
   </SidebarMenuButton>

   // Corretto (nuovo metodo)
   <SidebarMenuButton render={<Link href="/dashboard" />}>
     <span>Dashboard</span>
   </SidebarMenuButton>
   ```
2. **Non modificare i componenti in `ui/` se non strettamente necessario:** È meglio usare le prop `className` nei componenti superiori per piccole variazioni.
3. **Utilizza gli alias TypeScript:** Usa sempre import come `@/components/...`.
4. **Usa `lucide-react` per le icone:** È la libreria di icone predefinita.
5. **Validazione Form:** Utilizza `npx shadcn@latest add form` per configurare form solidi e validati con `react-hook-form` e `zod`.
