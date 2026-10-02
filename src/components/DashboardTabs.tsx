import Link from "next/link";
import type { ReactNode } from "react";
import {
  IconArrowRight,
  IconFileText,
  IconNavCourses,
  IconNavEvents,
  IconNavWorkspace,
} from "@/components/icons";
import { Badge, Button, EmptyState, type BadgeVariant } from "@/components/ui";
import { cn } from "@/lib/cn";

export type AreaTab = "tavoli" | "workspace" | "corsi";

export const AREA_TABS: AreaTab[] = ["tavoli", "workspace", "corsi"];

type TableReservation = {
  id: string;
  date: Date;
  status: string;
  timeSlot: string | null;
  guests: number;
  event: { name: string } | null;
  menu: { name: string } | null;
};

type WorkspaceBooking = {
  id: string;
  date: Date;
  status: string;
  title: string | null;
  durationMinutes: number;
  cost: number;
  room: { name: string } | null;
};

type Enrollment = {
  id: string;
  status: string;
  createdAt: Date;
  course: {
    title: string;
    startDate: Date | null;
    endDate: Date | null;
    materials: Array<{ id: string; title: string; url: string; type: string }>;
    lessons: Array<{ date: Date; title: string; timeSlot: string | null; published: boolean }>;
  } | null;
};

type Status = { label: string; variant: BadgeVariant };

type Row = {
  id: string;
  date: Date | null;
  title: string;
  details: string[];
  badge: Status;
  extra?: ReactNode;
};

