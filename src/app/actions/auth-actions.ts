"use server";

import { signIn, signOut, auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function loginAction(formData: FormData): Promise<void> {
  const email = formData.get("email") as string;
  try {
    await signIn("credentials", {
      email,
      redirectTo: "/area-personale",
    });
  } catch (error: any) {
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

export async function getCurrentProfile() {
  const session = await auth();
  if (!session?.user?.email) return null;
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  return user;
}

export async function updateUserAnagrafica(data: any) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Non autorizzato");
  }

  const updatedUser = await prisma.user.update({
    where: { email: session.user.email },
    data: {
      type: data.type, // PRIVATE or COMPANY
      name: data.name,
      surname: data.surname,
      phone: data.phone,
      taxCode: data.taxCode,
      companyName: data.companyName,
      sdiPec: data.sdiPec,
      
      residenceAddress: data.residenceAddress,
      residenceCity: data.residenceCity,
      residenceZip: data.residenceZip,
      residenceProvince: data.residenceProvince,
      
      billingAddress: data.billingAddress,
      billingCity: data.billingCity,
      billingZip: data.billingZip,
      billingProvince: data.billingProvince,
      billingSameAsResidence: data.billingSameAsResidence,
      
      shippingAddress: data.shippingAddress,
      shippingCity: data.shippingCity,
      shippingZip: data.shippingZip,
      shippingProvince: data.shippingProvince,
      
      diet: data.diet,
      mealVouchers: data.mealVouchers,
    },
  });

  revalidatePath("/dashboard/profile");
  revalidatePath("/area-personale");
  return updatedUser;
}
