import { prisma } from "@/lib/prisma";
import MenusCatalog from "@/components/MenusCatalog";
import { Button, EmptyState } from "@/components/ui";
import { IconNavEvents } from "@/components/icons";

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
          food: {
            include: {
              allergens: { include: { allergen: true } },
            },
          },
        },
      },
      beverages: {
        include: {
          beverage: {
            include: {
              allergens: { include: { allergen: true } },
            },
          },
        },
      },
    },
    orderBy: { cost: "asc" },
  });

  const menus = rawMenus.map((menu) => ({
    id: menu.id,
    name: menu.name,
    dietType: menu.dietType ?? "",
    timeSlot: menu.timeSlot ?? "",
    cost: menu.cost,
    foods: menu.foods.map(({ food }) => ({
      id: food.id,
      name: food.name,
      ingredients: food.ingredients ?? "",
      quantity: food.quantity,
      unit: food.unit,
      cost: food.cost,
      allergens: food.allergens.map(({ allergen }) => ({
        id: allergen.id,
        name: allergen.name,
      })),
    })),
    beverages: menu.beverages.map(({ beverage }) => ({
      id: beverage.id,
      name: beverage.name,
      ingredients: beverage.ingredients ?? "",
      quantity: beverage.quantity,
      unit: beverage.unit,
      cost: beverage.cost,
      allergens: beverage.allergens.map(({ allergen }) => ({
        id: allergen.id,
        name: allergen.name,
      })),
    })),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-b border-zinc-200/50 pb-6 mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          I Nostri Menù
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Scopri le nostre creazioni culinarie. Tocca su una portata per visualizzare ingredienti e allergeni.
        </p>
      </div>

      {menus.length === 0 ? (
        <EmptyState
          icon={IconNavEvents}
          title="Nessun menù disponibile"
          description="I nostri menù saranno pubblicati a breve. Nel frattempo scopri gli eventi in programma."
          actions={
            <Button href="/events" variant="outline">
              Scopri gli eventi
            </Button>
          }
        />
      ) : (
        <MenusCatalog menus={menus} preselectedMenuId={preselectedMenuId} />
      )}
    </div>
  );
}
