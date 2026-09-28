import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/ProfileForm";
import { Button } from "@/components/ui";

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
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 pb-8">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
            Il Tuo Profilo
          </h1>
          <p className="mt-2 text-sm text-zinc-500 font-medium">
            Gestisci le tue informazioni anagrafiche, fiscali e preferenze alimentari.
          </p>
        </div>
        <Button href="/area-personale" variant="outline">
          ← Area Personale
        </Button>
      </div>

      <ProfileForm initialUser={user} />
    </div>
  );
}
