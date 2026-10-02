import { redirect } from "next/navigation";

// I menù non hanno una pagina propria: si consultano dall'evento a cui sono associati
// (pagina eventi e prenotazione tavolo). L'indirizzo resta attivo per i link già esistenti.
export default function MenusPage() {
  redirect("/events");
}
