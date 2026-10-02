import { submitQuoteRequest } from "@/app/actions/reservation-actions";
import { auth } from "@/auth";
import { Button, Alert, PageHeader } from "@/components/ui";

export default async function QuoteRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  const { error } = await searchParams;

  const errorMessage =
    error === "missing"
      ? "Compila tutti i campi obbligatori."
      : error === "room"
        ? "Nessuna sala eventi disponibile al momento."
        : null;

  return (
    <div className="mx-auto w-full max-w-xl px-4 pt-4 pb-8 sm:px-6 sm:pt-8 sm:pb-12">
      <PageHeader
        eyebrow="Eventi su misura"
        title="Richiedi un preventivo"
        description="Organizza il tuo evento nel nostro Salone o nelle aule. Compila il modulo e ti invieremo un preventivo su misura."
      />

        {errorMessage && (
          <Alert variant="danger" className="mb-4">
            {errorMessage}
          </Alert>
        )}

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
                className="w-full rounded-xl border border-zinc-200 bg-surface px-4 py-3 text-zinc-800 placeholder-zinc-400 text-sm focus:outline-none focus:border-primary transition-all"
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
              className="w-full rounded-xl border border-zinc-200 bg-surface px-4 py-3 text-zinc-800 text-sm focus:outline-none focus:border-primary transition-all"
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
                className="w-full rounded-xl border border-zinc-200 bg-surface px-4 py-3 text-zinc-800 text-sm focus:outline-none focus:border-primary transition-all"
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
                className="w-full rounded-xl border border-zinc-200 bg-surface px-4 py-3 text-zinc-800 placeholder-zinc-400 text-sm focus:outline-none focus:border-primary transition-all"
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
              className="w-full rounded-xl border border-zinc-200 bg-surface px-4 py-3 text-zinc-800 placeholder-zinc-400 text-sm focus:outline-none focus:border-primary transition-all"
            />
          </div>

          <div className="p-4 rounded-xl bg-surface border border-zinc-200 flex items-center justify-between">
            <div className="flex-1 pr-4">
              <label htmlFor="recall" className="block text-sm font-semibold text-zinc-800 cursor-pointer">
                Preferisco essere richiamato
              </label>
              <p className="text-xs text-zinc-500 mt-0.5">Ti richiameremo entro 24 ore lavorative per definire i dettagli.</p>
            </div>
            <input
              type="checkbox"
              id="recall"
              name="recall"
              value="true"
              className="rounded border-zinc-200 bg-surface text-primary focus:ring-0 w-5 h-5 cursor-pointer"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth>
            Invia Richiesta Preventivo
          </Button>
        </form>
    </div>
  );
}
