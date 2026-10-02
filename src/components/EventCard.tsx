import { Badge, Button, Card } from "@/components/ui";
import MenuSheet from "@/components/MenuSheet";
import { eventTypeLabel, formatCost, formatDateShort } from "@/lib/format";
import type { MenuDetail } from "@/lib/menu-detail";

export type EventCardData = {
  id: string;
  name: string;
  description: string | null;
  type: string | null;
  cost: number;
  date: Date;
  timeSlot: string | null;
  room: { name: string } | null;
  menu: MenuDetail | null;
};

/**
 * Card evento, con la stessa struttura delle card dei corsi: tipo e prezzo in alto, titolo,
 * descrizione, griglia di dati e bottone principale. `compact` (home) nasconde descrizione,
 * sala e menù.
 */
export function EventCard({ event, compact }: { event: EventCardData; compact?: boolean }) {
  const facts = [
    { label: "Data", value: formatDateShort(event.date) },
    { label: "Fascia oraria", value: event.timeSlot || "—" },
    ...(compact ? [] : [{ label: "Sala", value: event.room?.name || "Salone Ottagora" }]),
  ];

  return (
    <Card className="flex min-w-0 flex-col">
      <div className="flex items-center justify-between gap-3">
        <Badge variant="primary" className="uppercase tracking-wider">
          {eventTypeLabel(event.type)}
        </Badge>
        <span className="text-lg font-extrabold text-primary">{formatCost(event.cost)}</span>
      </div>

      <h3 className="mt-4 text-xl font-semibold leading-tight text-zinc-900">{event.name}</h3>
      {!compact && event.description && (
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">{event.description}</p>
      )}

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-zinc-200/60 pt-5">
        {facts.map((fact) => (
          <div key={fact.label} className="min-w-0">
            <dt className="text-xs font-semibold text-zinc-400">{fact.label}</dt>
            <dd className="mt-0.5 text-sm font-semibold text-zinc-800">{fact.value}</dd>
          </div>
        ))}
        {!compact && event.menu && (
          <div className="col-span-2 min-w-0">
            <dt className="text-xs font-semibold text-zinc-400">Menù</dt>
            <dd className="mt-0.5 flex items-center gap-2 text-sm font-semibold text-zinc-800">
              <span className="truncate">{event.menu.name}</span>
              <MenuSheet menu={event.menu} label="Vedi menù" className="shrink-0 text-sm" />
            </dd>
          </div>
        )}
      </dl>

      <div className="mt-auto pt-6">
        <Button href={`/events/${event.id}/reserve`} variant="primary" size="lg" fullWidth>
          Prenota un tavolo
        </Button>
      </div>
    </Card>
  );
}
