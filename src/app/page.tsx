import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getPublicUpcomingEvents } from "@/lib/events";
import { getUpcomingActivities, type UpcomingActivity } from "@/lib/upcoming-activities";
import Link from "next/link";
import { IconArrowRight, IconNavEvents, IconNavWorkspace, IconNavCourses } from "@/components/icons";
import { Card, Button, Badge, EmptyState } from "@/components/ui";

export const revalidate = 0;

const ACTIVITY_ICONS: Record<UpcomingActivity["kind"], typeof IconNavEvents> = {
  table: IconNavEvents,
  workspace: IconNavWorkspace,
  lesson: IconNavCourses,
};

export default async function Home() {
  const session = await auth();

  const user = session?.user?.email
    ? await prisma.user.findUnique({ where: { email: session.user.email } })
    : null;

  const activities = user ? await getUpcomingActivities(user.id) : [];

  const events = await getPublicUpcomingEvents(3);

  return (
    <div className="relative isolate flex-1 flex flex-col justify-start py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36rem] -translate-x-1/2 rotate-[30deg] bg-primary opacity-15 sm:w-[72.1875rem]"></div>
      </div>

      <div className="mb-10 text-left">
        {user ? (
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Dashboard</span>
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
            <h1 className="text-4xl font-extrabold text-zinc-900 mt-1 tracking-tight">Spazio Connesso.</h1>
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
        <div className="space-y-4 mb-10">
          <div className="flex justify-between items-center gap-4 mb-2">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              In programma
            </h2>
            {activities.length > 0 && (
              <Link
                href="/area-personale"
                className="text-xs text-primary hover:brightness-90 font-bold inline-flex items-center gap-1 shrink-0 whitespace-nowrap"
              >
                Vedi tutte <IconArrowRight className="h-3 w-3" />
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activities.slice(0, 3).map((activity) => {
                const Icon = ACTIVITY_ICONS[activity.kind];
                return (
                  <Card key={activity.id} padding="sm" className="flex items-start gap-4 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-zinc-800 truncate">{activity.title}</h3>
                      <p className="text-xs text-zinc-500 mt-0.5 truncate">{activity.subtitle}</p>
                      <div className="flex gap-2 mt-2 text-[10px] text-zinc-400 font-medium">
                        <span className="inline-block first-letter:uppercase">
                          {activity.date.toLocaleDateString("it-IT", {
                            timeZone: "Europe/Rome",
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                        {activity.timeLabel && (
                          <>
                            <span>•</span>
                            <span>{activity.timeLabel}</span>
                          </>
                        )}
                      </div>
                      {activity.pending && (
                        <Badge variant="primary" className="mt-2">
                          In attesa
                        </Badge>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center gap-4 mb-2">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Feed Eventi del Momento
          </h2>
          {events.length > 0 && (
            <Link
              href="/events"
              className="text-xs text-primary hover:brightness-90 font-bold inline-flex items-center gap-1 shrink-0 whitespace-nowrap"
            >
              Vedi tutti <IconArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        <div className="space-y-4">
          {events.length === 0 && (
            <EmptyState
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
            <Card
              key={event.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Badge variant="primary" className="uppercase tracking-widest">
                    {event.type}
                  </Badge>
                  <Badge variant="neutral">
                    {event.cost === 0 ? "Gratuito" : `${event.cost.toFixed(2)}€`}
                  </Badge>
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
                <Button href={`/events/${event.id}/reserve`} variant="primary" size="sm">
                  Prenota
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
