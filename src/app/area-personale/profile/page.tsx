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
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        back={{ href: "/area-personale", label: "Area personale" }}
        title="Il tuo profilo"
        description="Gestisci le tue informazioni anagrafiche, fiscali e preferenze alimentari."
      />

      <ProfileForm initialUser={user} />
    </div>
  );
}
