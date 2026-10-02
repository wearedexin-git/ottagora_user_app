import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isUserAnagraficaComplete } from "@/lib/user-anagrafica";
import CourseApplyForm from "@/components/CourseApplyForm";
import { PageHeader } from "@/components/ui";

export default async function ApplyCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;

  const [course, user] = await Promise.all([
    prisma.course.findFirst({
      where: { id, published: true },
      include: { teacher: true, room: true },
    }),
    prisma.user.findUnique({ where: { email: session.user?.email ?? "" } }),
  ]);

  if (!course) redirect("/courses");
  if (!user || user.role !== "USER") redirect("/login");

  const direct = course.enrollmentMode === "DIRECT";

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        back={{ href: "/courses", label: "Torna ai corsi" }}
        title={direct ? "Iscrizione al corso" : "Candidatura corso"}
        description={
          direct ? (
            <>
              Ti stai iscrivendo a <strong className="text-zinc-700">{course.title}</strong>. L&apos;iscrizione
              è immediata, senza selezione.
            </>
          ) : (
            <>
              Ti stai candidando a <strong className="text-zinc-700">{course.title}</strong>. Riceverai
              l&apos;esito dopo la valutazione della candidatura.
            </>
          )
        }
      />

      <CourseApplyForm
        courseId={course.id}
        direct={direct}
        anagraficaComplete={isUserAnagraficaComplete(user)}
      />

      <div className="mt-8 border-t border-zinc-200/60 pt-4 text-xs text-zinc-500 space-y-1">
        <p>Docente: {course.teacher ? `${course.teacher.name} ${course.teacher.surname}` : "—"}</p>
        <p>Aula: {course.room?.name ?? "—"}</p>
      </div>
    </div>
  );
}
