import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getPublicEventById } from "@/lib/events";
import { isUserAnagraficaComplete } from "@/lib/user-anagrafica";
import ReserveTableForm from "@/components/ReserveTableForm";
import { toMenuDetail } from "@/lib/menu-detail";

export const revalidate = 0;

export default async function ReserveTablePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const event = await getPublicEventById(id);

  if (!event) {
    redirect("/events");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? "" },
  });

  if (!user || user.role !== "USER") {
    redirect("/login");
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 pt-4 pb-8 sm:px-6 sm:pt-8 sm:pb-12">
      <ReserveTableForm
        event={{ ...event, menu: event.menu ? toMenuDetail(event.menu) : null }}
        anagraficaComplete={isUserAnagraficaComplete(user)}
      />
    </div>
  );
}
