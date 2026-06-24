"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Briefcase, 
  Award, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  XCircle,
  TrendingUp,
  BookOpen,
  MapPin,
  Users
} from "lucide-react";

interface DashboardTabsProps {
  user: {
    name: string | null;
    surname: string | null;
    email: string;
    role: string;
    reservations: Array<{
      id: string;
      date: Date | string;
      timeSlot: string;
      guests: number;
      event: {
        name: string;
      } | null;
      menu: {
        name: string;
      } | null;
    }>;
    enrollments: Array<{
      id: string;
      status: string;
      createdAt: Date | string;
      course: {
        name: string;
        materials: Array<{
          id: string;
          name: string;
          url: string;
          type: string;
        }>;
      } | null;
    }>;
  };
  workspaceBookings: Array<{
    id: string;
    date: Date | string;
    durationMinutes: number;
    cost: number;
    status: string;
    room: {
      name: string;
    } | null;
  }>;
}

export default function DashboardTabs({ user, workspaceBookings }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<"all" | "tables" | "workspace" | "courses">("all");

  const tablesCount = user.reservations.length;
  const workspaceCount = workspaceBookings.length;
  const coursesCount = user.enrollments.length;

  // Calculate statistics
  const upcomingTables = user.reservations.filter(r => new Date(r.date) >= new Date()).length;
  const pendingWorkspace = workspaceBookings.filter(b => b.status === "PENDING").length;
  const approvedWorkspace = workspaceBookings.filter(b => b.status === "APPROVED").length;
  const acceptedCourses = user.enrollments.filter(e => e.status === "ACCEPTED").length;

  return (
    <div className="space-y-8">
      {/* Visual Statistics Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Tavoli */}
        <div 
          onClick={() => setActiveTab("tables")}
          className={`glass p-6 rounded-3xl border transition-all cursor-pointer group relative overflow-hidden ${
            activeTab === "tables" 
              ? "border-amber-500/50 bg-amber-500/5 shadow-md ring-1 ring-amber-500/20" 
              : "border-zinc-200/50 bg-white/50 hover:bg-white hover:border-zinc-300/80 shadow-sm"
          }`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110 duration-500" />
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 transition-transform group-hover:scale-105 duration-300">
              <Calendar className="h-6 w-6" />
            </div>
            <span className="text-3xl font-extrabold text-zinc-900 tracking-tight">{tablesCount}</span>
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="text-sm font-bold text-zinc-800">Tavoli & Eventi</h3>
            <p className="text-xs text-zinc-400 font-medium">
              {upcomingTables > 0 
                ? `${upcomingTables} prenotazioni attive` 
                : "Nessuna prenotazione attiva"}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-amber-600 group-hover:text-amber-700">
            <span>Gestisci prenotazioni</span>
            <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Workspace */}
        <div 
          onClick={() => setActiveTab("workspace")}
          className={`glass p-6 rounded-3xl border transition-all cursor-pointer group relative overflow-hidden ${
            activeTab === "workspace" 
              ? "border-amber-500/50 bg-amber-500/5 shadow-md ring-1 ring-amber-500/20" 
              : "border-zinc-200/50 bg-white/50 hover:bg-white hover:border-zinc-300/80 shadow-sm"
          }`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110 duration-500" />
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-600 transition-transform group-hover:scale-105 duration-300">
              <Briefcase className="h-6 w-6" />
            </div>
            <span className="text-3xl font-extrabold text-zinc-900 tracking-tight">{workspaceCount}</span>
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="text-sm font-bold text-zinc-800">Aule & Workspace</h3>
            <p className="text-xs text-zinc-400 font-medium">
              {pendingWorkspace > 0 
                ? `${pendingWorkspace} in attesa, ${approvedWorkspace} approvate`
                : `${approvedWorkspace} prenotazioni approvate`}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-orange-600 group-hover:text-orange-700">
            <span>Dettagli sale e aule</span>
            <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Corsi */}
        <div 
          onClick={() => setActiveTab("courses")}
          className={`glass p-6 rounded-3xl border transition-all cursor-pointer group relative overflow-hidden ${
            activeTab === "courses" 
              ? "border-amber-500/50 bg-amber-500/5 shadow-md ring-1 ring-amber-500/20" 
              : "border-zinc-200/50 bg-white/50 hover:bg-white hover:border-zinc-300/80 shadow-sm"
          }`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-600/10 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110 duration-500" />
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-2xl bg-amber-600/10 text-amber-700 transition-transform group-hover:scale-105 duration-300">
              <Award className="h-6 w-6" />
            </div>
            <span className="text-3xl font-extrabold text-zinc-900 tracking-tight">{coursesCount}</span>
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="text-sm font-bold text-zinc-800">I Miei Corsi</h3>
            <p className="text-xs text-zinc-400 font-medium">
              {acceptedCourses > 0 
                ? `${acceptedCourses} corsi attivi / frequentati` 
                : "Candidature in attesa di approvazione"}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-amber-750 group-hover:text-amber-800">
            <span>Materiali e lezioni</span>
            <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Sliding Glass Tabs Controller */}
      <div className="glass p-1.5 rounded-2xl border border-zinc-200/40 bg-white/40 shadow-sm flex items-center gap-1 overflow-x-auto max-w-full no-scrollbar">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 min-w-[100px] text-center py-2.5 px-4 rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer shrink-0 ${
            activeTab === "all"
              ? "bg-white text-zinc-800 shadow-sm border border-zinc-200/50"
              : "text-zinc-500 hover:text-zinc-800 hover:bg-white/30"
          }`}
        >
          Tutte le Attività
        </button>
        <button
          onClick={() => setActiveTab("tables")}
          className={`flex-1 min-w-[100px] text-center py-2.5 px-4 rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
            activeTab === "tables"
              ? "bg-white text-zinc-800 shadow-sm border border-zinc-200/50"
              : "text-zinc-500 hover:text-zinc-800 hover:bg-white/30"
          }`}
        >
          <Calendar className="h-3.5 w-3.5 text-amber-500" /> Tavoli
          <span className="ml-1 bg-zinc-100 text-zinc-500 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">{tablesCount}</span>
        </button>
        <button
          onClick={() => setActiveTab("workspace")}
          className={`flex-1 min-w-[100px] text-center py-2.5 px-4 rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
            activeTab === "workspace"
              ? "bg-white text-zinc-800 shadow-sm border border-zinc-200/50"
              : "text-zinc-500 hover:text-zinc-800 hover:bg-white/30"
          }`}
        >
          <Briefcase className="h-3.5 w-3.5 text-orange-500" /> Workspace
          <span className="ml-1 bg-zinc-100 text-zinc-500 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">{workspaceCount}</span>
        </button>
        <button
          onClick={() => setActiveTab("courses")}
          className={`flex-1 min-w-[100px] text-center py-2.5 px-4 rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
            activeTab === "courses"
              ? "bg-white text-zinc-800 shadow-sm border border-zinc-200/50"
              : "text-zinc-500 hover:text-zinc-800 hover:bg-white/30"
          }`}
        >
          <Award className="h-3.5 w-3.5 text-amber-600" /> Corsi
          <span className="ml-1 bg-zinc-100 text-zinc-500 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">{coursesCount}</span>
        </button>
      </div>

      {/* Tab Contents View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-w-0">
        {/* Left main contents (Tavoli & Workspace) */}
        <div className="lg:col-span-2 space-y-8 min-w-0">
          
          {/* Section: Tavoli Reservations */}
          {(activeTab === "all" || activeTab === "tables") && (
            <div className="glass rounded-3xl p-6 bg-white/50 border-zinc-200/40 shadow-sm space-y-6 animate-in fade-in duration-300 min-w-0 overflow-hidden">
              <div className="flex justify-between items-center border-b border-zinc-100 pb-3 gap-2">
                <h2 className="text-sm font-extrabold text-zinc-800 uppercase tracking-widest flex items-center gap-2 shrink-0">
                  <Calendar className="h-4.5 w-4.5 text-amber-500" /> Prenotazioni Tavoli
                </h2>
                <Link 
                  href="/events" 
                  className="text-xs text-amber-600 font-bold hover:text-amber-700 flex items-center gap-1 shrink-0"
                >
                  Nuova <span className="hidden sm:inline">Prenotazione</span> <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {tablesCount === 0 ? (
                <div className="text-center py-10 px-4 space-y-4">
                  <div className="mx-auto w-12 h-12 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-850">Nessuna prenotazione trovata</h4>
                    <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                      Non hai ancora prenotato alcun tavolo. Unisciti ai nostri eventi esclusivi con cena o aperitivo.
                    </p>
                  </div>
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-4 py-2.5 shadow-sm transition-all cursor-pointer"
                  >
                    Scopri Eventi
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 min-w-0">
                  {user.reservations.map((res) => (
                    <div
                      key={res.id}
                      className="p-5 rounded-2xl bg-white border border-zinc-100 shadow-sm hover:shadow-md hover:border-zinc-200 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 group min-w-0 overflow-hidden"
                    >
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-extrabold text-sm text-zinc-855 group-hover:text-amber-600 transition-colors truncate">
                            {res.event?.name || "Evento Ottagora"}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400 font-semibold">
                          <span className="flex items-center gap-1 shrink-0">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(res.date).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                          <span className="text-zinc-200 hidden sm:inline">•</span>
                          <span className="flex items-center gap-1 shrink-0">
                            <Clock className="h-3.5 w-3.5" />
                            {res.timeSlot}
                          </span>
                          <span className="text-zinc-200 hidden sm:inline">•</span>
                          <span className="flex items-center gap-1 shrink-0">
                            <Users className="h-3.5 w-3.5" />
                            {res.guests} {res.guests === 1 ? "Ospite" : "Ospiti"}
                          </span>
                        </div>
                        {res.menu && (
                          <div className="pt-1">
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-700 bg-amber-500/10 px-3 py-1 rounded-full max-w-full truncate">
                              <BookOpen className="h-3 w-3 shrink-0" />
                              Menù: {res.menu.name}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-3.5 py-1 text-xs font-bold leading-5 shadow-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Confermata
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section: Workspace Bookings */}
          {(activeTab === "all" || activeTab === "workspace") && (
            <div className="glass rounded-3xl p-6 bg-white/50 border-zinc-200/40 shadow-sm space-y-6 animate-in fade-in duration-300 min-w-0 overflow-hidden">
              <div className="flex justify-between items-center border-b border-zinc-100 pb-3 gap-2">
                <h2 className="text-sm font-extrabold text-zinc-800 uppercase tracking-widest flex items-center gap-2 shrink-0">
                  <Briefcase className="h-4.5 w-4.5 text-orange-500" /> Aule & Workspace
                </h2>
                <Link 
                  href="/workspace" 
                  className="text-xs text-orange-600 font-bold hover:text-orange-700 flex items-center gap-1 shrink-0"
                >
                  Prenota <span className="hidden sm:inline">Aula</span> <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {workspaceCount === 0 ? (
                <div className="text-center py-10 px-4 space-y-4">
                  <div className="mx-auto w-12 h-12 bg-orange-500/10 text-orange-600 rounded-full flex items-center justify-center">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-850">Nessun workspace prenotato</h4>
                    <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                      Hai bisogno di una sala riunioni privata o di un'aula multimediale professionale? Organizza le tue sessioni qui.
                    </p>
                  </div>
                  <Link
                    href="/workspace"
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-4 py-2.5 shadow-sm transition-all cursor-pointer"
                  >
                    Prenota Spazio
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 min-w-0">
                  {workspaceBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-5 rounded-2xl bg-white border border-zinc-100 shadow-sm hover:shadow-md hover:border-zinc-200 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 group min-w-0 overflow-hidden"
                    >
                      <div className="space-y-2 min-w-0 flex-1">
                        <p className="font-extrabold text-sm text-zinc-855 group-hover:text-orange-600 transition-colors truncate">
                          {booking.room?.name || "Aula Workspace"}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400 font-semibold">
                          <span className="flex items-center gap-1 shrink-0">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(booking.date).toLocaleDateString("it-IT")}
                          </span>
                          <span className="text-zinc-200 hidden sm:inline">•</span>
                          <span className="flex items-center gap-1 shrink-0">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(booking.date).toLocaleTimeString("it-IT", { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-zinc-200 hidden sm:inline">•</span>
                          <span className="shrink-0">{booking.durationMinutes} min ({Math.round(booking.durationMinutes / 60)}h)</span>
                        </div>
                        <p className="text-xs font-extrabold text-zinc-700 flex items-center gap-1">
                          <TrendingUp className="h-3.5 w-3.5 text-orange-500" />
                          Tariffa: <span className="text-zinc-900">{booking.cost.toFixed(2)}€</span>
                        </p>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold leading-5 border shadow-sm ${
                          booking.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : booking.status === "REJECTED"
                            ? "bg-red-50 text-red-650 border-red-100"
                            : "bg-amber-50 text-amber-700 border-amber-100"
                        }`}>
                          {booking.status === "APPROVED" && (
                            <>
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Approvata
                            </>
                          )}
                          {booking.status === "REJECTED" && (
                            <>
                              <XCircle className="h-3 w-3 text-red-500" />
                              Rifiutata
                            </>
                          )}
                          {booking.status === "PENDING" && (
                            <>
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                              In attesa
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right column (Corsi & Formazione) */}
        <div className="space-y-8 min-w-0">
          {(activeTab === "all" || activeTab === "courses") && (
            <div className="glass rounded-3xl p-6 bg-white/50 border-zinc-200/40 shadow-sm space-y-6 animate-in fade-in duration-300 min-w-0 overflow-hidden">
              <div className="flex justify-between items-center border-b border-zinc-100 pb-3 gap-2">
                <h2 className="text-sm font-extrabold text-zinc-800 uppercase tracking-widest flex items-center gap-2 shrink-0">
                  <Award className="h-4.5 w-4.5 text-amber-600" /> I Miei Corsi
                </h2>
                <Link 
                  href="/courses" 
                  className="text-xs text-amber-700 font-bold hover:text-amber-800 flex items-center gap-1 shrink-0"
                >
                  Sfoglia <span className="hidden sm:inline">Corsi</span> <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {coursesCount === 0 ? (
                <div className="text-center py-10 px-4 space-y-4">
                  <div className="mx-auto w-12 h-12 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-850">Candidati a un corso</h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      Ottagora offre percorsi formativi specialistici d'avanguardia. Presenta la tua candidatura per iniziare.
                    </p>
                  </div>
                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-4 py-2.5 shadow-sm transition-all cursor-pointer"
                  >
                    Scopri Corsi
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 min-w-0">
                  {user.enrollments.map((enr) => (
                    <div key={enr.id} className="p-5 rounded-2xl bg-white border border-zinc-100 shadow-sm space-y-4 group min-w-0 overflow-hidden">
                      <div className="flex justify-between items-start gap-3 min-w-0">
                        <div className="space-y-1 min-w-0 flex-1">
                          <p className="font-extrabold text-sm text-zinc-855 group-hover:text-amber-750 transition-colors leading-snug truncate">
                            {enr.course?.name}
                          </p>
                          <p className="text-[10px] text-zinc-450 font-semibold flex items-center gap-1 shrink-0">
                            <Clock className="h-3 w-3 text-zinc-300" />
                            Inviata: {new Date(enr.createdAt).toLocaleDateString("it-IT")}
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold leading-5 border shadow-sm shrink-0 ${
                          enr.status === "ACCEPTED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : enr.status === "REJECTED"
                            ? "bg-red-50 text-red-650 border-red-105"
                            : "bg-amber-50 text-amber-700 border-amber-100"
                        }`}>
                          {enr.status === "ACCEPTED" && (
                            <>
                              <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                              Iscritto
                            </>
                          )}
                          {enr.status === "REJECTED" && (
                            <>
                              <span className="h-1 w-1 rounded-full bg-red-500" />
                              Escluso
                            </>
                          )}
                          {enr.status === "PENDING" && (
                            <>
                              <span className="h-1 w-1 rounded-full bg-amber-500 animate-pulse" />
                              In attesa
                            </>
                          )}
                        </span>
                      </div>

                      {/* Display course materials only when application status is ACCEPTED */}
                      {enr.status === "ACCEPTED" && enr.course?.materials && enr.course.materials.length > 0 && (
                        <div className="border-t border-zinc-100 pt-4 space-y-2.5 min-w-0">
                          <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                            <FileText className="h-3 w-3" /> Materiale Didattico
                          </h4>
                          <div className="space-y-2 min-w-0">
                            {enr.course.materials.map((mat) => (
                              <a
                                key={mat.id}
                                href={mat.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between text-xs text-amber-750 bg-amber-500/5 hover:bg-amber-500/10 p-3 rounded-xl border border-amber-500/10 font-bold transition-all shadow-sm group/file min-w-0 overflow-hidden"
                              >
                                <span className="flex items-center gap-2 truncate flex-1 min-w-0">
                                  <FileText className="h-4 w-4 text-amber-600 shrink-0" />
                                  <span className="truncate group-hover/file:underline">{mat.name}</span>
                                </span>
                                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-extrabold bg-white px-2 py-0.5 rounded-md border border-zinc-150 shrink-0">
                                  {mat.type}
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
