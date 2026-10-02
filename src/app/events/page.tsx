import { getPublicUpcomingEvents } from "@/lib/events";
import Link from "next/link";
import { Button, EmptyState, PageHeader } from "@/components/ui";
import { IconArrowRight, IconNavEvents } from "@/components/icons";
import { EventCard } from "@/components/EventCard";
import { toMenuDetail } from "@/lib/menu-detail";

export const revalidate = 0;

export default async function EventsPage() {
  const events = await getPublicUpcomingEvents();

  return (
    <div className="mx-auto max-w-7xl px-4 pt-4 pb-8 sm:px-6 sm:pt-8 sm:pb-12 lg:px-8">
      <PageHeader eyebrow="Eventi" title="In programma">
        {events.length > 0 && (
          <p className="mt-3 text-xs text-zinc-500">
            Vuoi organizzare un evento privato o aziendale?{" "}
            <Link
              href="/quote-request"
              className="inline-flex items-center gap-1 font-bold text-primary hover:brightness-90"
            >
              Richiedi un preventivo <IconArrowRight className="h-3 w-3" />
            </Link>
          </p>
        )}
      </PageHeader>

      {events.length === 0 ? (
        <EmptyState
          icon={IconNavEvents}
          title="Nessun evento in programma"
          description="Stiamo preparando i prossimi appuntamenti. Nel frattempo puoi organizzare un evento su misura per te o per la tua azienda."
          actions={
            <Button href="/quote-request" variant="primary">
              Richiedi un preventivo
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={{ ...event, menu: event.menu ? toMenuDetail(event.menu) : null }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
