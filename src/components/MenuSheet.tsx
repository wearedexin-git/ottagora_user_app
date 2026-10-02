"use client";

import { useEffect, useId, useState } from "react";
import { IconX } from "@/components/icons";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { MenuDetail, MenuItemDetail } from "@/lib/menu-detail";
import { formatEuro } from "@/lib/format";

/**
 * Link "Vedi menù" che apre il dettaglio del menù di un evento: su mobile un pannello dal
 * basso, da desktop una finestra centrata. Ogni piatto si apre per ingredienti e allergeni.
 */
export default function MenuSheet({
  menu,
  label = "Vedi menù",
  className,
}: {
  menu: MenuDetail;
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  // Esc chiude; la pagina sotto non scorre mentre il pannello è aperto.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn("cursor-pointer font-bold text-primary hover:brightness-90", className)}
      >
        {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
          <button
            type="button"
            aria-label="Chiudi il menù"
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-3xl bg-surface shadow-2xl sm:max-w-lg sm:rounded-3xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-zinc-200/70 px-5 pt-5 pb-4">
              <div className="min-w-0">
                <h2 id={titleId} className="text-lg font-semibold leading-snug text-zinc-900">
                  {menu.name}
                </h2>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <span className="text-base font-extrabold text-primary">{formatEuro(menu.cost)}</span>
                  {menu.timeSlot && <Badge className="px-2.5 py-0.5">{menu.timeSlot}</Badge>}
                  {menu.dietType && menu.dietType.toLowerCase() !== "standard" && (
                    <Badge variant="primary" className="px-2.5 py-0.5">
                      {menu.dietType}
                    </Badge>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Chiudi"
                className="-mr-1 shrink-0 cursor-pointer rounded-lg p-1.5 text-zinc-400 hover:text-zinc-900"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 overflow-y-auto px-5 py-5">
              <p className="text-xs text-zinc-500">Tocca un piatto per vedere ingredienti e allergeni.</p>
              <ItemList title="Portate" items={menu.foods} />
              <ItemList title="Bevande" items={menu.beverages} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ItemList({ title, items }: { title: string; items: MenuItemDetail[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold text-zinc-900">{title}</h3>
      <ul className="divide-y divide-zinc-200/70 rounded-2xl border border-zinc-200/70 bg-surface">
        {items.map((item) => (
          <li key={item.id}>
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
                <span className="text-sm font-semibold text-zinc-800">{item.name}</span>
                <span className="flex shrink-0 items-center gap-2">
                  {item.allergens.length > 0 ? (
                    <Badge variant="danger" className="px-2 py-0">
                      {item.allergens.length} {item.allergens.length === 1 ? "allergene" : "allergeni"}
                    </Badge>
                  ) : (
                    <Badge className="px-2 py-0">Senza allergeni</Badge>
                  )}
                  <span className="text-primary transition-transform group-open:rotate-90" aria-hidden="true">
                    ›
                  </span>
                </span>
              </summary>
              <div className="space-y-3 px-4 pb-4 text-sm">
                {item.ingredients && (
                  <p className="leading-relaxed text-zinc-600">
                    <span className="font-semibold text-zinc-800">Ingredienti: </span>
                    {item.ingredients}
                  </p>
                )}
                {item.allergens.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.allergens.map((allergen) => (
                      <Badge key={allergen} variant="danger" className="px-2.5 py-0.5">
                        {allergen}
                      </Badge>
                    ))}
                  </div>
                )}
                {item.quantity > 0 && (
                  <p className="text-xs text-zinc-500">
                    Porzione: {item.quantity.toLocaleString("it-IT")} {item.unit}
                  </p>
                )}
              </div>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
