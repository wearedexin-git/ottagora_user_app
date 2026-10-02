/**
 * Formati condivisi dell'app: prezzi, date e tipi evento scritti sempre allo stesso modo.
 * Le date usano sempre il fuso italiano, così sono corrette anche se il server gira in UTC.
 */

const TZ = "Europe/Rome";

const euro = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" });
const dateShort = new Intl.DateTimeFormat("it-IT", { timeZone: TZ, weekday: "short", day: "numeric", month: "short" });
const dateLong = new Intl.DateTimeFormat("it-IT", { timeZone: TZ, weekday: "long", day: "numeric", month: "long", year: "numeric" });
const time = new Intl.DateTimeFormat("it-IT", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
const chipDay = new Intl.DateTimeFormat("it-IT", { timeZone: TZ, day: "numeric" });
const chipMonth = new Intl.DateTimeFormat("it-IT", { timeZone: TZ, month: "short" });

const toDate = (d: Date | string) => (typeof d === "string" ? new Date(d) : d);
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "45,00 €" */
export const formatEuro = (amount: number) => euro.format(amount);

/** "Gratuito" se il costo è zero, altrimenti "45,00 €". */
export const formatCost = (amount: number) => (amount === 0 ? "Gratuito" : euro.format(amount));

/** "Ven 2 ott": formato breve usato in liste e card. */
export const formatDateShort = (d: Date | string) => capitalize(dateShort.format(toDate(d)).replace(/\./g, ""));

/** "Venerdì 2 ottobre 2026": formato esteso per i riepiloghi. */
export const formatDateLong = (d: Date | string) => capitalize(dateLong.format(toDate(d)));

/** "10:00" */
export const formatTime = (d: Date | string) => time.format(toDate(d));

/** Giorno e mese per il "calendarietto" delle righe ("2", "ott"). */
export const dateChipParts = (d: Date | string) => ({
  day: chipDay.format(toDate(d)),
  month: chipMonth.format(toDate(d)).replace(".", ""),
});

const EVENT_TYPES: Record<string, string> = {
  EVENT: "Evento",
  MEETING: "Riunione",
};

/** Tipo evento leggibile: i valori del database (EVENT, MEETING) tradotti in italiano. */
export const eventTypeLabel = (type: string | null | undefined) =>
  type ? (EVENT_TYPES[type] ?? capitalize(type.toLowerCase())) : "Evento";
