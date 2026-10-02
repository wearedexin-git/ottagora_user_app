import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/ProfileForm";
import { PageHeader } from "@/components/ui";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-4 pb-8 sm:px-6 sm:pt-8 sm:pb-12">
      <PageHeader
        eyebrow="Area personale"
        backHref="/area-personale"
        title="Il tuo profilo"
        description="Gestisci le tue informazioni anagrafiche, fiscali e preferenze alimentari."
      />

      <ProfileForm initialUser={user} />
    </div>
  );
}
