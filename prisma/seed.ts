import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({
  url: `file:${dbPath}`,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding data...");

  // 1. Clean up existing data
  await prisma.tableReservation.deleteMany();
  await prisma.event.deleteMany();
  await prisma.calendarSlot.deleteMany();
  await prisma.bookingRequest.deleteMany();
  await prisma.lessonAttendance.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.courseEnrollment.deleteMany();
  await prisma.courseMaterial.deleteMany();
  await prisma.course.deleteMany();
  await prisma.roomService.deleteMany();
  await prisma.room.deleteMany();
  await prisma.roomTemplate.deleteMany();
  await prisma.table.deleteMany();
  await prisma.technicalService.deleteMany();
  await prisma.food.deleteMany();
  await prisma.beverage.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.allergen.deleteMany();
  await prisma.user.deleteMany();
  await prisma.templateType.deleteMany();
  await prisma.mealTimeSlot.deleteMany();
  await prisma.bookingType.deleteMany();
  await prisma.courseType.deleteMany();
  await prisma.lessonType.deleteMany();

  // 2. Create Taxonomies
  const slotCena = await prisma.mealTimeSlot.create({ data: { name: "Cena" } });
  const slotPranzo = await prisma.mealTimeSlot.create({ data: { name: "Pranzo" } });
  const slotColazione = await prisma.mealTimeSlot.create({ data: { name: "Colazione" } });

  await prisma.bookingType.create({ data: { name: "Riunione", hasCost: true } });
  await prisma.bookingType.create({ data: { name: "Evento", hasCost: false } });
  await prisma.bookingType.create({ data: { name: "Accesso for Work", hasCost: true } });

  await prisma.courseType.create({ data: { name: "Professionale" } });
  await prisma.courseType.create({ data: { name: "Accademico" } });

  await prisma.lessonType.create({ data: { name: "Teoria" } });
  await prisma.lessonType.create({ data: { name: "Pratica" } });

  const gluten = await prisma.allergen.create({ data: { name: "Glutine" } });
  const lactose = await prisma.allergen.create({ data: { name: "Lattosio" } });

  // 3. Create Foods & Beverages
  const lasagna = await prisma.food.create({
    data: {
      name: "Lasagna alla Bolognese",
      ingredients: "Sfoglia all'uovo, ragù di manzo e maiale, besciamella, Parmigiano Reggiano.",
      quantity: 50,
      unit: "PZ",
      cost: 12.0,
      allergens: { connect: [{ id: gluten.id }, { id: lactose.id }] },
    },
  });

  const insalata = await prisma.food.create({
    data: {
      name: "Insalata Vegana Superfood",
      ingredients: "Misticanza, tofu grigliato, avocado, noci, semi di chia, pomodorini, salsa senape.",
      quantity: 30,
      unit: "PZ",
      cost: 9.5,
    },
  });

  const tiramisu = await prisma.food.create({
    data: {
      name: "Tiramisù Classico",
      ingredients: "Savoiardi, mascarpone fresco, uova, caffè, cacao amaro.",
      quantity: 40,
      unit: "PZ",
      cost: 5.0,
      allergens: { connect: [{ id: gluten.id }, { id: lactose.id }] },
    },
  });

  const water = await prisma.beverage.create({
    data: {
      name: "Acqua Minerale Naturale 50cl",
      ingredients: "Acqua minerale",
      quantity: 100,
      unit: "PZ",
      cost: 1.5,
    },
  });

  const wine = await prisma.beverage.create({
    data: {
      name: "Chianti Classico DOCG 75cl",
      ingredients: "Uve Sangiovese fermentate",
      quantity: 24,
      unit: "PZ",
      cost: 18.0,
    },
  });

  // 4. Create Menus
  const menuToscano = await prisma.menu.create({
    data: {
      name: "Menù Tradizione Toscana",
      dietType: "standard",
      timeSlot: slotCena.name,
      cost: 35.0,
      foods: { connect: [{ id: lasagna.id }, { id: tiramisu.id }] },
      beverages: { connect: [{ id: wine.id }] },
    },
  });

  const menuVeg = await prisma.menu.create({
    data: {
      name: "Menù Vegano & Vitalità",
      dietType: "VEGAN",
      timeSlot: slotPranzo.name,
      cost: 20.0,
      foods: { connect: [{ id: insalata.id }] },
      beverages: { connect: [{ id: water.id }] },
    },
  });

  // 5. Users (Teacher, Admin, User)
  const teacher = await prisma.user.create({
    data: {
      email: "teacher@ottagora.com",
      role: "TEACHER",
      name: "Chiara",
      surname: "Rossi",
      bio: "Docente senior di Sviluppo Web con 10 anni di esperienza su React e Next.js.",
      competencies: "JavaScript, TypeScript, React, Next.js, Node.js",
    },
  });

  const defaultUser = await prisma.user.create({
    data: {
      email: "user@ottagora.com",
      role: "USER",
      name: "Giuseppe",
      surname: "Verdi",
      phone: "+39 345 678901",
      taxCode: "VRDGPP80A01F205Z",
      residenceAddress: "Via Roma 10",
      residenceCity: "Milano",
      residenceZip: "20121",
      residenceProvince: "MI",
    },
  });

  // 6. Rooms & Templates
  const templateSala = await prisma.roomTemplate.create({
    data: {
      name: "Allestimento Standard",
      type: "Standard",
    },
  });

  const roomMeeting = await prisma.room.create({
    data: {
      name: "Sala Riunioni Leonardo",
      type: "MEETING",
      capacity: 12,
      hourlyCost: 40.0,
      availability: JSON.stringify({
        weekly: [
          { day: 1, slots: [{ from: "09:00", to: "18:00" }] },
          { day: 2, slots: [{ from: "09:00", to: "18:00" }] },
          { day: 3, slots: [{ from: "09:00", to: "18:00" }] },
          { day: 4, slots: [{ from: "09:00", to: "18:00" }] },
          { day: 5, slots: [{ from: "09:00", to: "18:00" }] },
        ],
        exceptions: [],
      }),
    },
  });

  const roomTraining = await prisma.room.create({
    data: {
      name: "Aula Formazione Copernico",
      type: "TRAINING",
      capacity: 20,
      availability: JSON.stringify({
        weekly: [
          { day: 1, slots: [{ from: "09:00", to: "18:00" }] },
          { day: 2, slots: [{ from: "09:00", to: "18:00" }] },
          { day: 3, slots: [{ from: "09:00", to: "18:00" }] },
          { day: 4, slots: [{ from: "09:00", to: "18:00" }] },
          { day: 5, slots: [{ from: "09:00", to: "18:00" }] },
        ],
        exceptions: [],
      }),
    },
  });

  const roomMulti = await prisma.room.create({
    data: {
      name: "Salone Ottagora",
      type: "MULTI_SPACE",
      capacity: 80,
      availability: JSON.stringify({
        weekly: [
          { day: 1, slots: [{ from: "08:00", to: "23:00" }] },
          { day: 2, slots: [{ from: "08:00", to: "23:00" }] },
          { day: 3, slots: [{ from: "08:00", to: "23:00" }] },
          { day: 4, slots: [{ from: "08:00", to: "23:00" }] },
          { day: 5, slots: [{ from: "08:00", to: "23:00" }] },
          { day: 6, slots: [{ from: "08:00", to: "23:00" }] },
        ],
        exceptions: [],
      }),
    },
  });

  // Tables
  const table1 = await prisma.table.create({
    data: { identifier: "T1", capacity: 4, roomId: roomMulti.id },
  });
  const table2 = await prisma.table.create({
    data: { identifier: "T2", capacity: 4, roomId: roomMulti.id },
  });

  // 7. Technical Services
  const projector = await prisma.technicalService.create({
    data: { name: "Proiettore 4K", description: "Proiettore laser ad alta definizione", status: "AVAILABLE", cost: 0.0 },
  });
  const whiteboard = await prisma.technicalService.create({
    data: { name: "Lavagna Interattiva", description: "Lavagna digitale touch screen", status: "AVAILABLE", cost: 0.0 },
  });

  await prisma.roomService.create({ data: { roomId: roomMeeting.id, technicalServiceId: projector.id } });
  await prisma.roomService.create({ data: { roomId: roomMeeting.id, technicalServiceId: whiteboard.id } });

  // 8. Events
  const event1 = await prisma.event.create({
    data: {
      name: "Serata Degustazione Chianti",
      description: "Un viaggio sensoriale attraverso le migliori cantine del Chianti, accompagnato da una selezione di piatti tipici toscani.",
      type: "Gastronomia",
      timeSlot: slotCena.name,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000 * 2), // in 2 days
      cost: 45.0,
      roomId: roomMulti.id,
      menuId: menuToscano.id,
      templateId: templateSala.id,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      name: "Pranzo di Lavoro Smart",
      description: "Networking veloce a pranzo con menù salutare e leggero per professionisti ed innovatori.",
      type: "Networking",
      timeSlot: slotPranzo.name,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000 * 5), // in 5 days
      cost: 25.0,
      roomId: roomMulti.id,
      menuId: menuVeg.id,
      templateId: templateSala.id,
    },
  });

  // 9. Courses & Lessons
  const course = await prisma.course.create({
    data: {
      name: "Full-Stack React & Next.js 16",
      description: "Corso pratico intensivo per imparare a creare moderne applicazioni web full-stack stabili, sicure e performanti.",
      courseType: "Professionale",
      duration: 36.0,
      lessonsCount: 6,
      published: true,
      featured: true,
      weeklyDay: "Lunedì",
      lessonsRecurring: true,
      cost: 590.0,
      maxStudents: 15,
      teacherId: teacher.id,
      roomId: roomTraining.id,
    },
  });

  const lesson1 = await prisma.lesson.create({
    data: {
      lessonNumber: 1,
      description: "Fondamenti di Next.js 16, App Router e Server Components vs Client Components.",
      lessonType: "Teoria",
      published: true,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000 * 4), // in 4 days
      timeSlot: "Pomeriggio",
      duration: 180,
      courseId: course.id,
      teacherId: teacher.id,
      roomId: roomTraining.id,
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      lessonNumber: 2,
      description: "Mutazione dati: Server Actions e integrazione avanzata con Prisma ORM.",
      lessonType: "Pratica",
      published: true,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000 * 11), // in 11 days
      timeSlot: "Pomeriggio",
      duration: 180,
      courseId: course.id,
      teacherId: teacher.id,
      roomId: roomTraining.id,
    },
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
