import { addDays } from "date-fns";
import { prisma } from "@/lib/prisma";

export type UpcomingActivity = {
  id: string;
  kind: "table" | "workspace" | "lesson";
  title: string;
  subtitle: string;
  date: Date;
  timeLabel: string | null;
  pending: boolean;
};

const ROME_TIME = new Intl.DateTimeFormat("it-IT", {
  timeZone: "Europe/Rome",
  hour: "2-digit",
  minute: "2-digit",
});

/**
 * Attività dell'utente nei prossimi 7 giorni (finestra mobile da adesso, così la
 * sezione non si svuota a fine settimana), unite in un'unica lista ordinata per data:
 * - tavoli confermati
 * - workspace approvati o in attesa (i rifiutati sono esclusi)
 * - lezioni pubblicate dei corsi a cui l'utente è iscritto (candidatura accettata):
 *   una candidatura in attesa non ha date fissate, resta visibile solo in area personale
 */
export async function getUpcomingActivities(userId: string): Promise<UpcomingActivity[]> {
  const now = new Date();
  const range = { gte: now, lt: addDays(now, 7) };

  const [tables, bookings, lessons] = await Promise.all([
    prisma.tableReservation.findMany({
      where: { userId, status: "CONFIRMED", date: range },
      include: { event: { select: { name: true } } },
    }),
    prisma.bookingRequest.findMany({
      where: { userId, status: { in: ["APPROVED", "PENDING"] }, date: range },
      include: { room: { select: { name: true } } },
    }),
    prisma.lesson.findMany({
      where: {
        published: true,
        date: range,
        course: { enrollments: { some: { userId, status: "ACCEPTED" } } },
      },
      include: { course: { select: { title: true } } },
    }),
  ]);

  const activities: UpcomingActivity[] = [
    ...tables.map((t) => ({
      id: t.id,
      kind: "table" as const,
      title: "Tavolo prenotato",
      subtitle: t.event?.name ?? `${t.guests} ospiti`,
      date: t.date,
      timeLabel: t.timeSlot,
      pending: false,
    })),
    ...bookings.map((b) => ({
      id: b.id,
      kind: "workspace" as const,
      title: "Workspace",
      subtitle: b.title || b.room.name,
      date: b.date,
      timeLabel: ROME_TIME.format(b.date),
      pending: b.status === "PENDING",
    })),
    ...lessons.map((l) => ({
      id: l.id,
      kind: "lesson" as const,
      title: l.course.title,
      subtitle: `Lezione ${l.lessonNumber}${l.title ? ` · ${l.title}` : ""}`,
      date: l.date,
      timeLabel: l.timeSlot ?? ROME_TIME.format(l.date),
      pending: false,
    })),
  ];

  return activities.sort((a, b) => a.date.getTime() - b.date.getTime());
}
