import { prisma } from "@/lib/prisma";
import { Card, Button, Badge, EmptyState, PageHeader } from "@/components/ui";
import { IconNavCourses } from "@/components/icons";
import { formatCost, formatDateShort } from "@/lib/format";
import CoursesFilters from "@/components/CoursesFilters";

export const revalidate = 0;

const WEEKDAYS: Record<string, string> = {
  MON: "lunedì",
  TUE: "martedì",
  WED: "mercoledì",
  THU: "giovedì",
  FRI: "venerdì",
  SAT: "sabato",
  SUN: "domenica",
};


const normalize = (text: string) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tipo?: string; prezzo?: string }>;
}) {
  const { q = "", tipo = "", prezzo = "" } = await searchParams;

  const allCourses = await prisma.course.findMany({
    where: { published: true },
    include: {
      teacher: true,
      room: true,
      lessons: {
        where: { published: true },
        orderBy: { lessonNumber: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const types = [...new Set(allCourses.map((c) => c.courseType).filter((t): t is string => !!t))].sort();
  const terms = normalize(q).split(/\s+/).filter(Boolean);

  const courses = allCourses.filter((course) => {
    if (tipo && course.courseType !== tipo) return false;
    if (prezzo === "gratuiti" && course.cost > 0) return false;
    if (prezzo === "a-pagamento" && course.cost === 0) return false;
    if (terms.length) {
      const haystack = normalize(
        [
          course.title,
          course.description,
          course.courseType,
          course.teacher?.name,
          course.teacher?.surname,
        ]
          .filter(Boolean)
          .join(" ")
      );
      if (!terms.every((term) => haystack.includes(term))) return false;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 pt-4 pb-8 sm:px-6 sm:pt-8 sm:pb-12 lg:px-8">
      <PageHeader eyebrow="Corsi" title="Formazione" />

      {allCourses.length > 0 && (
        <CoursesFilters
          q={q}
          tipo={tipo}
          prezzo={prezzo}
          types={types}
          resultCount={courses.length}
          totalCount={allCourses.length}
        />
      )}

      {allCourses.length === 0 ? (
        <EmptyState
          icon={IconNavCourses}
          title="Nessun corso disponibile"
          description="Stiamo preparando i prossimi percorsi formativi. Torna a trovarci presto."
          actions={
            <Button href="/" variant="outline">
              Torna alla dashboard
            </Button>
          }
        />
      ) : courses.length === 0 ? (
        <EmptyState
          icon={IconNavCourses}
          title="Nessun corso trovato"
          description="Nessun corso corrisponde ai filtri selezionati. Prova a cambiare la ricerca."
          actions={
            <Button href="/courses" variant="outline">
              Azzera filtri
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {courses.map((course) => {
            const hours = Math.round((course.totalDurationMinutes / 60) * 10) / 10;
            const lessonCount = course.lessonCount || course.lessons.length;
            const weekday =
              course.lessonsRecurring && course.weeklyDay ? WEEKDAYS[course.weeklyDay] : null;
            const facts = [
              {
                label: "Inizio",
                value: course.startDate
                  ? `${formatDateShort(course.startDate)}${weekday ? ` · ogni ${weekday}` : ""}`
                  : "Da definire",
              },
              {
                label: "Durata",
                value: [
                  lessonCount && `${lessonCount} ${lessonCount === 1 ? "lezione" : "lezioni"}`,
                  hours && `${hours.toLocaleString("it-IT")} ore`,
                ]
                  .filter(Boolean)
                  .join(" · ") || "—",
              },
              {
                label: "Docente",
                value: course.teacher
                  ? `${course.teacher.name ?? ""} ${course.teacher.surname ?? ""}`.trim()
                  : "—",
              },
              { label: "Aula", value: course.room?.name ?? "—" },
              { label: "Posti", value: course.maxStudents ? String(course.maxStudents) : "—" },
            ];

            return (
              <Card key={course.id} className="flex flex-col min-w-0">
                <div className="flex items-center justify-between gap-3">
                  {/* "Gratuito" come tipologia ripeterebbe il prezzo mostrato a destra */}
                  {course.courseType && course.courseType !== "Gratuito" ? (
                    <Badge variant="primary" className="uppercase tracking-wider">
                      {course.courseType}
                    </Badge>
                  ) : (
                    <span />
                  )}
                  <span className="text-lg font-extrabold text-primary">
                    {formatCost(course.cost)}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-semibold leading-tight text-zinc-900">
                  {course.title}
                </h2>
                {course.description && (
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">{course.description}</p>
                )}

                <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-zinc-200/60 pt-5">
                  {facts.map((fact) => (
                    <div key={fact.label} className="min-w-0">
                      <dt className="text-xs font-semibold text-zinc-400">{fact.label}</dt>
                      <dd className="mt-0.5 text-sm font-semibold text-zinc-800">{fact.value}</dd>
                    </div>
                  ))}
                </dl>

                {(course.lessons.length > 0 || course.teacher?.bio) && (
                  <div className="mt-5 divide-y divide-zinc-200/60 border-y border-zinc-200/60">
                    {course.lessons.length > 0 && (
                      <details className="group py-3">
                        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-zinc-800 [&::-webkit-details-marker]:hidden">
                          Piano delle lezioni ({course.lessons.length})
                          <span className="text-primary transition-transform group-open:rotate-90">›</span>
                        </summary>
                        <ol className="mt-3 space-y-3">
                          {course.lessons.map((lesson) => (
                            <li key={lesson.id} className="flex gap-3 text-sm">
                              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                                {lesson.lessonNumber}
                              </span>
                              <div className="min-w-0">
                                <p className="font-semibold text-zinc-800">{lesson.title}</p>
                                <p className="text-xs text-zinc-500">
                                  {formatDateShort(lesson.date)}
                                  {lesson.timeSlot && ` · ${lesson.timeSlot}`} · {lesson.duration} min
                                </p>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </details>
                    )}
                    {course.teacher?.bio && (
                      <details className="group py-3">
                        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-zinc-800 [&::-webkit-details-marker]:hidden">
                          Chi è il docente
                          <span className="text-primary transition-transform group-open:rotate-90">›</span>
                        </summary>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-600">{course.teacher.bio}</p>
                      </details>
                    )}
                  </div>
                )}

                <div className="mt-auto pt-6">
                  <Button href={`/courses/${course.id}/apply`} variant="primary" size="lg" fullWidth>
                    {course.enrollmentMode === "DIRECT" ? "Iscriviti" : "Candidati"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
