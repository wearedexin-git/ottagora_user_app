"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { IconX } from "@/components/icons";
import { cn } from "@/lib/cn";

type Filters = { q: string; tipo: string; prezzo: string };

/**
 * Ricerca e filtri rapidi della pagina corsi. Lo stato vive nell'URL (?q, ?tipo, ?prezzo):
 * il filtro vero e proprio lo fa la pagina server, così i risultati sono condivisibili via link.
 * I chip sono a scelta singola: "Gratuiti" filtra per prezzo e sostituisce la tipologia
 * "Gratuito", che altrimenti comparirebbe come voce quasi identica.
 */
export default function CoursesFilters({
  q,
  tipo,
  prezzo,
  types,
  resultCount,
  totalCount,
}: Filters & {
  types: string[];
  resultCount: number;
  totalCount: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(q);
  const [prevQ, setPrevQ] = useState(q);

  // Riallinea il campo quando l'URL cambia dall'esterno (es. "Azzera filtri").
  if (q !== prevQ) {
    setPrevQ(q);
    setQuery(q);
  }

  const navigate = (next: Filters) => {
    const params = new URLSearchParams();
    if (next.q.trim()) params.set("q", next.q.trim());
    if (next.tipo) params.set("tipo", next.tipo);
    if (next.prezzo) params.set("prezzo", next.prezzo);
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `/courses?${qs}` : "/courses", { scroll: false });
    });
  };

  useEffect(() => {
    if (query.trim() === q.trim()) return;
    const timeout = setTimeout(() => navigate({ q: query, tipo, prezzo }), 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const chips = [
    { label: "Tutti", active: !tipo && !prezzo, filters: { tipo: "", prezzo: "" } },
    { label: "Gratuiti", active: prezzo === "gratuiti" && !tipo, filters: { tipo: "", prezzo: "gratuiti" } },
    ...types
      .filter((t) => t !== "Gratuito")
      .map((t) => ({ label: t, active: tipo === t, filters: { tipo: t, prezzo: "" } })),
  ];

  const hasFilters = Boolean(q || tipo || prezzo);

  return (
    <div className="mb-8 space-y-4">
      <div className="relative">
        <label htmlFor="course-search" className="sr-only">
          Cerca un corso
        </label>
        <input
          id="course-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca per titolo, argomento o docente"
          className="w-full rounded-xl border border-zinc-200 bg-surface py-3 pl-4 pr-11 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-primary focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Svuota ricerca"
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-2 text-zinc-400 hover:text-zinc-800"
          >
            <IconX className="h-4 w-4" />
          </button>
        )}
      </div>

      <div
        role="group"
        aria-label="Filtra per tipologia"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {chips.map((chip) => (
          <button
            key={chip.label}
            type="button"
            aria-pressed={chip.active}
            onClick={() =>
              navigate({ q: query, ...(chip.active ? { tipo: "", prezzo: "" } : chip.filters) })
            }
            className={cn(
              "shrink-0 cursor-pointer whitespace-nowrap rounded-lg border px-4 py-2 text-xs font-bold transition-colors",
              chip.active
                ? "border-primary bg-primary text-white"
                : "border-zinc-200 bg-surface text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div
        className={cn(
          "flex items-center justify-between text-xs text-zinc-500 transition-opacity",
          isPending && "opacity-50"
        )}
        aria-live="polite"
      >
        <span>
          {hasFilters
            ? `${resultCount} di ${totalCount} ${totalCount === 1 ? "corso" : "corsi"}`
            : `${totalCount} ${totalCount === 1 ? "corso disponibile" : "corsi disponibili"}`}
        </span>
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              navigate({ q: "", tipo: "", prezzo: "" });
            }}
            className="cursor-pointer font-bold text-primary hover:brightness-90"
          >
            Azzera filtri
          </button>
        )}
      </div>
    </div>
  );
}
