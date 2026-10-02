import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type PageHeaderProps = {
  title: string;
  description?: ReactNode;
  /** Link "indietro" mostrato sopra il titolo. */
  back?: { href: string; label: string };
  className?: string;
};

/** Intestazione delle pagine dedicate a un form (prenotazioni, candidature, profilo). */
export function PageHeader({ title, description, back, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      {back && (
        <Link
          href={back.href}
          className="mb-3 inline-block text-xs font-semibold text-zinc-400 transition-colors hover:text-primary"
        >
          ← {back.label}
        </Link>
      )}
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">{title}</h1>
      {description && <p className="mt-2 text-sm text-zinc-500">{description}</p>}
    </div>
  );
}
