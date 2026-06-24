import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/app/actions/auth-actions";
import Link from "next/link";
import { Settings, LogOut, Shield } from "lucide-react";
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
      reservations: {
        include: {
          event: true,
          menu: true,
        },
        orderBy: {
          date: "asc",
        },
      },
      enrollments: {
        include: {
          course: {
            include: {
              materials: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Fetch all workspace bookings requested by this user's email
  const workspaceBookings = await prisma.bookingRequest.findMany({
    where: {
      requester: user.email,
    },
    include: {
      room: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  const userInitials = `${user.name?.[0] || ""}${user.surname?.[0] || ""}`.toUpperCase() || user.email[0].toUpperCase();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 pb-8">
      {/* Profile Card Header */}
      <div className="glass rounded-3xl p-6 border border-zinc-200/40 bg-white/50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-extrabold text-xl shadow-md border border-amber-400/20 shrink-0">
            {userInitials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight">
                {user.name && user.surname ? `${user.name} ${user.surname}` : "Utente Ottagora"}
              </h1>
              {user.role === "ADMIN" && (
                <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold bg-red-50 text-red-650 px-2 py-0.5 rounded-full border border-red-100 uppercase tracking-wider">
                  <Shield className="h-2.5 w-2.5" /> Staff
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 font-semibold mt-0.5">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-bold bg-zinc-100 text-zinc-500 px-2.5 py-0.5 rounded-md border border-zinc-200/50">
                Profilo {user.type === "COMPANY" ? "Azienda" : "Privato"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/area-personale/profile"
            className="text-xs border border-zinc-200 bg-white rounded-xl px-4 py-2.5 hover:bg-zinc-50 font-bold text-zinc-700 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Settings className="h-3.5 w-3.5 text-zinc-500" /> Impostazioni Profilo
          </Link>
          <form action={logoutAction} className="inline-flex shrink-0">
            <button
              type="submit"
              className="text-xs border border-red-100 bg-red-50/40 hover:bg-red-50/80 rounded-xl px-4 py-2.5 font-bold text-red-600 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" /> Esci
            </button>
          </form>
        </div>
      </div>

      {/* Main Dynamic Tabs Dashboard Component */}
      <DashboardTabs user={user} workspaceBookings={workspaceBookings} />
    </div>
  );
}
