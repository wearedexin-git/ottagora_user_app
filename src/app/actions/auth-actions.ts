"use server";

import { signIn, signOut, auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  anagraficaToPrismaData,
  appProfileToPrismaData,
  validateAnagraficaInput,
  type UserAnagraficaInput,
  type UserAppProfileInput,
} from "@/lib/user-anagrafica";

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.role !== "USER") {
    redirect("/login?error=manager");
  }
  if (existing?.archived) {
    redirect("/login?error=archived");
  }

  await signIn("credentials", {
    email,
    redirectTo: "/area-personale",
  });
}

export async function registerAction(
  formData: FormData
): Promise<{ error: string } | void> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const surname = String(formData.get("surname") ?? "").trim();
  const userType = (formData.get("userType") as string) === "COMPANY" ? "COMPANY" : "PRIVATE";

  if (!email || !name || !surname) {
    return { error: "Email, nome e cognome sono obbligatori." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Esiste già un account con questa email. Accedi." };
  }

  await prisma.user.create({
    data: {
      email,
      name,
      surname,
      role: "USER",
      userType,
    },
  });

  await signIn("credentials", { email, redirectTo: "/area-personale/profile" });
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

export async function getCurrentProfile() {
  const session = await auth();
  if (!session?.user?.email) return null;

  return prisma.user.findUnique({
    where: { email: session.user.email },
  });
}

export async function updateUserAnagrafica(data: UserAnagraficaInput) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Non autorizzato");
  }

  const validated = validateAnagraficaInput(data);
  if (validated.error || !validated.parsed) {
    throw new Error(validated.error ?? "Dati non validi.");
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: anagraficaToPrismaData(validated.parsed),
  });

  revalidatePath("/area-personale");
  revalidatePath("/area-personale/profile");
}

export async function updateUserAppProfile(data: UserAppProfileInput) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Non autorizzato");
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: appProfileToPrismaData(data),
  });

  revalidatePath("/area-personale");
  revalidatePath("/area-personale/profile");
}

export async function updateUserProfile(
  anagrafica: UserAnagraficaInput,
  appProfile: UserAppProfileInput
) {
  await updateUserAnagrafica(anagrafica);
  await updateUserAppProfile(appProfile);
}

