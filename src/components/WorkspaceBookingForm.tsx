"use client";

import { useState, useTransition } from "react";
import { submitWorkspaceBooking } from "@/app/actions/reservation-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { calculateMeetingCost } from "@/lib/room-availability";
import { Button, Alert } from "@/components/ui";
import { formatEuro } from "@/lib/format";

type MeetingRoom = {
  id: string;
  name: string;
  capacity: number;
  hourlyCost: number;
};

export default function WorkspaceBookingForm({
  rooms,
  anagraficaComplete,
}: {
  rooms: MeetingRoom[];
  anagraficaComplete: boolean;
}) {
  const router = useRouter();
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || "");
  const [duration, setDuration] = useState(60);
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [bookingType, setBookingType] = useState<"Riunione" | "Accesso for Work">("Riunione");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);
  const calculatedCost =
    selectedRoom && bookingType === "Riunione"
      ? calculateMeetingCost(selectedRoom.hourlyCost, duration)
      : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomId || !date || !anagraficaComplete) return;

    setError(null);
    startTransition(async () => {
      const result = await submitWorkspaceBooking({
        roomId: selectedRoomId,
        date,
        guests,
        durationMinutes: duration,
        bookingType,
      });
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        router.push("/area-personale?tab=workspace");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!anagraficaComplete && (
        <Alert variant="warning">
          Per prenotare devi prima completare i tuoi dati nel profilo.{" "}
          <Link href="/area-personale/profile" className="font-bold underline underline-offset-2">
            Completa il profilo
          </Link>
        </Alert>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">Tipo prenotazione</label>
        <select
          value={bookingType}
          onChange={(e) => setBookingType(e.target.value as "Riunione" | "Accesso for Work")}
          className="w-full rounded-xl border border-zinc-200 bg-surface px-4 py-3 text-sm"
        >
          <option value="Riunione">Sala riunioni</option>
          <option value="Accesso for Work">Postazione di lavoro</option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">Sala</label>
        <select
          value={selectedRoomId}
          onChange={(e) => setSelectedRoomId(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-surface px-4 py-3 text-sm"
        >
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
        {selectedRoom && (
          <p className="mt-2 text-xs text-zinc-500">
            Fino a {selectedRoom.capacity} persone · {formatEuro(selectedRoom.hourlyCost)}/h
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">Data e ora inizio</label>
        <input
          type="datetime-local"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={!anagraficaComplete}
          className="w-full rounded-xl border border-zinc-200 bg-surface px-4 py-3 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">Durata</label>
          <select
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value, 10))}
            className="w-full rounded-xl border border-zinc-200 bg-surface px-4 py-3 text-sm"
          >
            {[30, 60, 90, 120, 180, 240].map((m) => (
              <option key={m} value={m}>
                {m} min
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">Partecipanti</label>
          <input
            type="number"
            min={1}
            max={selectedRoom?.capacity || 10}
            required
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value, 10))}
            className="w-full rounded-xl border border-zinc-200 bg-surface px-4 py-3 text-sm"
          />
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 flex justify-between items-center">
        <p className="text-xs text-zinc-500">Preventivo (soggetto ad approvazione)</p>
        <p className="text-2xl font-extrabold text-primary">{formatEuro(calculatedCost)}</p>
      </div>

      <Button type="submit" variant="primary" size="lg" fullWidth disabled={!anagraficaComplete || isPending}>
        {isPending ? "Invio richiesta..." : "Invia richiesta di prenotazione"}
      </Button>
    </form>
  );
}
