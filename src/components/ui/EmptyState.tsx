import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Card } from "./Card";

export type EmptyStateProps = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  /** Bottoni d'azione: su mobile in colonna a tutta larghezza, da sm affiancati. */
  actions?: ReactNode;
  /** Senza card esterna, per sezioni già dentro una Card (evita card annidate). */
  bare?: boolean;
  className?: string;
};

/** Stato vuoto di una sezione: icona, titolo, spiegazione e azioni suggerite. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actions,
  bare,
  className,
}: EmptyStateProps) {
  const content = (
    <>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-bold text-zinc-900">{title}</h3>
      {description && <p className="mt-1 max-w-xs text-sm text-zinc-500">{description}</p>}
      {actions && (
        <div className="mt-5 flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-3">
          {actions}
        </div>
      )}
    </>
  );

  const layout = "flex flex-col items-center text-center";

  if (bare) {
    return <div className={cn(layout, "py-8 px-4", className)}>{content}</div>;
  }

  return (
    <Card padding="lg" className={cn(layout, className)}>
      {content}
    </Card>
  );
}
