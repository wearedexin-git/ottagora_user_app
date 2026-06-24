import { submitQuoteRequest } from "@/app/actions/reservation-actions";
import { auth } from "@/auth";

export default async function QuoteRequestPage() {
  const session = await auth();

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="glass rounded-3xl p-8 shadow-xl bg-white/50 border-zinc-200/40">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-zinc-900">Richiedi Preventivo Evento Custom</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Organizza il tuo evento speciale nel nostro Salone o nelle aule. Compila il modulo per ricevere un preventivo personalizzato o richiedere un recall telefonico.
          </p>
        </div>

        <form action={submitQuoteRequest} className="space-y-6">
          {!session && (
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                La tua Email
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="nome@azienda.com"
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-800 placeholder-zinc-400 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Tipologia Evento
            </label>
            <select
              name="eventType"
              required
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-800 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
            >
              <option value="Conferenza Aziendale">Conferenza / Meeting Aziendale</option>
              <option value="Cena di Gala / Festa">Cena di Gala / Festa Privata</option>
              <option value="Lancio Prodotto">Lancio Prodotto / Showroom</option>
              <option value="Altro Evento Custom">Altro (Specificare nelle note)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Data Desiderata
              </label>
              <input
                type="date"
                name="date"
                required
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-800 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Numero di Ospiti Previsti
              </label>
              <input
                type="number"
                name="guests"
                required
                min={1}
                placeholder="es. 40"
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-800 placeholder-zinc-400 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Dettagli e Richieste Particolari
            </label>
            <textarea
              name="notes"
              rows={4}
              placeholder="Descrivi l'evento, gli allestimenti necessari, i servizi tecnici desiderati..."
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-800 placeholder-zinc-400 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
            />
          </div>

          <div className="p-4 rounded-xl bg-white border border-zinc-150 flex items-center justify-between shadow-sm">
            <div className="flex-1 pr-4">
              <label htmlFor="recall" className="block text-sm font-semibold text-zinc-800 cursor-pointer">
                Richiedi Recall Telefonico
              </label>
              <p className="text-xs text-zinc-500 mt-0.5">Ti richiameremo entro 24 ore lavorative per definire i dettagli.</p>
            </div>
            <input
              type="checkbox"
              id="recall"
              name="recall"
              value="true"
              className="rounded border-zinc-200 bg-white text-amber-500 focus:ring-0 w-5 h-5 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-3.5 text-sm font-bold text-white shadow-md hover:brightness-110 transition-all cursor-pointer"
          >
            Invia Richiesta Preventivo
          </button>
        </form>
      </div>
    </div>
  );
}
