"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { registerAction } from "@/app/actions/auth-actions";
import { Card, Button, Alert, PageHeader } from "@/components/ui";
import { cn } from "@/lib/cn";
import { DiagonalPattern } from "@/components/patterns";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [userType, setUserType] = useState<"PRIVATE" | "COMPANY">("PRIVATE");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    formData.set("userType", userType);
    setError(null);
    startTransition(async () => {
      const result = await registerAction(formData);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <div className="relative isolate flex-1 flex flex-col items-center justify-center py-16 px-4">
      {/* Pattern a tutto schermo, anche dietro la barra in alto (che qui mostra il logo bianco). */}
      <DiagonalPattern className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />
      <div className="w-full max-w-md">
        <Card padding="lg" glass={false}>
          <PageHeader eyebrow="Nuovo account" title="Registrati" description="Crea il tuo account Ottagora." />

          {error && (
            <Alert variant="danger" className="mb-6">
              {error}
            </Alert>
          )}

          {/* onSubmit invece di action: con action React 19 resetta il form dopo l'invio
              e in caso di errore l'utente perderebbe quanto inserito. */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(new FormData(e.currentTarget));
            }}
            className="space-y-5"
          >
            <div className="flex gap-2">
              {(["PRIVATE", "COMPANY"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setUserType(t)}
                  className={cn(
                    "flex-1 rounded-xl border px-4 py-3 text-sm font-semibold cursor-pointer transition-all",
                    userType === t
                      ? "border-primary bg-primary/10 text-ink"
                      : "border-zinc-200 bg-surface text-zinc-500 hover:bg-zinc-50"
                  )}
                >
                  {t === "PRIVATE" ? "Privato" : "Azienda"}
                </button>
              ))}
            </div>

            <input type="hidden" name="userType" value={userType} />

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-zinc-700">Nome</span>
                <input name="name" required autoComplete="given-name" className="w-full rounded-xl border border-zinc-200 bg-surface px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-primary focus:outline-none" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-zinc-700">Cognome</span>
                <input name="surname" required autoComplete="family-name" className="w-full rounded-xl border border-zinc-200 bg-surface px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-primary focus:outline-none" />
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-zinc-700">Email</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="nome@esempio.it"
                className="w-full rounded-xl border border-zinc-200 bg-surface px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-primary focus:outline-none"
              />
            </label>

            <Button type="submit" variant="primary" size="lg" fullWidth disabled={isPending}>
              {isPending ? "Registrazione..." : "Crea account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Hai già un account?{" "}
            <Link href="/login" className="font-bold text-primary hover:brightness-90">
              Accedi
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
