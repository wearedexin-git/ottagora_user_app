import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/app/actions/auth-actions";
import { isUserAnagraficaComplete } from "@/lib/user-anagrafica";
import { IconArrowRight, IconLogOut } from "@/components/icons";
import { PageHeader } from "@/components/ui";
import DashboardTabs, { AREA_TABS, buildAreaData, type AreaTab } from "@/components/DashboardTabs";

export const revalidate = 0;

export default async function AreaPersonalePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      tableReservations: {
        include: { event: { select: { name: true } }, menu: { select: { name: true } } },
      },
      enrollments: {
        include: {
          course: {
            include: {
              materials: true,
              lessons: { select: { date: true, title: true, timeSlot: true, published: true } },
            },
          },
        },
      },
    },
  });

  if (!user || user.role !== "USER") {
    redirect("/login");
  }

  const workspaceBookings = await prisma.bookingRequest.findMany({
    where: { userId: user.id },
    include: { room: { select: { name: true } } },
  });

  const data = buildAreaData(user.tableReservations, workspaceBookings, user.enrollments);

  // Tab dall'URL; senza parametro si apre la prima tab con qualcosa in programma.
  const { tab } = await searchParams;
  const activeTab: AreaTab = AREA_TABS.includes(tab as AreaTab)
    ? (tab as AreaTab)
    : (AREA_TABS.find((t) => data[t].upcoming.length > 0) ?? "tavoli");

  const fullName = [user.name, user.surname].filter(Boolean).join(" ");
  const profileComplete = isUserAnagraficaComplete(user);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 pt-4 pb-8 sm:px-6 sm:pt-8 sm:pb-12">
      <PageHeader eyebrow="Area personale" title={fullName || "Il tuo account"} className="mb-0">
        <p className="mt-1 truncate text-sm text-zinc-500">{user.email}</p>
        {/* Il testo del link indica anche lo stato: "Completa" se mancano dati obbligatori. */}
        <Link
          href="/area-personale/profile"
          className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary hover:brightness-90"
        >
          {profileComplete ? "Modifica profilo" : "Completa il profilo"}
          <IconArrowRight className="h-3.5 w-3.5" />
        </Link>
      </PageHeader>

      <DashboardTabs activeTab={activeTab} data={data} />

      <form action={logoutAction} className="border-t border-zinc-200/60 pt-6 text-center">
        <button
          type="submit"
          className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-zinc-500 transition-colors hover:text-danger"
        >
          <IconLogOut className="h-4 w-4" /> Esci dall&apos;account
        </button>
      </form>
    </div>
  );
}
