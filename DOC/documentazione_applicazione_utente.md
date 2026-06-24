# Documentazione Tecnica - Ottagora User Application

Benvenuto nella documentazione della **Ottagora User Application**, l'applicazione front-end mobile-first dedicata agli utenti finali dell'hub multidisciplinare Ottagora. L'applicazione si integra direttamente con lo stesso database dell'applicazione di backoffice.

---

## 1. Obiettivi e Architettura

L'applicazione è progettata seguendo una filosofia **mobile-first** ed ispirata ai design pattern di **Apple (Light Theme)**. I cardini dello sviluppo sono:
- **Estetica Premium**: Vetro translucido (glassmorphism), ombreggiature morbide, accenti caldi ambra/arancio e contrasto tipografico elevato (font Geist Sans).
- **Integrazione Dati**: Condivisione in tempo reale del database SQLite (`dev.db`) con il backoffice tramite Prisma ORM.
- **UX Fluida**: Navigazione mobile tramite una dock-bar inferiore fluttuante (`BottomNav`) ed interazioni senza ricaricamento di pagina (Tab Client-Side in Area Riservata).

### Stack Tecnologico
- **Framework**: Next.js 16 (App Router & React Server Components)
- **Styling**: Tailwind CSS v4 con import nativo
- **Database**: Prisma Client v7 con Adapter `@prisma/adapter-better-sqlite3` per garantire la compatibilità multiprocesso su SQLite
- **Autenticazione**: NextAuth v5 (Auth.js) con Credenziali Mockate

---

## 2. Struttura del Database e Integrazione

L'applicazione condivide il file `dev.db` posizionato nella cartella radice del progetto. A causa delle limitazioni di Prisma 7 relative alle connessioni dirette SQLite concorrenti in ambiente serverless, viene inizializzato il client nel seguente modo:

```typescript
// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import sqlite from "better-sqlite3";

const dbPath = process.env.DATABASE_URL?.replace("file:", "") || "./dev.db";
const betterSqlite = new sqlite(dbPath);
const adapter = new PrismaBetterSqlite3(betterSqlite);

export const prisma = new PrismaClient({ adapter });
```

---

## 3. Mappa del Portale e Pagine Utente

### 🏠 Dashboard Principale (`/`)
La homepage rileva dinamicamente lo stato di login dell'utente:
- **Utente Anonimo**: Visualizza un'introduzione minimalista all'hub e l'elenco degli eventi in arrivo con la possibilità di prenotarsi.
- **Utente Autenticato**: Mostra un feed personalizzato delle attività attive (ultimi tavoli prenotati, aule approvate e lo stato delle candidature ai corsi).

### 📅 Eventi & Prenotazioni (`/events`)
- **Catalogo Eventi**: Elenco completo delle cene, degli eventi culturali o degli aperitivi.
- **Flusso Prenotazione (`/events/[id]/reserve`)**: Permette di prenotare un tavolo impostando slot orario, coperti e associando un menù specifico per l'evento.

### 🍽️ Menù & Dettaglio Allergeni (`/menus`)
- Presenta i menù fissi e alla carta di Ottagora.
- **Interazione Tap-to-Reveal**: Cliccando sulle singole portate si aprono pannelli di vetro translucido contenenti gli ingredienti dettagliati e l'evidenziazione grafica degli allergeni (senza glutine, lattosio, frutta a guscio, ecc.).

### 💼 Workspace & Aule Co-working (`/workspace`)
- Interfaccia per la prenotazione delle aule meeting e degli spazi di lavoro flessibili.
- **Calcolatore Tariffe in Tempo Reale**: Script client-side che moltiplica la tariffa oraria dell'aula selezionata per la durata in minuti, escludendo istantaneamente input non validi e mostrando il preventivo esatto prima dell'invio della richiesta.

### 🎓 Corsi & Formazione (`/courses`)
- Elenco dei percorsi formativi attivi.
- **Candidatura (`/courses/[id]/apply`)**: Consente l'invio del proprio profilo abbinato al caricamento (simulato) del CV in formato PDF.

### 📬 Richiesta Preventivi Custom (`/quote-request`)
- Form per eventi privati o aziendali (compleanni, feste aziendali, conferenze) con selezione della tipologia di evento, numero stimato di ospiti e servizi addizionali (catering, service audio, sale dedicate).

### 🧑‍💼 Area Personale (`/area-personale`)
La sezione dell'area riservata è stata ottimizzata per la massima efficienza d'uso tramite:
1. **Pannelli Statistici (KPI)**: Indicatori a comparsa per tracciare il numero di tavoli prenotati, aule richieste e corsi salvati.
2. **Tab Interattive (`DashboardTabs.tsx`)**: Navigazione client-side instantanea per filtrare le attività (*Tutte*, *Tavoli*, *Workspace*, *Corsi*).
3. **Materiale Didattico**: Sezione dedicata ai corsi con stato `ACCEPTED` (Iscritto), che abilita il download diretto delle risorse e delle slide fornite dai docenti.
4. **Prevenzione del Layout Break**: Istituzione di proprietà CSS `min-w-0` e troncamento dei testi con ellisse (`truncate`) per prevenire overflow orizzontali su display mobile piccoli, salvaguardando il posizionamento della barra di navigazione inferiore.

---

## 4. Linee Guida per il Design e la UX

### Gestione dei Colori (Apple Light Accent)
- **Sfondi**: Grigio caldissimo chiarissimo (`bg-slate-50/50` o `#f9f9fb`).
- **Pulsanti e Input**: Nessun bottone nero solido. Vengono usati gradienti che sfumano da ambra ad arancio (`from-amber-500 to-orange-650`) per le azioni principali e sfondi bianchi puri border-zinc per le azioni secondarie.
- **Vetri Translucidi**: Le card utilizzano la classe di utilità `.glass` definita in `globals.css`:
  ```css
  .glass {
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.02);
  }
  ```

### Dock Bottom Bar (`BottomNav`)
- Rimane ancorata in posizione `fixed bottom-6 left-1/2 -translate-x-1/2 z-50`.
- I contenuti principali delle pagine devono sempre includere un'altezza minima o un margine di distanziamento per evitare che il pulsante centrale copra testi o azioni primarie a fondo pagina (configurato tramite il `pb-28` sul tag `body`).

---

## 5. Avvio Rapido in Locale

1. **Installazione dipendenze**:
   ```bash
   npm install
   ```
2. **Generazione Client Prisma**:
   ```bash
   npx prisma generate
   ```
3. **Sincronizzazione Schema Database**:
   ```bash
   npx prisma db push
   ```
4. **Popolamento dati di Test (Seed)**:
   ```bash
   npx prisma db seed
   ```
5. **Avvio dell'ambiente di sviluppo**:
   ```bash
   npm run dev
   ```
6. **Compilazione per la produzione**:
   ```bash
   npm run build
   ```
