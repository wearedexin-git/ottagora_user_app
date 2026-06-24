"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitCourseApplication(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Non autorizzato");
  }

  const courseId = formData.get("courseId") as string;
  const cvFile = formData.get("cv") as File;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new Error("Corso non trovato");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error("Utente non trovato");
  }

  let cvUrl = "";
  let cvFileName = "";

  if (cvFile && cvFile.size > 0) {
    // Convert PDF file to base64 data URL
    const buffer = await cvFile.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    cvUrl = `data:${cvFile.type};base64,${base64}`;
    cvFileName = cvFile.name;
  }

  await prisma.courseEnrollment.create({
    data: {
      status: "PENDING",
      cvUrl,
      cvFileName,
      studentName: `${user.name || ""} ${user.surname || ""}`.trim() || user.email,
      studentEmail: user.email,
      userId: user.id,
      courseId: course.id,
    },
  });

  revalidatePath("/area-personale");
  redirect("/area-personale");
}
