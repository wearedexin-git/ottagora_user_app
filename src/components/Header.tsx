"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

// Su desktop le voci sono divise ai lati del logo centrato.
const NAV_LEFT = [
  { label: "Eventi", href: "/events" },
  { label: "Corsi", href: "/courses" },
];
const NAV_RIGHT = [
  { label: "Workspace", href: "/workspace" },
  { label: "Richiedi Preventivo", href: "/quote-request" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Appena si scorre la pagina si attivano lo sfondo glass e la linea di separazione.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const renderLinks = (links: typeof NAV_LEFT) =>
    links.map(({ label, href }) => {
      const isActive = pathname.startsWith(href);
      return (
        <Link
          key={href}
          href={href}
          aria-current={isActive ? "page" : undefined}
          className={cn(
            "text-sm font-medium transition-colors",
            isActive ? "text-primary font-semibold" : "text-zinc-500 hover:text-zinc-950"
          )}
        >
          {label}
        </Link>
      );
    });

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
        // In cima: nessuno sfondo, la barra non si percepisce. Scorrendo: effetto glass.
        scrolled
          ? "border-zinc-200/70 bg-background-glass backdrop-blur-md"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto grid h-14 max-w-7xl sm:h-16 grid-cols-[1fr_auto_1fr] items-center gap-6 px-4 sm:px-6 lg:px-8">
        <nav aria-label="Navigazione principale" className="hidden items-center gap-8 md:flex">
          {renderLinks(NAV_LEFT)}
        </nav>

        <Link href="/" aria-label="Ottagora, vai alla home" className="col-start-2 flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo.svg" alt="Ottagora" className="h-6 w-auto sm:h-7" />
        </Link>

        <nav aria-label="Altre sezioni" className="hidden items-center justify-end gap-8 md:flex">
          {renderLinks(NAV_RIGHT)}
        </nav>
      </div>
    </header>
  );
}
