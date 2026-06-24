import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, Briefcase, Award, ArrowRight } from "lucide-react";

export const revalidate = 0;

export default async function Home() {
  const session = await auth();
  
  let user = null;
  let workspaceBookings: any[] = [];
  
  if (session?.user?.email) {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        reservations: {
          where: { status: "CONFIRMED" },
          include: { event: true },
          take: 2,
          orderBy: { date: "asc" },
        },
        enrollments: {
          include: { course: true },
          take: 2,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (user) {
      workspaceBookings = await prisma.bookingRequest.findMany({
        where: {
          requester: user.email,
          status: "APPROVED",
        },
        include: { room: true },
        take: 2,
        orderBy: { date: "asc" },
      });
    }
  }

  // Fetch upcoming events feed
  const events = await prisma.event.findMany({
    include: { room: true },
    orderBy: { date: "asc" },
    take: 3,
  });

  return (
    <div className="relative isolate flex-1 flex flex-col justify-start py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      {/* Background glow effects */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-amber-200 to-orange-200 opacity-20 sm:w-[72.1875rem]"></div>
      </div>

      {/* Welcome & Dashboard Intro */}
      <div className="mb-10 text-left">
        {user ? (
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Dashboard</span>
            <h1 className="text-3xl font-extrabold text-zinc-900 mt-1 tracking-tight">
              Ciao, {user.name || user.email}
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Ecco lo stato delle tue attività e gli ultimi eventi in programma.
            </p>
          </div>
        ) : (
          <div className="py-6">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Ottagora Hub</span>
            <h1 className="text-4xl font-extrabold text-zinc-900 mt-1 tracking-tight">
              Spazio Connesso.
            </h1>
            <p className="text-zinc-500 text-sm mt-2 max-w-xl">
              Prenota il tuo workspace flessibile, iscriviti a corsi professionali, partecipa a eventi esclusivi e scopri menù d'autore.
            </p>
            <div className="mt-6">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:brightness-110 transition-all cursor-pointer"
              >
                Accedi per iniziare
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Logged-in Summary Dashboard */}
      {user && (
        <div className="space-y-8 mb-10">
          <div>
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Le Tue Attività Attive</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Event Table Reservations */}
              {user.reservations.map((res) => (
                <div key={res.id} className="glass rounded-2xl p-5 border border-zinc-200/40 flex items-start gap-4 shadow-sm hover:border-zinc-300 transition-all">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-800">Tavolo Prenotato</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">{res.event?.name}</p>
                    <div className="flex gap-2 mt-2 text-[10px] text-zinc-400 font-medium">
                      <span>{new Date(res.date).toLocaleDateString("it-IT")}</span>
                      <span>•</span>
                      <span>{res.timeSlot}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Workspace Bookings */}
              {workspaceBookings.map((booking) => (
                <div key={booking.id} className="glass rounded-2xl p-5 border border-zinc-200/40 flex items-start gap-4 shadow-sm hover:border-zinc-300 transition-all">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-800">Workspace Riservato</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">{booking.room?.name}</p>
                    <div className="flex gap-2 mt-2 text-[10px] text-zinc-400 font-medium">
                      <span>{new Date(booking.date).toLocaleDateString("it-IT")}</span>
                      <span>•</span>
                      <span>{booking.durationMinutes} min</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Course Enrollments */}
              {user.enrollments.map((enr) => (
                <div key={enr.id} className="glass rounded-2xl p-5 border border-zinc-200/40 flex items-start gap-4 shadow-sm hover:border-zinc-300 transition-all">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-800">Corso in Valutazione</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">{enr.course?.name}</p>
                    <span className="inline-block mt-2 text-[9px] font-bold uppercase tracking-wider text-amber-600 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                      {enr.status === "ACCEPTED" ? "Iscritto" : "In attesa"}
                    </span>
                  </div>
                </div>
              ))}

              {user.reservations.length === 0 && workspaceBookings.length === 0 && user.enrollments.length === 0 && (
                <div className="col-span-2 p-8 text-center text-xs text-zinc-400 glass rounded-2xl border border-zinc-200/40 shadow-sm">
                  Nessuna attività prenotata o candidatura attiva.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Feed Eventi in Programma */}
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Feed Eventi del Momento</h2>
          <Link href="/events" className="text-xs text-amber-600 hover:text-amber-700 font-bold inline-flex items-center gap-1">
            Vedi tutti <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="glass rounded-2xl p-6 border border-zinc-200/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-zinc-350 shadow-sm hover:shadow-md"
            >
              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold tracking-widest text-amber-600 uppercase bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                    {event.type}
                  </span>
                  <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-100 px-2.5 py-0.5 rounded-full">
                    {event.cost === 0 ? "Gratuito" : `${event.cost.toFixed(2)}€`}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 leading-snug">{event.name}</h3>
                <p className="text-xs text-zinc-500">{event.description}</p>
              </div>

              <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center shrink-0 border-t sm:border-t-0 border-zinc-100 pt-4 sm:pt-0 gap-3">
                <div className="text-left sm:text-right text-xs text-zinc-500">
                  <p className="font-semibold text-zinc-800">
                    {new Date(event.date).toLocaleDateString("it-IT", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                  <p>{event.timeSlot}</p>
                </div>
                <Link
                  href={`/events/${event.id}/reserve`}
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:brightness-110 transition-all cursor-pointer"
                >
                  Prenota
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
