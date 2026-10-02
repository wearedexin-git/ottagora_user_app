import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant = "primary" | "success" | "danger" | "neutral";

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  primary: "bg-primary/10 text-ink border-primary/20",
  success: "bg-success/10 text-success border-success/20",
  danger: "bg-danger/10 text-danger border-danger/20",
  neutral: "bg-zinc-100 text-zinc-500 border-zinc-200",
};

const DOT_CLASSES: Record<BadgeVariant, string> = {
  primary: "bg-primary",
  success: "bg-success",
  danger: "bg-danger",
  neutral: "bg-zinc-400",
};

export type BadgeProps = {
  variant?: BadgeVariant;
  /** Pallino animato (es. stato "in corso/attivo"). */
  dot?: boolean;
  children: ReactNode;
  className?: string;
};

export function Badge({ variant = "neutral", dot, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-xs font-bold leading-5",
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", DOT_CLASSES[variant])} />}
      {children}
    </span>
  );
}
