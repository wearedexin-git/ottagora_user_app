import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const revalidate = 0;

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    include: {
      room: true,
      menu: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-b border-zinc-200/50 pb-6 mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          Eventi in Programma
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Partecipa alle nostre serate speciali. Prenota un tavolo per gustare menù esclusivi abbinati.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center shadow-sm">
          <p className="text-zinc-500 text-sm">Non ci sono eventi in programma al momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="glass rounded-2xl overflow-hidden flex flex-col transition-all hover:border-zinc-350 shadow-sm hover:shadow-md bg-white/50"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between text-[10px] text-amber-600 font-bold uppercase tracking-widest mb-3">
                  <span>{event.type}</span>
                  <span className="bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                    {event.cost === 0 ? "Gratuito" : `${event.cost.toFixed(2)}€`}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-zinc-900 mb-2 leading-snug">
                  {event.name}
                </h3>
                
                <p className="text-zinc-500 text-xs mb-6 flex-1 leading-relaxed">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="border-t border-zinc-100 pt-4 mt-auto space-y-2 text-xs text-zinc-500">
                  <div className="flex justify-between">
                    <span className="font-semibold text-zinc-700">Data:</span>
                    <span>{new Date(event.date).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}</span>
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
                        className="text-xs text-amber-600 hover:text-amber-700 underline font-medium"
                      >
                        {event.menu.name}
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="border-t border-zinc-100 bg-zinc-50/50 p-4">
                <Link
                  href={`/events/${event.id}/reserve`}
                  className="w-full inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
                >
                  Prenota un Tavolo
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
