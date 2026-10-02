"use client";

import { useState } from "react";
import { Card, Button, Badge } from "@/components/ui";
import { IconX } from "@/components/icons";

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
            <Card key={menu.id} selected={isPreselected} className="flex flex-col relative">
              {isPreselected && (
                <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wide shadow-sm animate-pulse">
                  Selezionato per l&apos;evento
                </span>
              )}

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950">{menu.name}</h3>
                  <div className="flex gap-1.5 mt-1.5">
                    <Badge variant="neutral" className="capitalize font-medium">
                      {menu.timeSlot}
                    </Badge>
                    <Badge variant="primary" className="uppercase tracking-wider">
                      {menu.dietType === "standard" ? "Standard" : menu.dietType}
                    </Badge>
                  </div>
                </div>
                <div className="text-lg font-extrabold text-primary">
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
                        className="w-full text-left p-3.5 rounded-xl bg-white border border-zinc-100/80 hover:border-zinc-300 transition-all flex items-center justify-between shadow-sm cursor-pointer"
                      >
                        <span className="font-semibold text-xs text-zinc-800">{food.name}</span>
                        <Badge variant="primary">Info</Badge>
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
                          className="w-full text-left p-3.5 rounded-xl bg-white border border-zinc-100/80 hover:border-zinc-300 transition-all flex items-center justify-between shadow-sm cursor-pointer"
                        >
                          <span className="font-semibold text-xs text-zinc-800">{bev.name}</span>
                          <Badge variant="primary">Info</Badge>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal Dialog for Info on Tap */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <Card className="max-w-md w-full shadow-2xl relative bg-white/95 animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              aria-label="Chiudi"
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 p-1 cursor-pointer"
            >
              <IconX className="h-4 w-4" />
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
                      <Badge key={idx} variant="danger">
                        ⚠️ {allergen}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Allergeni
                  </h4>
                  <p className="text-xs text-success font-semibold flex items-center gap-1">
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

            <Button variant="primary" fullWidth className="mt-6" onClick={() => setSelectedItem(null)}>
              Chiudi
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