const TZ = "Europe/Rome";
const dayFmt = new Intl.DateTimeFormat("it-IT", { timeZone: TZ, day: "numeric" });
const monthFmt = new Intl.DateTimeFormat("it-IT", { timeZone: TZ, month: "short" });
const timeFmt = new Intl.DateTimeFormat("it-IT", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
const dateFmt = new Intl.DateTimeFormat("it-IT", { timeZone: TZ, day: "numeric", month: "short" });
const EUR = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" });

const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h} h${m ? ` ${m} min` : ""}` : `${m} min`;
};

/** Divide in "in programma" (dalla più vicina) e "passate" (dalla più recente). */
function splitByDate<T>(items: T[], getDate: (item: T) => Date | null, isPast: (item: T) => boolean) {
  const upcoming = items.filter((i) => !isPast(i));
  const past = items.filter(isPast);
  const time = (i: T) => getDate(i)?.getTime() ?? 0;
  upcoming.sort((a, b) => time(a) - time(b));
  past.sort((a, b) => time(b) - time(a));
  return { upcoming, past };
}

const TABLE_STATUS: Record<string, Status> = {
  CONFIRMED: { label: "Confermata", variant: "success" },
  SEATED: { label: "Completata", variant: "neutral" },
  CANCELLED: { label: "Cancellata", variant: "danger" },
};

const ENROLLMENT_STATUS: Record<string, Status> = {
  ACCEPTED: { label: "Iscritto", variant: "success" },
  PENDING: { label: "In attesa", variant: "primary" },
  REJECTED: { label: "Escluso", variant: "danger" },
};

function workspaceBadge(status: string, past: boolean): Status {
  if (status === "APPROVED") return { label: "Approvata", variant: "success" };
  if (status === "REJECTED") return { label: "Rifiutata", variant: "danger" };
  // Una richiesta mai approvata con data ormai passata non è più "in attesa".
  return past ? { label: "Scaduta", variant: "neutral" } : { label: "In attesa", variant: "primary" };
}

export function buildAreaData(
  tableReservations: TableReservation[],
  workspaceBookings: WorkspaceBooking[],
  enrollments: Enrollment[]
) {
  const now = Date.now();

  const tables = splitByDate(
    tableReservations,
    (r) => r.date,
    (r) => r.date.getTime() < now || r.status !== "CONFIRMED"
  );

  const workspace = splitByDate(
    workspaceBookings,
    (b) => b.date,
    (b) => b.date.getTime() < now || b.status === "REJECTED"
  );

  // Un corso è "passato" se concluso (data fine o ultima lezione nel passato) o se la candidatura è stata esclusa.
  const courseEnd = (e: Enrollment) => {
    const lessonDates = e.course?.lessons.map((l) => l.date.getTime()) ?? [];
    const end = e.course?.endDate?.getTime() ?? (lessonDates.length ? Math.max(...lessonDates) : null);
    return end;
  };
  const nextLesson = (e: Enrollment) =>
    e.course?.lessons
      .filter((l) => l.published && l.date.getTime() >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())[0] ?? null;
  const courses = splitByDate(
    enrollments,
    (e) => nextLesson(e)?.date ?? e.course?.startDate ?? e.createdAt,
    (e) => e.status === "REJECTED" || (courseEnd(e) ?? Infinity) < now
  );

  return {
    tavoli: {
      upcoming: tables.upcoming.map((r) => tableRow(r, false)),
      past: tables.past.map((r) => tableRow(r, true)),
    },
    workspace: {
      upcoming: workspace.upcoming.map((b) => workspaceRow(b, false)),
      past: workspace.past.map((b) => workspaceRow(b, true)),
    },
    corsi: {
      upcoming: courses.upcoming.map((e) => courseRow(e, nextLesson(e), false)),
      past: courses.past.map((e) => courseRow(e, null, true)),
    },
  };

  function tableRow(r: TableReservation, past: boolean): Row {
    const badge = TABLE_STATUS[r.status] ?? { label: r.status, variant: "neutral" };
    return {
      id: r.id,
      date: r.date,
      title: r.event?.name ?? "Prenotazione tavolo",
      details: [
        r.timeSlot ?? "",
        `${r.guests} ${r.guests === 1 ? "ospite" : "ospiti"}`,
        r.menu ? `Menù ${r.menu.name}` : "",
      ].filter(Boolean),
      // Una prenotazione confermata ormai passata non va mostrata come "Confermata" attiva.
      badge: past && r.status === "CONFIRMED" ? { label: "Conclusa", variant: "neutral" } : badge,
    };
  }

  function workspaceRow(b: WorkspaceBooking, past: boolean): Row {
    return {
      id: b.id,
      date: b.date,
      title: b.title || b.room?.name || "Workspace",
      details: [
        timeFmt.format(b.date),
        formatDuration(b.durationMinutes),
        b.title && b.room ? b.room.name : "",
        b.cost > 0 ? EUR.format(b.cost) : "",
      ].filter(Boolean),
      badge: past && b.status === "APPROVED"
        ? { label: "Conclusa", variant: "neutral" }
        : workspaceBadge(b.status, past),
    };
  }

  function courseRow(e: Enrollment, next: ReturnType<typeof nextLesson>, past: boolean): Row {
    const badge = ENROLLMENT_STATUS[e.status] ?? { label: e.status, variant: "neutral" };
    const details = next
      ? [`Prossima lezione: ${dateFmt.format(next.date)}${next.timeSlot ? ` · ${next.timeSlot}` : ""}`]
      : e.course?.startDate && e.course.startDate.getTime() > now
        ? [`Inizio: ${dateFmt.format(e.course.startDate)}`]
        : [];
    details.push(`Candidatura del ${dateFmt.format(e.createdAt)}`);
    const materials = e.status === "ACCEPTED" ? (e.course?.materials ?? []) : [];

    return {
      id: e.id,
      date: next?.date ?? e.course?.startDate ?? null,
      title: e.course?.title ?? "Corso",
      details,
      badge: past && e.status === "ACCEPTED" ? { label: "Concluso", variant: "neutral" } : badge,
      extra: materials.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-semibold text-zinc-500">Materiale didattico</p>
          {materials.map((mat) => (
            <a
              key={mat.id}
              href={mat.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-primary/15 bg-primary/5 px-3 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-primary/10"
            >
              <IconFileText className="h-4 w-4 shrink-0 text-primary" />
              <span className="min-w-0 flex-1 truncate">{mat.title}</span>
              <span className="shrink-0 text-xs font-bold uppercase text-zinc-400">{mat.type}</span>
            </a>
          ))}
        </div>
      ),
    };
  }
}

const TAB_CONFIG: Record<
  AreaTab,
  {
    label: string;
    icon: typeof IconNavEvents;
    action: { href: string; label: string };
    pastLabel: string;
    empty: { title: string; description: string };
  }
> = {
  tavoli: {
    label: "Tavoli",
    icon: IconNavEvents,
    action: { href: "/events", label: "Prenota un tavolo" },
    pastLabel: "Passate",
    empty: {
      title: "Nessun tavolo in programma",
      description: "Partecipa a uno dei nostri eventi con cena o aperitivo e prenota il tuo tavolo.",
    },
  },
  workspace: {
    label: "Workspace",
    icon: IconNavWorkspace,
    action: { href: "/workspace", label: "Prenota un workspace" },
    pastLabel: "Passate",
    empty: {
      title: "Nessun workspace in programma",
      description: "Ti serve una sala riunioni o un'aula attrezzata? Prenotala in pochi passaggi.",
    },
  },
  corsi: {
    label: "Corsi",
    icon: IconNavCourses,
    action: { href: "/courses", label: "Scopri i corsi" },
    pastLabel: "Conclusi",
    empty: {
      title: "Nessun corso in programma",
      description: "Scopri i percorsi formativi di Ottagora e invia la tua candidatura.",
    },
  },
};

export default function DashboardTabs({
  activeTab,
  data,
}: {
  activeTab: AreaTab;
  data: ReturnType<typeof buildAreaData>;
}) {
  const config = TAB_CONFIG[activeTab];
  const { upcoming, past } = data[activeTab];

  return (
    <div className="space-y-6">
      <nav
        aria-label="Le tue attività"
        className="grid grid-cols-3 gap-1 rounded-2xl border border-zinc-200/60 bg-white/60 p-1.5 shadow-sm"
      >
        {AREA_TABS.map((tab) => {
          const { label, icon: Icon } = TAB_CONFIG[tab];
          const count = data[tab].upcoming.length;
          const active = tab === activeTab;
          return (
            <Link
              key={tab}
              href={`/area-personale?tab=${tab}`}
              scroll={false}
              aria-current={active ? "page" : undefined}
              aria-label={count > 0 ? `${label}, ${count} in programma` : label}
              className={cn(
                "flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-xs font-bold transition-all sm:flex-row sm:gap-2 sm:py-2.5 sm:text-sm",
                active
                  ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/70"
                  : "text-zinc-500 hover:text-zinc-800"
              )}
            >
              {/* Il conteggio sta sull'angolo dell'icona: così su mobile la tab non si allarga. */}
              <span className="relative shrink-0">
                <Icon className={cn("h-5 w-5", active ? "text-primary" : "text-zinc-400")} />
                {count > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white"
                  >
                    {count}
                  </span>
                )}
              </span>
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-bold text-zinc-900">In programma</h2>
          {upcoming.length > 0 && (
            <Link
              href={config.action.href}
              className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-primary hover:brightness-90"
            >
              {config.action.label} <IconArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {upcoming.length === 0 ? (
          <EmptyState
            icon={config.icon}
            title={config.empty.title}
            description={config.empty.description}
            actions={
              <Button href={config.action.href} variant="primary">
                {config.action.label}
              </Button>
            }
          />
        ) : (
          <ul className="space-y-3">
            {upcoming.map((row) => (
              <ActivityRow key={row.id} row={row} />
            ))}
          </ul>
        )}
      </section>

      {past.length > 0 && (
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl py-2 text-base font-bold text-zinc-900 [&::-webkit-details-marker]:hidden">
            <span>
              {config.pastLabel} <span className="font-semibold text-zinc-400">({past.length})</span>
            </span>
            <span className="text-sm font-bold text-primary">
              <span className="group-open:hidden">Mostra</span>
              <span className="hidden group-open:inline">Nascondi</span>
            </span>
          </summary>
          <ul className="mt-3 space-y-3">
            {past.map((row) => (
              <ActivityRow key={row.id} row={row} muted />
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

function ActivityRow({ row, muted }: { row: Row; muted?: boolean }) {
  return (
    <li className="rounded-2xl border border-zinc-200/70 bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <div
          className={cn(
            "flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-xl",
            muted ? "bg-zinc-100 text-zinc-500" : "bg-primary/10 text-primary"
          )}
          aria-hidden={!row.date}
        >
          {row.date ? (
            <>
              <span className="text-lg font-extrabold leading-none">{dayFmt.format(row.date)}</span>
              <span className="mt-1 text-[11px] font-bold uppercase leading-none">
                {monthFmt.format(row.date).replace(".", "")}
              </span>
            </>
          ) : (
            <span className="text-lg font-extrabold">—</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className={cn("font-bold leading-snug", muted ? "text-zinc-600" : "text-zinc-900")}>
              {row.title}
            </p>
            <Badge variant={row.badge.variant} className="shrink-0 px-2.5 py-0.5">
              {row.badge.label}
            </Badge>
          </div>
          {row.details.length > 0 && (
            <p className="mt-1 text-sm leading-relaxed text-zinc-500">{row.details.join(" · ")}</p>
          )}
        </div>
      </div>
      {row.extra}
    </li>
  );
}
