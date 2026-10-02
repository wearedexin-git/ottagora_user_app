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
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                La tua email
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
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
              Tipo di evento
            </label>
            <select
              name="eventType"
              required
              className="w-full rounded-xl border border-zinc-200 bg-surface px-4 py-3 text-zinc-800 text-sm focus:outline-none focus:border-primary transition-all"
            >
              <option value="Conferenza Aziendale">Conferenza / meeting aziendale</option>
              <option value="Cena di Gala / Festa">Cena di gala / festa privata</option>
              <option value="Lancio Prodotto">Lancio prodotto / showroom</option>
              <option value="Altro Evento Custom">Altro (specifica nelle note)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Data desiderata
              </label>
              <input
                type="date"
                name="date"
                required
                className="w-full rounded-xl border border-zinc-200 bg-surface px-4 py-3 text-zinc-800 text-sm focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Ospiti previsti
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
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
              Dettagli e richieste particolari
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
            Invia richiesta
          </Button>
        </form>
    </div>
  );
}
