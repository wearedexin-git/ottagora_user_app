# User Stories - Progetto Ottagora

Questo documento riporta l'elenco completo delle User Stories (US) definite per i vari ruoli della piattaforma.

## 1. Host Manager (HM)

### Configurazione Spazi
- **US.HM.1.1 (Creazione Template)**: Come Host Manager, voglio assegnare per ogni Sala un "Template" specifico per determinarne la disposizione e la capienza numerica relativa.
- **US.HM.1.2 (Parametri Temporali)**: Come Host Manager, voglio impostare la "Fascia Oraria" di disponibilità per le sale eventi e riunioni per definire i limiti temporali entro cui gli utenti possono richiedere prenotazioni.
- **US.HM.1.3 (Configurazione Service Tecnico)**: Come Host Manager, voglio gestire le opzioni di "Service Tecnico" disponibili per le sale (nome, descrizione, stato disponibile/manutenzione), per consentirne l'associazione alle prenotazioni. *Il service tecnico è incluso nel prezzo dell'evento o della sala riunioni e non prevede un costo separato.*
- **US.HM.1.4 (Programmazione Settimanale)**: Come Host Manager, voglio definire i giorni della settimana in cui ogni Sala è disponibile, per inibire automaticamente le prenotazioni nei giorni di chiusura o per utilizzi interni.
- **US.HM.1.5 (Eccezioni al Calendario)**: Come Host Manager, voglio poter sovrascrivere la disponibilità settimanale per date specifiche, per marcare lo slot come "Non Disponibile" in caso di festività o manutenzioni.
- **US.HM.1.6 (Configurazione Slot Temporali)**: Come Host Manager, voglio incrociare il "Giorno della Settimana" con la "Fascia Oraria" per creare slot di prenotazione granulari e specifici per ogni sala.

### Gestione Richieste e Prenotazioni
- **US.HM.2.1 (Presa in Carico Richiesta)**: Come Host Manager, voglio visualizzare le richieste di preventivo eventi per valutare manualmente la fattibilità logistica basata su partecipanti e service richiesto.
- **US.HM.2.2 (Gestione Prenotazioni Sala Riunioni)**: Come Host Manager, voglio poter inserire manualmente le prenotazioni da Front-Desk per le Sale Riunioni per bloccare lo slot relativo.
- **US.HM.2.3 (Calcolo e Gestione Costi)**: Come Host Manager, voglio che il sistema calcoli automaticamente il costo per le Riunioni (Costo Orario x Durata) e mi permetta di inserire manualmente il costo totale per gli Eventi per gestire la flessibilità commerciale della struttura.
- **US.HM.2.4 (Controllo Capienza)**: Come Host Manager, voglio che il sistema verifichi la capienza all'inserimento di ogni prenotazione per garantire che il numero di persone non superi il limite fisso del Template.
- **US.HM.2.5 (Validazione Operativa)**: Come Host Manager, voglio che il sistema validi ogni inserimento manuale per confermare che la data scelta corrisponda a un giorno di apertura programmato.
- **US.HM.2.6 (Visualizzazione Occupazione)**: Come Host Manager, voglio una vista calendario che mostri chiaramente la saturazione degli spazi per poter distinguere tra slot liberi, occupati e bloccati dal Training Manager.

---

## 2. Restaurant Manager (RM)

### Configurazione Offerta
- **US.RM.1.1 (Censimento Ingredienti e Allergeni)**: Come Restaurant Manager, voglio mappare per ogni entità "Food" o "Beverage" gli ingredienti e gli allergeni, per garantire la sicurezza alimentare e l'informazione corretta all'utente.
- **US.RM.1.2 (Gestione Inventory Base)**: Come Restaurant Manager, voglio definire la quantità e il costo per ogni referenza inserita, associando un'immagine per la visualizzazione dei prodotti all'interno dell'App.
- **US.RM.1.3 (Composizione Menu Dinamici)**: Come Restaurant Manager, voglio creare l'entità "Menu" selezionando multipli elementi Food e Beverage, per definire una tipologia e un costo specifico per l'intero pacchetto.
- **US.RM.1.4 (Programmazione Menu per Fascia Oraria)**: Come Restaurant Manager, voglio associare ogni Menu a determinati eventi per gestire automaticamente il passaggio tra offerta Breakfast, Lunch e Dinner.

