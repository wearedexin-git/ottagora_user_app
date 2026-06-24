import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import WorkspaceBookingForm from "@/components/WorkspaceBookingForm";

export const revalidate = 0;

export default async function WorkspacePage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  // Fetch all meeting type rooms
  const rooms = await prisma.room.findMany({
    where: {
      type: "MEETING",
    },
    select: {
      id: true,
      name: true,
      capacity: true,
      hourlyCost: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="glass rounded-3xl p-8 shadow-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-white">Prenota una Sala Riunione</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Seleziona la sala, configura la data e la durata. Il sistema calcolerà automaticamente il costo orario complessivo.
          </p>
        </div>

        {rooms.length === 0 ? (
          <div className="p-4 text-center text-sm text-zinc-400 bg-white/5 rounded-lg">
            Nessuna sala riunioni disponibile al momento.
          </div>
        ) : (
          <WorkspaceBookingForm rooms={rooms} />
        )}
      </div>
    </div>
  );
}
