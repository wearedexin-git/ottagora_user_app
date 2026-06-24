import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/ProfileForm";
import Link from "next/link";

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
        <Link
          href="/area-personale"
          className="text-xs text-zinc-500 hover:text-zinc-800 border border-zinc-200 rounded-xl px-4 py-2.5 bg-white hover:bg-zinc-50 font-bold shadow-sm transition-all cursor-pointer"
        >
          ← Area Personale
        </Link>
      </div>

      <ProfileForm initialUser={user} />
    </div>
  );
}
