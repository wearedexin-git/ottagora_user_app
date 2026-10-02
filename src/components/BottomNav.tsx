"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconNavDashboard,
  IconNavEvents,
  IconNavWorkspace,
  IconNavCourses,
  IconNavProfile,
} from "@/components/icons";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/", icon: IconNavDashboard },
    { label: "Eventi", href: "/events", icon: IconNavEvents },
    { label: "Workspace", href: "/workspace", icon: IconNavWorkspace },
    { label: "Corsi", href: "/courses", icon: IconNavCourses },
    { label: "Profilo", href: "/area-personale", icon: IconNavProfile },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2.5rem)] max-w-lg">
      <div className="glass rounded-2xl px-6 py-3 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)] flex justify-between items-center backdrop-blur-xl border border-zinc-200/40 bg-surface/70">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 group relative py-1"
            >
              <Icon
                className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? "text-primary" : "text-zinc-400 group-hover:text-zinc-600"
                }`}
              />
              <span
                className={`text-[10px] font-medium tracking-wide transition-colors duration-200 ${
                  isActive ? "text-primary font-semibold" : "text-zinc-500 group-hover:text-zinc-800"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 h-1 w-1 rounded-full bg-primary animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
