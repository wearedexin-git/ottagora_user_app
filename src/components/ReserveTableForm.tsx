"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { submitTableReservation } from "@/app/actions/reservation-actions";
import { Card, Button, Alert } from "@/components/ui";

type MenuFood = {
  food: {
    name: string;
  };
};

type ReserveEvent = {
  id: string;
  name: string;
  date: Date | string;
  timeSlot: string | null;
  room: { name: string } | null;
  menu: {
    id: string;
    name: string;
    cost: number;
    foods: MenuFood[];
  } | null;
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
    <Card padding="lg" className="shadow-xl">
      <div className="mb-6">
        <Link href="/events" className="text-xs text-zinc-400 hover:text-primary transition-colors">
          ← Torna agli eventi
        </Link>
        <h1 className="text-2xl font-extrabold text-zinc-900 mt-2">Prenotazione Tavolo</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Stai prenotando per l&apos;evento:{" "}
          <strong className="text-zinc-700">{event.name}</strong>
        </p>
      </div>

      {!anagraficaComplete && (
        <Alert variant="warning" className="mb-6">
          Completa l&apos;anagrafica nel{" "}
          <Link href="/area-personale/profile" className="font-bold underline">
            profilo
          </Link>{" "}
          (codice fiscale e indirizzi) prima di prenotare.
        </Alert>
      )}

      {error && (
        <Alert variant="danger" className="mb-6 font-medium">
          {error}
        </Alert>
      )}

      <form action={handleSubmit} className="space-y-6">
        <input type="hidden" name="eventId" value={event.id} />
        <input type="hidden" name="timeSlot" value={event.timeSlot ?? ""} />

        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Numero di Persone (Ospiti)
          </label>
          <select
            name="guests"
            required
            disabled={!anagraficaComplete || isPending}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-800 text-sm focus:outline-none focus:border-primary transition-all shadow-sm disabled:opacity-50"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Persona" : "Persone"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Menù Abbinato
          </label>
          {event.menu ? (
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 text-sm shadow-sm">
              <input type="hidden" name="menuId" value={event.menu.id} />
              <div className="flex justify-between font-bold text-zinc-800 mb-1">
                <span>{event.menu.name}</span>
                <span className="text-primary">{event.menu.cost.toFixed(2)}€</span>
              </div>
              <p className="text-xs text-zinc-500">
                Composto da: {event.menu.foods.map((f) => f.food.name).join(", ")}
              </p>
            </div>
          ) : (
            <p className="text-xs text-danger">
              Nessun menù associato. Contatta il ristorante.
            </p>
          )}
        </div>

        <div className="border-t border-zinc-150 pt-4 text-xs text-zinc-400 space-y-2">
          <div className="flex justify-between">
            <span>Data:</span>
            <span className="text-zinc-700 font-semibold">
              {new Date(event.date).toLocaleDateString("it-IT", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Fascia Oraria:</span>
            <span className="text-zinc-700 font-semibold">{event.timeSlot}</span>
          </div>
          <div className="flex justify-between">
            <span>Location:</span>
            <span className="text-zinc-700 font-semibold">
              {event.room?.name || "Ottagora"}
            </span>
          </div>
        </div>

        <Button
          type="submit"
          variant="secondary"
          size="lg"
          fullWidth
          disabled={!anagraficaComplete || !event.menu || isPending}
        >
          {isPending ? "Prenotazione in corso..." : "Conferma Prenotazione Tavolo"}
        </Button>
      </form>
    </Card>
  );
}
