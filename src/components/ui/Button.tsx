import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-1.5 font-bold transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "rounded-xl bg-primary text-white shadow-sm hover:brightness-95",
  secondary: "rounded-xl bg-ink text-white shadow-md hover:opacity-90",
  outline:
    "rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-sm hover:bg-zinc-50",
  ghost: "rounded-xl text-primary hover:bg-primary/10",
  danger:
    "rounded-xl border border-danger/20 bg-danger/5 text-danger shadow-sm hover:bg-danger/10",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "text-xs px-3.5 py-2",
  md: "text-sm px-4 py-2.5",
  lg: "text-sm px-4 py-3.5",
};

type SharedProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = SharedProps &
  Omit<ComponentProps<"button">, keyof SharedProps> & { href?: undefined };

type ButtonAsLink = SharedProps &
  Omit<ComponentProps<typeof Link>, keyof SharedProps> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    BASE,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth && "w-full",
    className
  );

  const { href, ...rest } = props as { href?: string } & Record<string, unknown>;

  if (href !== undefined) {
    return (
      <Link href={href} className={classes} {...(rest as Omit<ComponentProps<typeof Link>, "href">)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ComponentProps<"button">)}>
      {children}
    </button>
  );
}
