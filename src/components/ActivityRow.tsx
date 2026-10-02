import type { ReactNode } from "react";
import { Badge, type BadgeVariant } from "@/components/ui";
import { cn } from "@/lib/cn";
import { dateChipParts } from "@/lib/format";

export type ActivityStatus = { label: string; variant: BadgeVariant };

/**
 * Riga di un'attività (prenotazione, lezione…) con il "calendarietto" della data a sinistra.
 * Usata sia in home ("In programma") sia nell'area personale, così la stessa attività appare
 * sempre allo stesso modo.
 */
export function ActivityRow({
  date,
  title,
  details,
  status,
  muted,
  children,
  as: Tag = "li",
}: {
  date: Date | null;
  title: string;
  details: string[];
  status?: ActivityStatus;
  /** Attività passata: calendarietto e titolo in grigio. */
  muted?: boolean;
  /** Contenuto extra sotto la riga (es. materiali del corso). */
  children?: ReactNode;
  as?: "li" | "div";
}) {
  const chip = date ? dateChipParts(date) : null;
  return (
    <Tag className="rounded-2xl border border-zinc-200/70 bg-surface p-4">
      <div className="flex gap-4">
        <div
          className={cn(
            "flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-xl",
            muted ? "bg-zinc-100 text-zinc-500" : "bg-primary/10 text-primary"
          )}
          aria-hidden={!chip}
        >
          {chip ? (
            <>
              <span className="text-lg font-extrabold leading-none">{chip.day}</span>
              <span className="mt-1 text-xs font-bold uppercase leading-none">{chip.month}</span>
            </>
          ) : (
            <span className="text-lg font-extrabold">—</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className={cn("font-bold leading-snug", muted ? "text-zinc-600" : "text-zinc-900")}>{title}</p>
            {status && (
              <Badge variant={status.variant} className="shrink-0 px-2.5 py-0.5">
                {status.label}
              </Badge>
            )}
          </div>
          {details.length > 0 && (
            <p className="mt-1 text-sm leading-relaxed text-zinc-500">{details.join(" · ")}</p>
          )}
        </div>
      </div>
      {children}
    </Tag>
  );
}
