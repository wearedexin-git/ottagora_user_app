"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { submitCourseApplication } from "@/app/actions/training-actions";
import { Button, Alert } from "@/components/ui";

export default function CourseApplyForm({
  courseId,
  courseTitle,
  requiresCv,
  anagraficaComplete,
}: {
  courseId: string;
  courseTitle: string;
  requiresCv: boolean;
  anagraficaComplete: boolean;
}) {
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
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="courseId" value={courseId} />

      {!anagraficaComplete && (
        <Alert variant="warning">
          Completa l&apos;anagrafica nel{" "}
          <Link href="/area-personale/profile" className="font-bold underline">
            profilo
          </Link>{" "}
          prima di candidarti.
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
            className="w-full text-sm text-zinc-600"
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
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm"
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
        Accetto il trattamento dei dati personali per la candidatura.
      </label>

      <p className="text-xs text-zinc-500">
        Corso: <strong>{courseTitle}</strong>
      </p>

      <Button type="submit" variant="primary" size="lg" fullWidth disabled={!anagraficaComplete || isPending}>
        {isPending ? "Invio in corso..." : "Invia Candidatura"}
      </Button>
    </form>
  );
}
