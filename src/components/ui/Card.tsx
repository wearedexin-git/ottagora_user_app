import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CardProps = ComponentProps<"div"> & {
  children: ReactNode;
  /** Card cliccabile (hover più marcato, cursore a mano). */
  interactive?: boolean;
  /** Stato selezionato (es. tab/filtro attivo). */
  selected?: boolean;
  /** Sfondo vetro sfocato (pattern "glass" attuale). Disattivare per una card piena. */
  glass?: boolean;
  /** Padding interno, di default "md". */
  padding?: "none" | "sm" | "md" | "lg";
};

const PADDING_CLASSES: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "",
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

export function Card({
  children,
  interactive,
  selected,
  glass = true,
  padding = "md",
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border transition-all",
        PADDING_CLASSES[padding],
        glass ? "glass bg-surface/50" : "bg-surface",
        selected
          ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
          : "border-zinc-200/40",
        interactive && "cursor-pointer hover:bg-surface hover:border-zinc-300/80",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
