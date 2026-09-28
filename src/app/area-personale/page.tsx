import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/app/actions/auth-actions";
import Link from "next/link";
import { IconSettings, IconLogOut } from "@/components/icons";
import { Card, Button, Badge } from "@/components/ui";
import DashboardTabs from "@/components/DashboardTabs";

export const revalidate = 0;

export default async function AreaPersonalePage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      tableReservations: {
        include: { event: true, menu: true },
        orderBy: { date: "asc" },
      },
      enrollments: {
        include: {
          course: {
            include: {
              materials: true,
              lessons: {
                include: { materials: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user || user.role !== "USER") {
    redirect("/login");
  }

  const workspaceBookings = await prisma.bookingRequest.findMany({
    where: { userId: user.id },
    include: { room: true },
    orderBy: { date: "asc" },
  });

  const userInitials =
    `${user.name?.[0] || ""}${user.surname?.[0] || ""}`.toUpperCase() ||
    user.email[0].toUpperCase();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 pb-8">
      <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-white font-extrabold text-xl shadow-md shrink-0">
            {userInitials}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight">
              {user.name && user.surname ? `${user.name} ${user.surname}` : "Utente Ottagora"}
            </h1>
            <p className="text-xs text-zinc-400 font-semibold mt-0.5">{user.email}</p>
            <Badge variant="neutral" className="mt-2">
              Profilo {user.userType === "COMPANY" ? "Azienda" : "Privato"}
            </Badge>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          <Button href="/area-personale/profile" variant="outline">
            <IconSettings className="h-3.5 w-3.5 text-zinc-500" /> Impostazioni Profilo
          </Button>
          <form action={logoutAction} className="inline-flex shrink-0">
            <button
              type="submit"
              className="text-xs border border-danger/20 bg-danger/5 hover:bg-danger/10 rounded-xl px-4 py-2.5 font-bold text-danger flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <IconLogOut className="h-3.5 w-3.5" /> Esci
            </button>
          </form>
        </div>
      </Card>

      <DashboardTabs user={user} workspaceBookings={workspaceBookings} />
    </div>
  );
}
