import { startOfDay } from "date-fns";
import { prisma } from "@/lib/prisma";

const eventListInclude = {
  room: { select: { id: true, name: true } },
  menu: {
    select: {
      id: true,
      name: true,
      cost: true,
      dietType: true,
      timeSlot: true,
    },
  },
} as const;

export async function getPublicUpcomingEvents(limit?: number) {
  const today = startOfDay(new Date());

  return prisma.event.findMany({
    where: {
      visibility: "PUBLIC",
      date: { gte: today },
    },
    include: eventListInclude,
    orderBy: { date: "asc" },
    ...(limit ? { take: limit } : {}),
  });
}

export async function getPublicEventById(eventId: string) {
  const today = startOfDay(new Date());

  return prisma.event.findFirst({
    where: {
      id: eventId,
      visibility: "PUBLIC",
      date: { gte: today },
    },
    include: {
      room: true,
      menu: {
        include: {
          foods: {
            include: {
              food: {
                include: {
                  allergens: { include: { allergen: true } },
                },
              },
            },
          },
          beverages: {
            include: {
              beverage: true,
            },
          },
        },
      },
    },
  });
}
