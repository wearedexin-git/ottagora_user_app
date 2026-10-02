"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { submitTableReservation } from "@/app/actions/reservation-actions";
import { Button, Alert, PageHeader } from "@/components/ui";
import MenuSheet from "@/components/MenuSheet";
import { formatDateLong, formatEuro } from "@/lib/format";
import type { MenuDetail } from "@/lib/menu-detail";

type ReserveEvent = {
  id: string;
  name: string;
  date: Date | string;
  timeSlot: string | null;
  room: { name: string } | null;
  menu: MenuDetail | null;
};

export default function ReserveTableForm({
  event,
  anagraficaComplete,
}: {
  event: ReserveEvent;
  anagraficaComplete: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await submitTableReservation(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Eventi"
        backHref="/events"
        title="Prenota un tavolo"
        description={
          <>
            Stai prenotando per l&apos;evento <strong className="text-zinc-700">{event.name}</strong>.
          </>
        }
      />

      {!anagraficaComplete && (
        <Alert variant="warning" className="mb-6">
          Per prenotare devi prima completare i tuoi dati nel profilo.{" "}
          <Link href="/area-personale/profile" className="font-bold underline underline-offset-2">
            Completa il profilo
          </Link>
        </Alert>
      )}

      {error && (
        <Alert variant="danger" className="mb-6 font-medium">
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
        className="space-y-6"
      >
        <input type="hidden" name="eventId" value={event.id} />
        <input type="hidden" name="timeSlot" value={event.timeSlot ?? ""} />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Numero di persone
          </label>
          <select
            name="guests"
            required
            disabled={!anagraficaComplete || isPending}
            className="w-full rounded-xl border border-zinc-200 bg-surface px-4 py-3 text-zinc-800 text-sm focus:outline-none focus:border-primary transition-all disabled:opacity-50"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "persona" : "persone"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Menù abbinato
          </label>
          {event.menu ? (
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 text-sm">
              <input type="hidden" name="menuId" value={event.menu.id} />
              <div className="flex justify-between font-bold text-zinc-800 mb-1">
                <span>{event.menu.name}</span>
                <span className="text-primary">{formatEuro(event.menu.cost)}</span>
              </div>
              <p className="text-xs text-zinc-500">
                {event.menu.foods.map((f) => f.name).join(", ")}
              </p>
              <MenuSheet menu={event.menu} label="Vedi piatti e allergeni" className="mt-2 text-xs" />
            </div>
          ) : (
            <p className="text-xs text-danger">
              Nessun menù associato. Contatta il ristorante.
            </p>
          )}
        </div>

        <div className="border-t border-zinc-200/60 pt-4 text-xs text-zinc-400 space-y-2">
          <div className="flex justify-between">
            <span>Data</span>
            <span className="text-zinc-700 font-semibold">
              {formatDateLong(event.date)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Fascia oraria</span>
            <span className="text-zinc-700 font-semibold">{event.timeSlot}</span>
          </div>
          <div className="flex justify-between">
            <span>Sala</span>
            <span className="text-zinc-700 font-semibold">
              {event.room?.name || "Ottagora"}
            </span>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={!anagraficaComplete || !event.menu || isPending}
        >
          {isPending ? "Prenotazione in corso..." : "Conferma prenotazione"}
        </Button>
      </form>
    </>
  );
}
