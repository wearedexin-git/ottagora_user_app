import { getPublicUpcomingEvents } from "@/lib/events";
import Link from "next/link";
import { Card, Button, Badge } from "@/components/ui";

export const revalidate = 0;

export default async function EventsPage() {
  const events = await getPublicUpcomingEvents();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-b border-zinc-200/50 pb-6 mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          Eventi in Programma
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Partecipa alle nostre serate speciali. Prenota un tavolo per gustare menù esclusivi abbinati.
        </p>
        <Link
          href="/quote-request"
          className="inline-block mt-4 text-xs font-bold text-primary hover:brightness-90"
        >
          Richiedi informazioni o re-call per un evento custom →
        </Link>
      </div>

      {events.length === 0 ? (
        <Card padding="none" className="p-12 text-center">
          <p className="text-zinc-500 text-sm">Non ci sono eventi in programma al momento.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card
              key={event.id}
              padding="none"
              className="overflow-hidden flex flex-col hover:border-zinc-300/80 hover:shadow-md transition-all"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between text-[10px] text-primary font-bold uppercase tracking-widest mb-3">
                  <span>{event.type}</span>
                  <Badge variant="primary">
                    {event.cost === 0 ? "Gratuito" : `${event.cost.toFixed(2)}€`}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-zinc-900 mb-2 leading-snug">
                  {event.name}
                </h3>

                <p className="text-zinc-500 text-xs mb-6 flex-1 leading-relaxed">
                  {event.description}
                </p>

                <div className="border-t border-zinc-100 pt-4 mt-auto space-y-2 text-xs text-zinc-500">
                  <div className="flex justify-between">
                    <span className="font-semibold text-zinc-700">Data:</span>
                    <span>
                      {new Date(event.date).toLocaleDateString("it-IT", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-zinc-700">Fascia Oraria:</span>
                    <span>{event.timeSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-zinc-700">Sala:</span>
                    <span>{event.room?.name || "Salone Ottagora"}</span>
                  </div>
                  {event.menu && (
                    <div className="flex justify-between items-center pt-1.5">
                      <span className="font-semibold text-zinc-700">Menù:</span>
                      <Link
                        href={`/menus?selected=${event.menu.id}`}
                        className="text-xs text-primary hover:brightness-90 underline font-medium"
                      >
                        {event.menu.name}
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-zinc-100 bg-zinc-50/50 p-4">
                <Button href={`/events/${event.id}/reserve`} variant="secondary" fullWidth>
                  Prenota un Tavolo
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
