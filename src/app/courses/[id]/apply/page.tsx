import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isUserAnagraficaComplete } from "@/lib/user-anagrafica";
import CourseApplyForm from "@/components/CourseApplyForm";
import Link from "next/link";
import { Card } from "@/components/ui";

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

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
      <Card padding="lg" className="shadow-xl">
        <div className="mb-6">
          <Link href="/courses" className="text-xs text-zinc-400 hover:text-primary">
            ← Torna ai corsi
          </Link>
          <h1 className="text-2xl font-extrabold text-zinc-900 mt-2">Candidatura Corso</h1>
        </div>

        <CourseApplyForm
          courseId={course.id}
          courseTitle={course.title}
          requiresCv={course.enrollmentMode !== "DIRECT"}
          anagraficaComplete={isUserAnagraficaComplete(user)}
        />

        <div className="mt-6 border-t border-zinc-100 pt-4 text-xs text-zinc-500 space-y-1">
          <p>Docente: {course.teacher ? `${course.teacher.name} ${course.teacher.surname}` : "—"}</p>
          <p>Aula: {course.room?.name ?? "—"}</p>
        </div>
      </Card>
    </div>
  );
}
