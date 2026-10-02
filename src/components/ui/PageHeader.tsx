import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type PageHeaderProps = {
  /** Etichetta arancio in maiuscolo sopra il titolo (es. "Eventi"). */
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  /** Se presente, l'etichetta diventa un link "indietro" verso questa pagina. */
  backHref?: string;
  /** Contenuto extra sotto il titolo (es. un link d'azione). */
  children?: ReactNode;
  className?: string;
};

const EYEBROW = "text-xs font-bold uppercase tracking-widest text-primary";

/** Intestazione di pagina: etichetta arancio + titolo grande, come in home ("Dashboard / Ciao, …"). */
export function PageHeader({ eyebrow, title, description, backHref, children, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      {backHref ? (
        <Link href={backHref} className={cn(EYEBROW, "inline-block transition-opacity hover:opacity-80")}>
          ← {eyebrow}
        </Link>
      ) : (
        <span className={EYEBROW}>{eyebrow}</span>
      )}
      <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900">{title}</h1>
      {description && <p className="mt-2 text-sm text-zinc-500">{description}</p>}
      {children}
    </div>
  );
}
