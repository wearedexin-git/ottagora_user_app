import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { isUserAnagraficaComplete } from "@/lib/user-anagrafica";
import WorkspaceBookingForm from "@/components/WorkspaceBookingForm";
import { Card } from "@/components/ui";

export const revalidate = 0;

export default async function WorkspacePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? "" },
  });
  if (!user || user.role !== "USER") redirect("/login");

  const rooms = await prisma.room.findMany({
    where: { type: "MEETING" },
    select: { id: true, name: true, capacity: true, hourlyCost: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
      <Card padding="lg" className="shadow-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-zinc-900">Prenota Workspace</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Sala riunioni o accesso for work. La richiesta sarà in attesa di approvazione.
          </p>
          {!isUserAnagraficaComplete(user) && (
            <Link href="/area-personale/profile" className="text-xs text-primary font-bold mt-2 inline-block">
              → Completa anagrafica
            </Link>
          )}
        </div>

        {rooms.length === 0 ? (
          <p className="text-sm text-zinc-500">Nessuna sala disponibile al momento.</p>
        ) : (
          <WorkspaceBookingForm
            rooms={rooms}
            anagraficaComplete={isUserAnagraficaComplete(user)}
          />
        )}
      </Card>
    </div>
  );
}
