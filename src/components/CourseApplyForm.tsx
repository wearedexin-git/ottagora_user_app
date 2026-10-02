"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { submitCourseApplication } from "@/app/actions/training-actions";
import { Button, Alert } from "@/components/ui";

export default function CourseApplyForm({
  courseId,
  direct,
  anagraficaComplete,
}: {
  courseId: string;
  /** Iscrizione diretta: accettata subito, senza CV né selezione. */
  direct: boolean;
  anagraficaComplete: boolean;
}) {
  const requiresCv = !direct;
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await submitCourseApplication(formData);
      if (result?.error) setError(result.error);
    });
  };

  return (
    // onSubmit invece di action: con action React 19 resetta il form dopo l'invio
    // e in caso di errore l'utente perderebbe quanto inserito.
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(new FormData(e.currentTarget));
      }}
      className="space-y-6"
    >
      <input type="hidden" name="courseId" value={courseId} />

      {!anagraficaComplete && (
        <Alert variant="warning">
          {direct ? "Per iscriverti" : "Per candidarti"} devi prima completare i tuoi dati nel profilo.{" "}
          <Link href="/area-personale/profile" className="font-bold underline underline-offset-2">
            Completa il profilo
          </Link>
        </Alert>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {requiresCv && (
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Curriculum Vitae (PDF) *
          </label>
          <input
            type="file"
            name="cv"
            accept=".pdf"
            required={requiresCv && anagraficaComplete}
            disabled={!anagraficaComplete || isPending}
            className="w-full rounded-xl border border-zinc-200 bg-surface p-2 text-sm text-zinc-600 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-xs file:font-bold file:text-ink disabled:opacity-50"
          />
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
          Messaggio (opzionale)
        </label>
        <textarea
          name="message"
          rows={3}
          disabled={!anagraficaComplete || isPending}
          className="w-full rounded-xl border border-zinc-200 bg-surface px-4 py-3 text-sm"
        />
      </div>

      <label className="flex items-start gap-2 text-xs text-zinc-600">
        <input
          type="checkbox"
          name="acceptedPrivacy"
          value="true"
          required
          disabled={!anagraficaComplete || isPending}
          className="mt-0.5"
        />
        Accetto il trattamento dei dati personali per {direct ? "l'iscrizione" : "la candidatura"}.
      </label>


      <Button type="submit" variant="primary" size="lg" fullWidth disabled={!anagraficaComplete || isPending}>
        {isPending ? "Invio in corso..." : direct ? "Conferma iscrizione" : "Invia candidatura"}
      </Button>
    </form>
  );
}
