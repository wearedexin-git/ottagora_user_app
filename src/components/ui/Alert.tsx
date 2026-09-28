import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type AlertVariant = "danger" | "warning" | "success";

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  danger: "bg-danger/5 text-danger border-danger/15",
  warning: "bg-primary/10 text-ink border-primary/20",
  success: "bg-success/5 text-success border-success/15",
};

export type AlertProps = {
  variant?: AlertVariant;
  children: ReactNode;
  className?: string;
};

/** Banner per messaggi di errore/avviso/successo nei form (sostituisce i box bg-red-50 duplicati). */
export function Alert({ variant = "danger", children, className }: AlertProps) {
  return (
    <div className={cn("p-4 rounded-xl border text-sm font-medium", VARIANT_CLASSES[variant], className)}>
      {children}
    </div>
  );
}
