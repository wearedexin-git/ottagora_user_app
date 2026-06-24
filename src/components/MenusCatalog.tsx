"use client";

import { useState } from "react";

type Allergen = {
  id: string;
  name: string;
};

type FoodItem = {
  id: string;
  name: string;
  ingredients: string;
  quantity: number;
  unit: string;
  cost: number | null;
  allergens: Allergen[];
};

type BeverageItem = {
  id: string;
  name: string;
  ingredients: string;
  quantity: number;
  unit: string;
  cost: number | null;
  allergens: Allergen[];
};

type MenuWithRelations = {
  id: string;
  name: string;
  dietType: string;
  timeSlot: string;
  cost: number;
  foods: FoodItem[];
  beverages: BeverageItem[];
};

export default function MenusCatalog({
  menus,
  preselectedMenuId,
}: {
  menus: MenuWithRelations[];
  preselectedMenuId?: string;
}) {
  const [selectedItem, setSelectedItem] = useState<{
    name: string;
    ingredients: string;
    allergens: string[];
    quantity: number;
    unit: string;
  } | null>(null);

  return (
    <div className="space-y-12">
      {/* Menu Cards */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {menus.map((menu) => {
          const isPreselected = menu.id === preselectedMenuId;

          return (
            <div
              key={menu.id}
              className={`glass rounded-2xl p-6 flex flex-col transition-all relative bg-white/50 shadow-sm ${
                isPreselected ? "ring-2 ring-amber-600 border-transparent" : ""
              }`}
            >
              {isPreselected && (
                <span className="absolute -top-3 left-6 rounded-full bg-amber-600 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wide shadow-sm animate-pulse">
                  Selezionato per l'evento
                </span>
              )}

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950">{menu.name}</h3>
                  <div className="flex gap-1.5 mt-1.5">
                    <span className="text-[10px] font-medium rounded-full bg-zinc-100 px-2.5 py-0.5 text-zinc-500 capitalize">
                      {menu.timeSlot}
                    </span>
                    <span className="text-[10px] rounded-full bg-amber-500/10 px-2.5 py-0.5 text-amber-600 uppercase font-bold tracking-wider">
                      {menu.dietType === "standard" ? "Standard" : menu.dietType}
                    </span>
                  </div>
                </div>
                <div className="text-lg font-extrabold text-amber-600">
                  {menu.cost.toFixed(2)}€
                </div>
              </div>

              {/* Food list */}
              <div className="space-y-4 flex-1">
                <div>
                  <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">
                    Portate (Tocca per dettagli)
                  </h4>
                  <div className="space-y-2">
                    {menu.foods.map((food) => (
                      <button
                        key={food.id}
                        onClick={() =>
                          setSelectedItem({
                            name: food.name,
                            ingredients: food.ingredients,
                            allergens: food.allergens.map((a) => a.name),
                            quantity: food.quantity,
                            unit: food.unit,
                          })
                        }
                        className="w-full text-left p-3.5 rounded-xl bg-white border border-zinc-100/80 hover:border-zinc-300 transition-all flex items-center justify-between shadow-sm"
                      >
                        <span className="font-semibold text-xs text-zinc-800">{food.name}</span>
                        <span className="text-[10px] font-semibold text-amber-600 bg-amber-500/10 px-2 py-1 rounded-md">
                          Info
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Beverages */}
                {menu.beverages.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">
                      Bevande (Tocca per info)
                    </h4>
                    <div className="space-y-2">
                      {menu.beverages.map((bev) => (
                        <button
                          key={bev.id}
                          onClick={() =>
                            setSelectedItem({
                              name: bev.name,
                              ingredients: bev.ingredients,
                              allergens: bev.allergens.map((a) => a.name),
                              quantity: bev.quantity,
                              unit: bev.unit,
                            })
                          }
                          className="w-full text-left p-3.5 rounded-xl bg-white border border-zinc-100/80 hover:border-zinc-300 transition-all flex items-center justify-between shadow-sm"
                        >
                          <span className="font-semibold text-xs text-zinc-800">{bev.name}</span>
                          <span className="text-[10px] font-semibold text-amber-600 bg-amber-500/10 px-2 py-1 rounded-md">
                            Info
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Dialog for Info on Tap */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="glass max-w-md w-full rounded-3xl p-6 shadow-2xl relative bg-white/95 border border-zinc-200/50 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 text-sm font-semibold p-1"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-zinc-950 mb-4 pr-6 leading-snug">
              {selectedItem.name}
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Ingredienti
                </h4>
                <p className="text-zinc-600 text-xs leading-relaxed">
                  {selectedItem.ingredients}
                </p>
              </div>

              {selectedItem.allergens.length > 0 ? (
                <div>
                  <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Allergeni Presenti
                  </h4>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedItem.allergens.map((allergen, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold bg-red-500/10 text-red-500 border border-red-500/10 px-2.5 py-0.5 rounded-full"
                      >
                        ⚠️ {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Allergeni
                  </h4>
                  <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    ✓ Nessun allergene dichiarato.
                  </p>
                </div>
              )}

              <div className="border-t border-zinc-100 pt-3.5 flex justify-between text-xs text-zinc-400">
                <span>Porzione standard:</span>
                <span className="font-semibold text-zinc-600">
                  {selectedItem.quantity} {selectedItem.unit}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedItem(null)}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-2.5 text-sm font-bold text-white hover:brightness-110 transition-all shadow-sm cursor-pointer"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
