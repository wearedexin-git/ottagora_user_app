import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { submitCourseApplication } from "@/app/actions/training-actions";
import Link from "next/link";

export default async function ApplyCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      teacher: true,
      room: true,
    },
  });

  if (!course) {
    redirect("/courses");
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="glass rounded-3xl p-8 shadow-xl bg-white/50 border-zinc-200/40">
        <div className="mb-6">
          <Link href="/courses" className="text-xs text-zinc-400 hover:text-amber-600 transition-colors">
            ← Torna ai corsi
          </Link>
          <h1 className="text-2xl font-extrabold text-zinc-900 mt-2">Candidatura Corso</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Ti stai candidando per: <strong className="text-zinc-700">{course.name}</strong>
          </p>
        </div>

        <form action={submitCourseApplication} method="POST" encType="multipart/form-data" className="space-y-6">
          <input type="hidden" name="courseId" value={course.id} />

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Carica il tuo Curriculum Vitae (PDF)
            </label>
            <div className="mt-1 flex justify-center rounded-2xl border border-dashed border-zinc-200 px-6 py-10 bg-white shadow-sm">
              <div className="text-center">
                <div className="mt-4 flex text-sm leading-6 text-zinc-500 justify-center">
                  <label
                    htmlFor="cv"
                    className="relative cursor-pointer rounded-md font-semibold text-amber-600 hover:text-amber-500 focus-within:outline-none"
                  >
                    <span>Seleziona un file</span>
                    <input
                      id="cv"
                      name="cv"
                      type="file"
                      accept=".pdf"
                      required
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="text-xs leading-5 text-zinc-400">Solo formato PDF (Max 4MB)</p>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-150 pt-4 text-xs text-zinc-500 space-y-2">
            <div className="flex justify-between">
              <span>Tipologia:</span>
              <span className="text-zinc-700 font-semibold">{course.courseType}</span>
            </div>
            <div className="flex justify-between">
              <span>Docente:</span>
              <span className="text-zinc-700 font-semibold">
                {course.teacher ? `${course.teacher.name} ${course.teacher.surname}` : "Ottagora Team"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Aula:</span>
              <span className="text-zinc-700 font-semibold">{course.room?.name || "Copernico"}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-3 text-sm font-bold text-white shadow-md hover:brightness-110 transition-all cursor-pointer"
          >
            Invia la Candidatura
          </button>
        </form>
      </div>
    </div>
  );
}
