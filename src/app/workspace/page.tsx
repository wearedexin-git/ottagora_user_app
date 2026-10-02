import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isUserAnagraficaComplete } from "@/lib/user-anagrafica";
import WorkspaceBookingForm from "@/components/WorkspaceBookingForm";
import { Button, EmptyState, PageHeader } from "@/components/ui";
import { IconNavWorkspace } from "@/components/icons";

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
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        title="Prenota Workspace"
        description="Prenota una sala riunioni o una postazione di lavoro. Riceverai conferma dopo l'approvazione."
      />

      {rooms.length === 0 ? (
        <EmptyState
          icon={IconNavWorkspace}
          title="Nessuna sala disponibile"
          description="Al momento non ci sono sale prenotabili. Riprova più tardi."
          actions={
            <Button href="/" variant="outline">
              Torna alla dashboard
            </Button>
          }
        />
      ) : (
        <WorkspaceBookingForm rooms={rooms} anagraficaComplete={isUserAnagraficaComplete(user)} />
      )}
    </div>
  );
}
