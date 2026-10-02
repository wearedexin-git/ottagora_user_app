import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getPublicUpcomingEvents } from "@/lib/events";
import { getUpcomingActivities } from "@/lib/upcoming-activities";
import { ActivityRow } from "@/components/ActivityRow";
import { EventCard } from "@/components/EventCard";
import Link from "next/link";
import { IconArrowRight, IconNavEvents } from "@/components/icons";
import { Button, EmptyState } from "@/components/ui";

export const revalidate = 0;

export default async function Home() {
  const session = await auth();

  const user = session?.user?.email
    ? await prisma.user.findUnique({ where: { email: session.user.email } })
    : null;

  const activities = user ? await getUpcomingActivities(user.id) : [];

  const events = await getPublicUpcomingEvents(3);

  return (
    <div className="relative isolate flex-1 flex flex-col justify-start pt-4 pb-8 sm:pt-8 sm:pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="mb-6 sm:mb-8 text-left">
        {user ? (
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Dashboard</span>
            <h1 className="text-3xl font-semibold text-zinc-900 mt-1 tracking-tight">
              Ciao, {user.name || user.email}
            </h1>
          </div>
        ) : (
          <div className="py-2 sm:py-4">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Ottagora Hub</span>
            <h1 className="text-4xl font-semibold text-zinc-900 mt-1 tracking-tight">Spazio Connesso.</h1>
            <p className="text-zinc-500 text-sm mt-2 max-w-xl">
              Prenota il tuo workspace flessibile, iscriviti a corsi professionali, partecipa a eventi esclusivi e scopri menù d&apos;autore.
            </p>
            <div className="mt-6 flex gap-3">
              <Button href="/login" variant="primary">
                Accedi
              </Button>
              <Button href="/register" variant="outline">
                Registrati
              </Button>
            </div>
          </div>
        )}
      </div>

      {user && (
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center gap-4 mb-2">
            <h2 className="text-base font-semibold text-zinc-900">In programma</h2>
            {activities.length > 0 && (
              <Link
                href="/area-personale"
                className="text-sm text-primary hover:brightness-90 font-bold inline-flex items-center gap-1 shrink-0 whitespace-nowrap"
              >
                Vedi tutte <IconArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>

          {activities.length === 0 ? (
            <EmptyState
              icon={IconNavEvents}
              title="Nessun impegno nei prossimi 7 giorni"
              description="Prenota uno spazio di lavoro o partecipa a uno dei prossimi eventi."
              actions={
                <>
                  <Button href="/workspace" variant="primary">
                    Prenota un workspace
                  </Button>
                  <Button href="/events" variant="outline">
                    Scopri gli eventi
                  </Button>
                </>
              }
            />
          ) : (
            <ul className="space-y-3">
              {activities.slice(0, 3).map((activity) => (
                <ActivityRow
                  key={activity.id}
                  date={activity.date}
                  title={activity.title}
                  details={[activity.subtitle, activity.timeLabel ?? ""].filter(Boolean)}
                  status={activity.pending ? { label: "In attesa", variant: "primary" } : undefined}
                />
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center gap-4 mb-2">
          <h2 className="text-base font-semibold text-zinc-900">Prossimi eventi</h2>
          {events.length > 0 && (
            <Link
              href="/events"
              className="text-sm text-primary hover:brightness-90 font-bold inline-flex items-center gap-1 shrink-0 whitespace-nowrap"
            >
              Vedi tutti <IconArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {events.length === 0 && (
            <EmptyState
              className="md:col-span-3"
              icon={IconNavEvents}
              title="Nessun evento in programma"
              description="Stiamo preparando i prossimi appuntamenti. Nel frattempo puoi organizzare un evento su misura."
              actions={
                <Button href="/quote-request" variant="outline">
                  Richiedi un preventivo
                </Button>
              }
            />
          )}
          {events.map((event) => (
            <EventCard key={event.id} event={{ ...event, menu: null }} compact />
          ))}
        </div>
      </div>
    </div>
  );
}
