import { prisma } from "@/lib/prisma";
import MenusCatalog from "@/components/MenusCatalog";

export const revalidate = 0;

export default async function MenusPage({
  searchParams,
}: {
  searchParams: Promise<{ selected?: string }>;
}) {
  const params = await searchParams;
  const preselectedMenuId = params.selected;

  const rawMenus = await prisma.menu.findMany({
    include: {
      foods: {
        include: {
          allergens: true,
        },
      },
      beverages: {
        include: {
          allergens: true,
        },
      },
    },
    orderBy: {
      cost: "asc",
    },
  });

  // Convert schema relation structure to matching types in client component
  const menus = rawMenus.map((menu) => ({
    id: menu.id,
    name: menu.name,
    dietType: menu.dietType,
    timeSlot: menu.timeSlot,
    cost: menu.cost,
    foods: menu.foods.map((food) => ({
      id: food.id,
      name: food.name,
      ingredients: food.ingredients,
      quantity: food.quantity,
      unit: food.unit,
      cost: food.cost,
      allergens: food.allergens.map((a) => ({ id: a.id, name: a.name })),
    })),
    beverages: menu.beverages.map((bev) => ({
      id: bev.id,
      name: bev.name,
      ingredients: bev.ingredients,
      quantity: bev.quantity,
      unit: bev.unit,
      cost: bev.cost,
      allergens: bev.allergens.map((a) => ({ id: a.id, name: a.name })),
    })),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-b border-white/10 pb-6 mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          I Nostri Menù
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Scopri le nostre creazioni culinarie. Tocca su una portata per visualizzare l'elenco completo degli ingredienti e degli allergeni presenti.
        </p>
      </div>

      <MenusCatalog menus={menus} preselectedMenuId={preselectedMenuId} />
    </div>
  );
}