### Gestione Sala e Prenotazioni
- **US.RM.2.1 (Configurazione Tavoli)**: Come Restaurant Manager, voglio definire i singoli "Tavoli" associandoli a una "Template Sala", per definire la capienza numerica e lo stato di disponibilità.
- **US.RM.2.2 (Logica di Unione Tavoli)**: Come Restaurant Manager, voglio poter unire dei tavoli nel template di Sala per permettere al sistema di accettare prenotazioni di gruppi che superano la capienza del singolo tavolo.
- **US.RM.2.3 (Allocazione Manuale Prenotazioni)**: Come Restaurant Manager, voglio visualizzare le "Prenotazioni Tavolo" in arrivo e allocarle manualmente ai tavoli disponibili per ottimizzare il riempimento della sala.
- **US.RM.2.4 (Monitoraggio Disponibilità Residua)**: Come Restaurant Manager, voglio visualizzare in tempo reale i posti ancora disponibili in sala, filtrati per data e fascia oraria, per gestire eventuali walk-in (clienti senza prenotazione).

### Evento
- **US.RM.4.1 (Creazione Evento)**: Come Restaurant Manager, voglio creare un nuovo Evento inserendo nome, tipologia, descrizione e data per pubblicarlo nel calendario del Front-Desk.
- **US.RM.4.2 (Configurazione Oraria e Spazi)**: Come Restaurant Manager, voglio definire la "Fascia Oraria" e la "Durata" dell'evento per bloccare correttamente la sala ed evitare sovrapposizioni.
- **US.RM.4.3 (Associazione Menu Dedicato)**: Come Restaurant Manager, voglio associare all'evento uno specifico "Menu" o una selezione di prodotti a costo fisso o alla carta per differenziare l'offerta gastronomica durante la serata.
- **US.RM.4.4 (Gestione Costi e Partecipazione)**: Come Restaurant Manager, voglio impostare il costo per la partecipazione all'evento per differenziarlo tra consumazione inclusa o solo ingresso.

---

## 3. Training Manager (TM)

### Configurazione e Gestione Corsi
- **US.TM.1.1 (Creazione Corso)**: Come Training Manager, voglio creare l'entità "Corso" definendo nome, tipologia, descrizione, numero lezioni, durata totale in ore e sala associata per strutturare l'offerta formativa.
- **US.TM.1.2 (Pianificazione Lezioni)**: Come Training Manager, voglio definire il numero di lezioni, la durata della singola lezione, il giorno di svolgimento settimanale e sala associata per generare automaticamente il calendario didattico.
- **US.TM.1.3 (Gestione Corpo Docente)**: Come Training Manager, voglio mappare l'anagrafica dei "Teacher" e associarli a specifici corsi o singole lezioni per garantire che ogni sessione abbia un docente di riferimento.
- **US.TM.1.4 (Caricamento Materiali Didattici)**: Come Training Manager, voglio caricare file e materiali multimediali associati al corso per renderli disponibili al download per i partecipanti autorizzati.

### Gestione Spazi e Override
- **US.TM.2.1 (Allocazione Sale con Priorità)**: Come Training Manager, voglio selezionare le sale di tipologia **Formazione** e occupare gli slot necessari, esercitando l'override automatico sulle eventuali prenotazioni preesistenti di Host Manager e Restaurant Manager. Il Training Manager ha priorità assoluta su questo tipo di sale.
- **US.TM.2.2 (Risoluzione Conflitti Override)**: Come Training Manager, voglio che il sistema mi segnali eventuali prenotazioni pre-esistenti in conflitto e mi consenta di procedere alla loro cancellazione per liberare lo spazio. Host Manager e Restaurant Manager ricevono una notifica mock della cancellazione.
- **US.TM.2.3 (Verifica Capienza Aula)**: Come Training Manager, voglio poter modificare il "Template" della sala scelta per adattare lo spazio fisico alle specifiche esigenze didattiche.
- **US.TM.2.4 (Verifica Coerenza Volumi)**: Come Training Manager, voglio impostare il numero massimo di partecipanti per ogni corso per assicurarmi che la sala scelta sia coerente con il volume di studenti previsto.
- **US.TM.2.5 (Configurazione Slot Temporali)**: Come Training Manager, voglio incrociare la data di inizio/fine con la fascia oraria di svolgimento per bloccare in modo granulare la disponibilità della sala.

### Monitoraggio e Gestione Candidati
- **US.TM.3.1 (Monitoraggio Partecipanti)**: Come Training Manager, voglio visualizzare in tempo reale il numero di partecipanti iscritti a ogni corso per valutare il raggiungimento della soglia minima o massima.
- **US.TM.4.1 (Validazione Iscrizioni)**: Come Training Manager, voglio visualizzare l'elenco dei candidati e variarne lo stato in "Accettato" o "Rifiutato" per gestire correttamente la composizione della classe.
- **US.TM.4.2 (Monitoraggio Presenze)**: Come Training Manager, voglio monitorare il numero di candidati confermati rispetto alla capienza massima per ottimizzare l'uso delle aule.

---

## 4. Event Manager (EM)

