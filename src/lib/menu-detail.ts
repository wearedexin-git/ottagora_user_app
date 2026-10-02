/**
 * Dettaglio di un menù (portate, bevande, ingredienti, allergeni) come serve all'app utente.
 * Il menù esiste solo in funzione di un evento: viene mostrato dalla pagina eventi e dalla
 * prenotazione tavolo, non in una pagina a sé.
 */

const allergensInclude = { allergens: { include: { allergen: true } } } as const;

/** Include Prisma da usare su `menu` per avere tutto il necessario a `toMenuDetail`. */
export const menuDetailInclude = {
  foods: { include: { food: { include: allergensInclude } } },
  beverages: { include: { beverage: { include: allergensInclude } } },
} as const;

type RawItem = {
  id: string;
  name: string;
  ingredients: string | null;
  quantity: number;
  unit: string;
  allergens: Array<{ allergen: { name: string } }>;
};

type RawMenu = {
  id: string;
  name: string;
  cost: number;
  dietType: string | null;
  timeSlot: string | null;
  foods: Array<{ food: RawItem }>;
  beverages: Array<{ beverage: RawItem }>;
};

export type MenuItemDetail = {
  id: string;
  name: string;
  ingredients: string;
  quantity: number;
  unit: string;
  allergens: string[];
};

export type MenuDetail = {
  id: string;
  name: string;
  cost: number;
  dietType: string;
  timeSlot: string;
  foods: MenuItemDetail[];
  beverages: MenuItemDetail[];
};

const toItem = (item: RawItem): MenuItemDetail => ({
  id: item.id,
  name: item.name,
  ingredients: item.ingredients ?? "",
  quantity: item.quantity,
  unit: item.unit,
  allergens: item.allergens.map(({ allergen }) => allergen.name),
});

/** Converte il menù di Prisma in un oggetto semplice, passabile ai componenti client. */
export function toMenuDetail(menu: RawMenu): MenuDetail {
  return {
    id: menu.id,
    name: menu.name,
    cost: menu.cost,
    dietType: menu.dietType ?? "",
    timeSlot: menu.timeSlot ?? "",
    foods: menu.foods.map(({ food }) => toItem(food)),
    beverages: menu.beverages.map(({ beverage }) => toItem(beverage)),
  };
}
