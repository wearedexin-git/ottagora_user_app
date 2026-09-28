import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, Button, Badge } from "@/components/ui";

export const revalidate = 0;

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-b border-zinc-200/50 pb-6 mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          Corsi di Formazione
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Sviluppa nuove competenze professionali con i nostri docenti senior nelle aule dedicate.
        </p>
      </div>

      {courses.length === 0 ? (
        <Card padding="none" className="p-12 text-center">
          <p className="text-zinc-500 text-sm">Non ci sono corsi attivi al momento.</p>
        </Card>
      ) : (
        <div className="space-y-12">
          {courses.map((course) => {
            const hours = Math.round((course.totalDurationMinutes / 60) * 10) / 10;
            return (
              <Card
                key={course.id}
                padding="none"
                className="overflow-hidden grid grid-cols-1 lg:grid-cols-3"
              >
                <div className="p-6 sm:p-8 lg:col-span-2 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1.5 mb-4">
                      <Badge variant="primary" className="uppercase tracking-wider">
                        {course.courseType}
                      </Badge>
                      <Badge variant="neutral">{hours} ore totali</Badge>
                    </div>

                    <h2 className="text-xl font-bold text-zinc-900 mb-2 leading-tight">
                      {course.title}
                    </h2>
                    <p className="text-zinc-500 text-xs leading-relaxed mb-6">
                      {course.description}
                    </p>

                    <div>
                      <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">
                        Piano delle lezioni ({course.lessons.length})
                      </h3>
                      <div className="space-y-3.5">
                        {course.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl bg-white border border-zinc-100 shadow-sm text-xs"
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-[10px] bg-primary text-white font-bold px-2 py-0.5 rounded-md mt-0.5 shrink-0">
                                Lz {lesson.lessonNumber}
                              </span>
                              <div>
                                <p className="font-bold text-zinc-800">{lesson.title}</p>
                                <p className="text-[10px] text-zinc-400 mt-0.5">
                                  {lesson.lessonType}
                                </p>
                              </div>
                            </div>
                            <div className="text-[10px] text-zinc-400 mt-2 sm:mt-0 text-left sm:text-right shrink-0">
                              <p className="font-bold text-zinc-700">
                                {new Date(lesson.date).toLocaleDateString("it-IT", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </p>
                              <p>
                                {lesson.timeSlot} ({lesson.duration} min)
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="text-[10px] text-zinc-400 space-x-4">
                      <span>
                        Max studenti:{" "}
                        <strong className="text-zinc-600 font-semibold">
                          {course.maxStudents}
                        </strong>
                      </span>
                      <span>
                        Aula:{" "}
                        <strong className="text-zinc-600 font-semibold">
                          {course.room?.name || "—"}
                        </strong>
                      </span>
                    </div>
                    <div className="text-lg font-extrabold text-primary">
                      {course.cost === 0 ? "Gratuito" : `${course.cost.toFixed(2)}€`}
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 bg-zinc-50/50 border-t lg:border-t-0 lg:border-l border-zinc-100 flex flex-col justify-between gap-6">
                  {course.teacher && (
                    <div>
                      <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">
                        Docente di riferimento
                      </h4>
                      <div className="p-4 rounded-xl bg-white border border-zinc-100 shadow-sm text-xs">
                        <p className="font-bold text-zinc-800">
                          {course.teacher.name} {course.teacher.surname}
                        </p>
                        <p className="text-zinc-500 leading-relaxed mt-2">{course.teacher.bio}</p>
                      </div>
                    </div>
                  )}

                  <Button href={`/courses/${course.id}/apply`} variant="secondary" fullWidth>
                    Invia Candidatura
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
