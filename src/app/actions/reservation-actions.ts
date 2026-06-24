"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitTableReservation(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Non autorizzato");
  }

  const eventId = formData.get("eventId") as string;
  const guests = parseInt(formData.get("guests") as string);
  const timeSlot = formData.get("timeSlot") as string;
  const menuId = formData.get("menuId") as string;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { room: true },
  });

  if (!event) {
    throw new Error("Evento non trovato");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error("Utente non trovato");
  }

  await prisma.tableReservation.create({
    data: {
      status: "CONFIRMED",
      checkedIn: false,
      guests,
      timeSlot,
      date: event.date,
      userId: user.id,
      eventId: event.id,
      menuId: menuId || null,
      roomId: event.roomId || null,
    },
  });

  revalidatePath("/area-personale");
  redirect("/area-personale");
}

export async function submitWorkspaceBooking(data: {
  roomId: string;
  date: string;
  guests: number;
  durationMinutes: number;
}) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Non autorizzato");
  }

  const room = await prisma.room.findUnique({
    where: { id: data.roomId },
  });

  if (!room) {
    throw new Error("Sala non trovata");
  }

  // Calculate cost
  const cost = room.hourlyCost * (data.durationMinutes / 60);

  const startDate = new Date(data.date);
  const endDate = new Date(startDate.getTime() + data.durationMinutes * 60 * 1000);

  await prisma.bookingRequest.create({
    data: {
      requester: session.user.email,
      type: "Riunione",
      date: startDate,
      guests: data.guests,
      durationMinutes: data.durationMinutes,
      endTime: endDate,
      cost,
      status: "PENDING",
      checkedIn: false,
      roomId: room.id,
    },
  });

  revalidatePath("/area-personale");
  return { success: true };
}

export async function submitQuoteRequest(formData: FormData) {
  const session = await auth();
  const requesterEmail = session?.user?.email || (formData.get("email") as string) || "Anonimo";

  const eventType = formData.get("eventType") as string;
  const dateStr = formData.get("date") as string;
  const guests = parseInt(formData.get("guests") as string || "0");
  const notes = formData.get("notes") as string;
  const recall = formData.get("recall") === "true";

  const room = await prisma.room.findFirst({
    where: { type: "MULTI_SPACE" },
  });

  const startDate = new Date(dateStr);
  const endDate = new Date(startDate.getTime() + 180 * 60 * 1000); // 3 hours default

  await prisma.bookingRequest.create({
    data: {
      requester: `${requesterEmail} - Tipo: ${eventType} - Recall: ${recall ? 'SI' : 'NO'} - Note: ${notes}`,
      type: "Evento",
      date: startDate,
      guests,
      durationMinutes: 180,
      endTime: endDate,
      cost: 0.0, // Preventivo da calcolare manualmente dal gestore
      status: "PENDING",
      checkedIn: false,
      roomId: room?.id || "",
    },
  });

  revalidatePath("/area-personale");
  redirect("/");
}
