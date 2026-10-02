import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/app/actions/auth-actions";
import { isUserAnagraficaComplete } from "@/lib/user-anagrafica";
import { IconLogOut, IconNavProfile } from "@/components/icons";
import { Badge } from "@/components/ui";
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
  const initials =
    `${user.name?.[0] ?? ""}${user.surname?.[0] ?? ""}`.toUpperCase() || user.email[0].toUpperCase();
  const profileComplete = isUserAnagraficaComplete(user);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
      <header className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-lg font-extrabold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-extrabold tracking-tight text-zinc-900">
              {fullName || "Il tuo account"}
            </h1>
            <p className="truncate text-sm text-zinc-500">{user.email}</p>
          </div>
        </div>

        <Link
          href="/area-personale/profile"
          className="flex items-center gap-3 rounded-2xl border border-zinc-200/70 bg-white px-4 py-3.5 shadow-sm transition-colors hover:border-zinc-300"
        >
          <IconNavProfile className="h-5 w-5 shrink-0 text-primary" />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-zinc-900">Il tuo profilo</span>
            <span className="block truncate text-xs text-zinc-500">
              Profilo {user.userType === "COMPANY" ? "azienda" : "privato"} · dati anagrafici e preferenze
            </span>
          </span>
          {profileComplete ? (
            <Badge variant="success" className="shrink-0 px-2.5 py-0.5">
              Completo
            </Badge>
          ) : (
            <Badge variant="primary" className="shrink-0 px-2.5 py-0.5">
              Da completare
            </Badge>
          )}
          <span className="shrink-0 text-lg leading-none text-zinc-400" aria-hidden="true">
            ›
          </span>
        </Link>
      </header>

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
