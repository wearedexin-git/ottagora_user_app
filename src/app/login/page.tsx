import { loginAction } from "@/app/actions/auth-actions";
import Link from "next/link";
import { Card, Button, Alert, PageHeader } from "@/components/ui";
import { DiagonalPattern } from "@/components/patterns";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const errorMsg =
    params.error === "manager"
      ? "Questo account è riservato al backoffice. Usa l'app solo con account utente."
      : params.error === "archived"
        ? "Account disabilitato. Contatta l'amministratore."
        : null;

  return (
    <div className="relative isolate flex-1 flex flex-col items-center justify-center py-16 px-4">
      {/* Pattern a tutto schermo, anche dietro la barra in alto (che qui mostra il logo bianco). */}
      <DiagonalPattern className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />
      <div className="w-full max-w-md">
        <Card padding="lg" glass={false}>
          <PageHeader eyebrow="Area riservata" title="Accedi" description="Entra con il tuo account Ottagora." />

          {errorMsg && (
            <Alert variant="danger" className="mb-6">
              {errorMsg}
            </Alert>
          )}

          <form action={loginAction} className="space-y-6">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="user@ottagora.com"
                className="w-full rounded-xl border border-zinc-200 bg-surface px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-zinc-700">
                Password <span className="font-normal">(mock: qualsiasi)</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-200 bg-surface px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-primary focus:outline-none"
              />
            </div>
            <Button type="submit" variant="primary" size="lg" fullWidth>
              Accedi
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Non hai un account?{" "}
            <Link href="/register" className="font-bold text-primary hover:brightness-90">
              Registrati
            </Link>
          </p>

          <div className="mt-6 pt-6 border-t border-zinc-100 text-center">
            <form action={loginAction}>
              <input type="hidden" name="email" value="user@ottagora.com" />
              <button
                type="submit"
                className="w-full text-xs text-ink bg-primary/5 hover:bg-primary/10 border border-primary/20 py-2.5 px-3 rounded-xl font-semibold cursor-pointer"
              >
                Demo: user@ottagora.com
              </button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
