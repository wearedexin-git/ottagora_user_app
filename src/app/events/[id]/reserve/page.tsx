import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { submitTableReservation } from "@/app/actions/reservation-actions";
import Link from "next/link";

export default async function ReserveTablePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      room: true,
      menu: {
        include: {
          foods: true,
          beverages: true,
        },
      },
    },
  });

  if (!event) {
    redirect("/events");
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="glass rounded-3xl p-8 shadow-xl bg-white/50 border-zinc-200/40">
        <div className="mb-6">
          <Link href="/events" className="text-xs text-zinc-400 hover:text-amber-600 transition-colors">
            ← Torna agli eventi
          </Link>
          <h1 className="text-2xl font-extrabold text-zinc-900 mt-2">Prenotazione Tavolo</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Stai prenotando per l'evento: <strong className="text-zinc-700">{event.name}</strong>
          </p>
        </div>

        <form action={submitTableReservation} className="space-y-6">
          <input type="hidden" name="eventId" value={event.id} />
          <input type="hidden" name="timeSlot" value={event.timeSlot} />

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Numero di Persone (Ospiti)
            </label>
            <select
              name="guests"
              required
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-800 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num} className="bg-white text-zinc-800">
                  {num} {num === 1 ? "Persona" : "Persone"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Seleziona Menù Abbinato
            </label>
            {event.menu ? (
              <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-sm shadow-sm">
                <input type="hidden" name="menuId" value={event.menu.id} />
                <div className="flex justify-between font-bold text-zinc-800 mb-1">
                  <span>{event.menu.name}</span>
                  <span className="text-amber-600">{event.menu.cost.toFixed(2)}€</span>
                </div>
                <p className="text-xs text-zinc-500">
                  Composto da: {event.menu.foods.map((f) => f.name).join(", ")}
                </p>
              </div>
            ) : (
              <p className="text-xs text-zinc-400">Nessun menù predefinito per questo evento.</p>
            )}
          </div>

          <div className="border-t border-zinc-150 pt-4 text-xs text-zinc-400 space-y-2">
            <div className="flex justify-between">
              <span>Data:</span>
              <span className="text-zinc-700 font-semibold">
                {new Date(event.date).toLocaleDateString("it-IT", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Fascia Oraria:</span>
              <span className="text-zinc-700 font-semibold">{event.timeSlot}</span>
            </div>
            <div className="flex justify-between">
              <span>Location:</span>
              <span className="text-zinc-700 font-semibold">{event.room?.name || "Ottagora"}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-3.5 text-sm font-bold text-white hover:bg-zinc-800 transition-colors shadow-md cursor-pointer"
          >
            Conferma Prenotazione Tavolo
          </button>
        </form>
      </div>
    </div>
  );
}
