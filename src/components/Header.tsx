"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { label: "Eventi", href: "/events" },
  { label: "Menù", href: "/menus" },
  { label: "Corsi", href: "/courses" },
  { label: "Workspace", href: "/workspace" },
  { label: "Richiedi Preventivo", href: "/quote-request" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/40 bg-white/75 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo.svg" alt="Ottagora" className="h-6 sm:h-7 w-auto" />
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            {NAV_LINKS.map(({ label, href }) => {
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
            })}
          </nav>

          {/* Clean minimal layout - buttons removed as they are present in the Bottom Bar */}
          <div className="w-10"></div>
        </div>
      </div>
    </header>
  );
}
