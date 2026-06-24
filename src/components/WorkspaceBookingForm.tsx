"use client";

import { useState } from "react";
import { submitWorkspaceBooking } from "@/app/actions/reservation-actions";
import { useRouter } from "next/navigation";

type MeetingRoom = {
  id: string;
  name: string;
  capacity: number;
  hourlyCost: number;
};

export default function WorkspaceBookingForm({ rooms }: { rooms: MeetingRoom[] }) {
  const router = useRouter();
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || "");
  const [duration, setDuration] = useState(60); // minutes
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);
  const calculatedCost = selectedRoom ? selectedRoom.hourlyCost * (duration / 60) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomId || !date) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitWorkspaceBooking({
        roomId: selectedRoomId,
        date,
        guests,
        durationMinutes: duration,
      });

      if (result.success) {
        router.push("/area-personale");
      }
    } catch (err: any) {
      setError(err.message || "Errore nella prenotazione della sala.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 text-red-650 border border-red-500/20 text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Select Room */}
      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
          Seleziona la Sala Riunione
        </label>
        <select
          value={selectedRoomId}
          onChange={(e) => setSelectedRoomId(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-800 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
        >
          {rooms.map((room) => (
            <option key={room.id} value={room.id} className="bg-white text-zinc-800">
              {room.name} (Max {room.capacity} persone - {room.hourlyCost.toFixed(2)}€/ora)
            </option>
          ))}
        </select>
      </div>

      {/* Date and Time */}
      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
          Data e Ora Inizio
        </label>
        <input
          type="datetime-local"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-800 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
        />
      </div>

      {/* Duration & Guests */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Durata Prenotazione
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-800 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
          >
            <option value={30} className="bg-white text-zinc-800">30 Minuti</option>
            <option value={60} className="bg-white text-zinc-800">1 Ora</option>
            <option value={90} className="bg-white text-zinc-800">1 Ora e Mezzo</option>
            <option value={120} className="bg-white text-zinc-800">2 Ore</option>
            <option value={180} className="bg-white text-zinc-800">3 Ore</option>
            <option value={240} className="bg-white text-zinc-800">4 Ore</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Numero Partecipanti
          </label>
          <input
            type="number"
            min={1}
            max={selectedRoom?.capacity || 10}
            required
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-800 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Real-time price display */}
      <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex justify-between items-center shadow-sm">
        <div>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Costo Calcolato (Tempo Reale)</p>
          <p className="text-[10px] text-zinc-500 mt-0.5 font-medium">Tariffa oraria: {selectedRoom?.hourlyCost.toFixed(2)}€/ora</p>
        </div>
        <div className="text-2xl font-extrabold text-amber-600">
          {calculatedCost.toFixed(2)}€
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-3.5 text-sm font-bold text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 shadow-md cursor-pointer"
      >
        {isSubmitting ? "Prenotazione in corso..." : "Conferma Prenotazione Workspace"}
      </button>
    </form>
  );
}
