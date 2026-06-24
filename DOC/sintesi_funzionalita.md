# Documento di Sintesi Utenti e Funzionalità - Ottagora

## Abstract
Il progetto Ottagora formalizza le funzionalità utente e il modello delle entità per la web app. A livello architetturale, è stato deciso di sviluppare integralmente sia il front-end che il back-office, senza integrare le funzioni di back-office in Odoo. In questa fase, alcune funzionalità legate a delivery e take-away non sono mappate.

**Fase di Design (Attuale)**: Per agevolare il lavoro del team di design, il back-office è attualmente configurato con un approccio "mock":
- **Database**: Utilizza Prisma con un file SQLite locale (`dev.db`), senza necessità di configurare server PostgreSQL.
- **Autenticazione**: Utilizza `next-auth` con un provider fittizio. È possibile testare i diversi ruoli semplicemente inserendo una mail parlante nel login (es. `admin@ottagora.com` sblocca i poteri da SuperAdmin, `host@ottagora.com` da Host Manager, ecc.).

## Ruoli Utente
- **User**: Accesso previa registrazione ai servizi in app, differenziato per tipologia (Privato/Azienda).
- **Host Manager**: Gestione sale eventi/multi-spazio e prenotazioni.
- **Restaurant Manager**: Gestione sale eventi/multi-spazio, menu e prenotazioni.
- **Training Manager**: Gestione sale formazione, corsi e partecipanti.
- **Teacher**: Gestione materiali didattici.
- **Event Manager**: Gestione eventi (creazione/modifica), prenotazioni evento, accoglienza (desk/check-in) e sale.
- **Administration**: Gestione amministrativa.
- **Rider**: Gestione consegne.

## Funzionalità Front-Desk

### Utente senza registrazione:
- Navigazione sezioni sito istituzionale (menu, calendario eventi).
- Richiesta re-call per prenotazione evento.
- Registrazione.

### Utente con Login:
- Prenotazione Tavolo.
- Prenotazione Sala Riunione.
- Prenotazione Accesso for Work.
- Candidatura Corso di Formazione.

### Area Personale:
- Visualizzazione storico prenotazioni/corsi.
- Interazione con le prenotazioni.
- Download materiali corsi (se disponibili).
- Modifica informazioni personali.

## Funzionalità Back-Office (Matrice Ruoli)
| Funzionalità | SuperAdmin | Host | R.M. | T.M. | E.M. | Teacher | Ad. | Rider |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Gestione Utenti | X | | | | | | | |
| Configurazione Calendario | X | | | | | | | |
| Gestione Template Sala | X | X | X | X | X | | | |
| Allocazione Prenotazioni Tavoli | X | X | X | | X | | | |
| Caricamento / Gestione Food | X | | X | | | | | |
| Caricamento / Gestione Beverage | X | | X | | | | | |
| Creazione / Gestione Menu | X | | X | | | | | |
| Creazione / Gestione Evento | X | X | X | | X | | | |
| Gestione Take Away | X | | X | | | | | |
| Gestione Delivery | X | | X | | | | | |
| Gestione Prenotazioni Accesso for Work | X | X | | | X | | | |
| Gestione Prenotazioni Sale Riunioni | X | X | | | X | | | |
| Creazione / Gestione Corsi Formazione | X | | | X | | | | |
| Gestione Partecipanti Corsi Formazione | X | | | X | | | | |
| Gestione Allocazione Eventi | X | X | X | | X | | | |
| Gestione Teacher | X | | | X | | | | |
| Caricamento Materiali | X | | | X | | X | | |
| Gestione Fatturazione | X | | | | | | X | |
| Gestione Consegne | X | | | | | | | X |

## Schema Entità e Relazioni
Il sistema si basa sulle seguenti entità principali:
- **Slot Calendario**: Tipologia (Evento/Riunione/Lezione), Data inizio/fine, Ora inizio/fine, Sala, Stato Pubblicazione.
- **Evento**: Nome, Descrizione, Tipologia, Immagine, Fascia oraria, Data, Sala, Menu, Costo, Note.
- **Menu**: Nome, Tipologia dieta, Fascia oraria (Breakfast/Lunch/Dinner), selezione multipla Food + Beverage, Costo, Immagine.
- **Food**: Nome, Ingredienti, Allergeni, Quantità, Unità, Immagine.
- **Beverage**: Nome, Ingredienti, Allergeni, Quantità, Unità, Immagine.
- **Service Tecnico**: Nome, Descrizione, Stato (Disponibile/Manutenzione). *Il service tecnico è incluso nel prezzo dell'evento o della sala riunioni e non ha un costo proprio.*
- **Sala**: Nome, Tipologia (Formazione/Riunione/Multi-Spazio), Giorni di apertura settimanali, Fasce orarie, Eccezioni calendario, Capienza Massima, Template, Costo orario (solo per Sale Riunioni).
- **Corso**: Nome, Descrizione, Tipologia, Teacher, Date, Durata totale, Numero lezioni, Giorno/Fascia oraria, Ricorrenza, Immagine, Costo, Max partecipanti, Sala, Materiali.
- **Lezione**: Corso di riferimento, Descrizione, Tipologia, Teacher, Data, Fascia oraria, Durata, Sala.
- **Anagrafica**: Ruolo, Nome, Cognome, Telefono, Mail, Bio (solo Teacher), Tipologia (Privato/Azienda), Buoni pasto, Dieta, Indirizzi (Residenza/Spedizione/Fatturazione).

## Notifiche Push
- **User**: Prenotazione Confermata/Modificata/Annullata, Reminder, Posti/Materiali disponibili, Stato Ordine.
- **Restaurant Manager**: Nuova Prenotazione, Annullata, Modificata.
- **Host Manager**: Nuova Prenotazione, Annullata, Richiesta preventivo, Sala libera.
- **Rider**: Nuova consegna, Ordine pronto, Consegna conclusa.

## Gerarchia e Priorità Sale
Il **Training Manager** ha priorità assoluta rispetto a Host Manager e Restaurant Manager per l'utilizzo delle sale di tipologia **Formazione**. Quando il Training Manager occupa una sala formazione, il sistema:
1. Verifica l'eventuale presenza di prenotazioni preesistenti di HM o RM su quella sala e fascia oraria.
2. Segnala i conflitti al Training Manager.
3. Permette la cancellazione degli slot in conflitto (override automatico).
4. Notifica (mock) Host Manager e/o Restaurant Manager della cancellazione.

---

**Collaudo e giro demo:** vedi [`giro_completo_sistema.md`](./giro_completo_sistema.md) (preparazione ambiente, script presentazione, checklist manuale).

**Documentazione tecnica (architettura, API, dati, codice):** vedi [`documentazione_tecnica.md`](./documentazione_tecnica.md).
