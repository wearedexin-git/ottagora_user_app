"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  anagraficaToPrismaData,
  isUserAnagraficaComplete,
  userToAnagraficaInput,
  validateAnagraficaInput,
} from "@/lib/user-anagrafica";
import {
  dataUrlExceedsLimit,
  FILE_SIZE_LIMIT_MESSAGE,
  MAX_UPLOAD_FILE_BYTES,
} from "@/lib/file-upload";

export async function submitCourseApplication(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Devi effettuare il login per candidarti." };
  }

  const courseId = formData.get("courseId") as string;
  const cvFile = formData.get("cv") as File | null;
  const acceptedPrivacy = formData.get("acceptedPrivacy") === "true";
  const message = String(formData.get("message") ?? "").trim() || null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user || user.role !== "USER") {
    return { error: "Non autorizzato." };
  }

  if (!isUserAnagraficaComplete(user)) {
    return {
      error:
        "Completa l'anagrafica nel profilo (codice fiscale e indirizzi) prima di candidarti.",
    };
  }

  const course = await prisma.course.findFirst({
    where: { id: courseId, published: true },
  });
  if (!course) {
    return { error: "Corso non disponibile." };
  }

  const existing = await prisma.courseEnrollment.findFirst({
    where: {
      courseId,
      OR: [{ userId: user.id }, { studentEmail: user.email }],
    },
  });
  if (existing) {
    return { error: "Hai già una candidatura o iscrizione per questo corso." };
  }

  if (!acceptedPrivacy) {
    return { error: "Devi accettare il trattamento dei dati." };
  }

  const isDirect = course.enrollmentMode === "DIRECT";
  let cvUrl = "";
  let cvFileName = "";

  if (!isDirect) {
    if (!cvFile || cvFile.size === 0) {
      return { error: "Il CV è obbligatorio (carica un PDF)." };
    }
    if (cvFile.size > MAX_UPLOAD_FILE_BYTES) {
      return { error: FILE_SIZE_LIMIT_MESSAGE };
    }
    const buffer = await cvFile.arrayBuffer();
    cvUrl = `data:${cvFile.type};base64,${Buffer.from(buffer).toString("base64")}`;
    cvFileName = cvFile.name;
    if (dataUrlExceedsLimit(cvUrl)) {
      return { error: FILE_SIZE_LIMIT_MESSAGE };
    }
  }

  const anagraficaValidated = validateAnagraficaInput(userToAnagraficaInput(user));
  if (anagraficaValidated.error || !anagraficaValidated.parsed) {
    return { error: anagraficaValidated.error ?? "Anagrafica incompleta." };
  }

  const defaultClass = await prisma.courseClass.findFirst({
    where: { courseId },
    orderBy: { createdAt: "asc" },
  });

  const studentName = `${user.name ?? ""} ${user.surname ?? ""}`.trim() || user.email;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: anagraficaToPrismaData(anagraficaValidated.parsed),
    }),
    prisma.courseEnrollment.create({
      data: {
        courseId,
        classId: defaultClass?.id ?? null,
        studentName,
        studentEmail: user.email,
        userId: user.id,
        status: isDirect ? "ACCEPTED" : "PENDING",
        applicationMessage: message,
        cvUrl: cvUrl || null,
        cvFileName: cvFileName || null,
        acceptedPrivacy: true,
      },
    }),
  ]);

  revalidatePath("/area-personale");
  revalidatePath("/courses");
  redirect("/area-personale?tab=corsi");
}