### Accoglienza e Check-in
- **US.EM.1.1 (Gestione Arrivi)**: Come Event Manager, voglio accedere alla lista degli arrivi previsti per la giornata per preparare il materiale di accoglienza.
- **US.EM.1.2 (Check-in Utente)**: Come Event Manager, voglio registrare l'arrivo dell'utente associandolo alla sua prenotazione tramite Anagrafica per confermare l'occupazione effettiva dello spazio.
- **US.EM.1.3 (Rilascio Accessi)**: Come Event Manager, voglio fornire all'utente le credenziali o le chiavi di accesso alla sala prenotata per garantire la sicurezza degli spazi.

### Gestione Operativa Eventi e Sale
- **US.EM.2.1 (Configurazione Last-Minute)**: Come Event Manager, voglio poter variare il "Service Tecnico" di una sala all'arrivo dell'utente per gestire richieste urgenti non previste.
- **US.EM.2.2 (Monitoraggio Occupazione Real-time)**: Come Event Manager, voglio visualizzare quali sale sono attualmente occupate e quali sono in fase di "liberazione" per coordinare le squadre di pulizia.
- **US.EM.2.3 (Gestione Segnalazioni)**: Come Event Manager, voglio registrare eventuali malfunzionamenti tecnici in una sala per comunicare istantaneamente all'Host Manager la necessità di manutenzione.
- **US.EM.2.4 (Verifica Template)**: Come Event Manager, voglio verificare che l'allestimento della sala corrisponda al Template definito per assicurare la coerenza del servizio.

---

## 5. Teacher (T)

### Gestione Didattica e Materiali
- **US.T.1.1 (Accesso al Calendario Lezioni)**: Come Teacher, voglio visualizzare il calendario delle lezioni a me assegnate per organizzare la mia attività.
- **US.T.1.2 (Caricamento Materiale Didattico)**: Come Teacher, voglio caricare file e documenti associandoli a uno specifico Corso o Lezione per renderli disponibili agli studenti.

### Gestione Profilo
- **US.T.2.1 (Gestione Profilo Professionale)**: Come Teacher, voglio compilare e aggiornare la mia biografia e descrizione professionale nell'anagrafica per presentarmi correttamente agli studenti.
- **US.T.2.2 (Allineamento Obiettivi Didattici)**: Come Teacher, voglio consultare la descrizione del corso e gli obiettivi impostati dal Training Manager per allineare lo svolgimento delle lezioni.

---

## 6. User (U)

### Profilazione e Anagrafica
- **US.U.1.1 (Scelta Tipologia)**: Come Utente, voglio selezionare tra profilo "Privato" o "Azienda" durante la registrazione per sbloccare i campi fiscali pertinenti.
- **US.U.1.2 (Dati Fiscali Privato)**: Come Utente Privato, voglio inserire Codice Fiscale, data e luogo di nascita per la corretta fatturazione.
- **US.U.1.3 (Dati Fiscali Azienda)**: Come Utente Azienda, voglio inserire Ragione Sociale, P.IVA e Codice SDI/PEC per automatizzare il flusso documentale verso l'Administration.
- **US.U.1.4 (Gestione Indirizzi)**: Come Utente, voglio salvare indirizzi di spedizione e fatturazione differenti per gestire correttamente la generazione dei documenti contabili.
- **US.U.1.5 (Preferenze Alimentari e Buoni Pasto)**: Come Utente, voglio indicare la mia dieta e l'eventuale possesso di buoni pasto per usufruirne durante la prenotazione.

### Food & Beverage
- **US.U.2.1 (Prenotazione Tavolo per Evento)**: Come User, voglio selezionare data, numero di persone e fascia oraria per riservare un tavolo per un dato evento.
- **US.U.2.2 (Selezione Menu)**: Come User, voglio scegliere una tipologia di menu di un dato evento in fase di prenotazione tavolo per accedere all'offerta dedicata.
- **US.U.2.3 (Filtro Allergeni)**: Come User, voglio visualizzare gli ingredienti e gli allergeni associati a ogni piatto per tutelare la mia salute.

### Workspace ed Eventi
- **US.U.3.1 (Prenotazione Sala Riunioni)**: Come User, voglio riservare una sala intera indicando il numero di partecipanti e selezionando il Service Tecnico per visualizzare il costo totale calcolato.
- **US.U.3.2 (Richiesta Preventivo)**: Come User, voglio inviare una richiesta per un evento complesso per essere ricontattato dall'Host Manager.

### Formazione
- **US.U.4.1 (Acquisto e Candidatura Corso)**: Come User, voglio inviare la mia candidatura per accedere alle lezioni pianificate dal Training Manager.
- **US.U.4.2 (Area Personale e Materiali)**: Come User, voglio accedere alla mia Area Personale per scaricare i materiali didattici caricati dal Teacher.
- **US.U.4.3 (Storico e Notifiche)**: Come User, voglio visualizzare lo storico delle mie prenotazioni per interagire con esse.
