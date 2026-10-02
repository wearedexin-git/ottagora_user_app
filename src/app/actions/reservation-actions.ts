"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  isUserAnagraficaComplete,
  userToAnagraficaInput,
} from "@/lib/user-anagrafica";
import {
  calculateMeetingCost,
  validateRoomBooking,
} from "@/lib/room-availability";

function displayRequester(user: {
  name: string | null;
  surname: string | null;
  email: string;
  companyName?: string | null;
  userType?: string | null;
}) {
  const person = `${user.name ?? ""} ${user.surname ?? ""}`.trim() || user.email;
  if (user.userType === "COMPANY" && user.companyName?.trim()) {
    return `${user.companyName.trim()} (${person})`;
  }
  return person;
}

export async function submitTableReservation(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Devi effettuare il login per prenotare un tavolo." };
  }

  const eventId = formData.get("eventId") as string;
  const guests = parseInt(formData.get("guests") as string, 10);
  const timeSlot = String(formData.get("timeSlot") ?? "").trim();
  const menuId = String(formData.get("menuId") ?? "").trim() || undefined;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user || user.role !== "USER") {
    return { error: "Non autorizzato." };
  }

  if (!isUserAnagraficaComplete(user)) {
    return {
      error:
        "Completa l'anagrafica nel profilo (codice fiscale e indirizzi) prima di prenotare.",
    };
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      date: true,
      roomId: true,
      menuId: true,
      visibility: true,
    },
  });
  if (!event || event.visibility !== "PUBLIC") {
    return { error: "Evento non trovato." };
  }

  const existing = await prisma.tableReservation.findFirst({
    where: {
      userId: user.id,
      eventId,
      status: { not: "CANCELLED" },
    },
  });
  if (existing) {
    return { error: "Hai già una prenotazione attiva per questo evento." };
  }

  if (!guests || guests < 1) {
    return { error: "Indica almeno una persona." };
  }
  if (!timeSlot) {
    return { error: "Seleziona la fascia oraria." };
  }

  const resolvedMenuId = menuId || event.menuId;
  if (!resolvedMenuId) {
    return {
      error: "Questo evento non ha un menù associato. Contatta il ristorante.",
    };
  }

  const customerName = `${user.name ?? ""} ${user.surname ?? ""}`.trim() || user.email;

  await prisma.tableReservation.create({
    data: {
      customerName,
      status: "CONFIRMED",
      checkedIn: false,
      guests,
      timeSlot,
      date: event.date,
      userId: user.id,
      eventId: event.id,
      menuId: resolvedMenuId,
      roomId: event.roomId,
    },
  });

  revalidatePath("/area-personale");
  revalidatePath("/events");
  redirect("/area-personale?tab=tavoli");
}

export async function submitWorkspaceBooking(data: {
  roomId: string;
  date: string;
  guests: number;
  durationMinutes: number;
  bookingType: "Riunione" | "Accesso for Work";
}) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Devi effettuare il login per prenotare una sala." };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user || user.role !== "USER") {
    return { error: "Non autorizzato." };
  }

  if (!isUserAnagraficaComplete(user)) {
    return {
      error:
        "Completa l'anagrafica nel profilo (codice fiscale e indirizzi) prima di prenotare.",
    };
  }

  const room = await prisma.room.findUnique({
    where: { id: data.roomId },
  });
  if (!room) {
    return { error: "Sala non trovata." };
  }

  const startDate = new Date(data.date);
  const endDate = new Date(startDate.getTime() + data.durationMinutes * 60 * 1000);

  const availability = validateRoomBooking(room.availability, startDate, endDate);
  if (!availability.valid) {
    return { error: availability.error ?? "Orario non disponibile." };
  }

  const cost =
    data.bookingType === "Riunione" && room.type === "MEETING"
      ? calculateMeetingCost(room.hourlyCost, data.durationMinutes)
      : 0;

  await prisma.bookingRequest.create({
    data: {
      requester: displayRequester(user),
      userId: user.id,
      type: data.bookingType,
      date: startDate,
      guests: data.guests,
      durationMinutes: data.durationMinutes,
      cost,
      status: "PENDING",
      checkedIn: false,
      roomId: room.id,
    },
  });

  revalidatePath("/area-personale");
  return { success: true as const };
}

export async function submitQuoteRequest(formData: FormData) {
  const session = await auth();
  const requesterEmail =
    session?.user?.email || String(formData.get("email") ?? "").trim() || "Anonimo";

  const eventType = String(formData.get("eventType") ?? "");
  const dateStr = String(formData.get("date") ?? "");
  const guests = parseInt(String(formData.get("guests") ?? "0"), 10);
  const notes = String(formData.get("notes") ?? "");
  const recall = formData.get("recall") === "true";

  if (!eventType || !dateStr) {
    redirect("/quote-request?error=missing");
  }

  const room = await prisma.room.findFirst({
    where: { type: "MULTI_SPACE" },
  });
  if (!room) {
    redirect("/quote-request?error=room");
  }

  const startDate = new Date(`${dateStr}T10:00:00`);

  await prisma.bookingRequest.create({
    data: {
      requester: `${requesterEmail} | ${eventType} | Recall: ${recall ? "SI" : "NO"} | ${notes}`.trim(),
      type: "Evento",
      date: startDate,
      guests: guests || 0,
      durationMinutes: 180,
      cost: 0,
      status: "PENDING",
      checkedIn: false,
      roomId: room.id,
      ...(session?.user?.id ? { userId: session.user.id } : {}),
    },
  });

  revalidatePath("/");
  redirect("/?quote=ok");
}
