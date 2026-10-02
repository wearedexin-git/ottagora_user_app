"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { registerAction } from "@/app/actions/auth-actions";
import { Card, Button, Alert } from "@/components/ui";
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
      <DiagonalPattern className="absolute inset-0 -z-10 h-full w-full" />
      <div className="w-full max-w-md">
        <Card padding="lg" >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900">Registrati</h2>
            <p className="mt-2 text-xs text-zinc-500">Crea il tuo account utente Ottagora.</p>
          </div>

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
                    "flex-1 py-2 rounded-xl border text-xs font-bold cursor-pointer",
                    userType === t
                      ? "border-primary bg-primary/10 text-ink"
                      : "border-zinc-200 text-zinc-500"
                  )}
                >
                  {t === "PRIVATE" ? "Privato" : "Azienda"}
                </button>
              ))}
            </div>

            <input type="hidden" name="userType" value={userType} />

            <div className="grid grid-cols-2 gap-3">
              <input name="name" required placeholder="Nome" className="rounded-xl border border-zinc-200 px-4 py-3 text-sm" />
              <input name="surname" required placeholder="Cognome" className="rounded-xl border border-zinc-200 px-4 py-3 text-sm" />
            </div>

            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm"
            />

            <Button type="submit" variant="primary" size="lg" fullWidth disabled={isPending}>
              {isPending ? "Registrazione..." : "Crea account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-zinc-500">
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
