import React, { useState, useEffect } from "react";
import { coffeeService } from "../../core/services/CoffeeService";
import type { Coffee } from "../../types/coffee";
import CoffeeEditor from "../../components/CoffeeManager";

const CoffeePage: React.FC = () => {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [editingCoffee, setEditingCoffee] = useState<Coffee | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);

  useEffect(() => {
    loadCoffees();
  }, []);

  const loadCoffees = () => {
    setCoffees(coffeeService.getAllCoffees());
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingCoffee({
      id: "",
      brand: "",
      name: "",
      description: undefined,
      roast: "medium",
      type: "beans",
      isCustom: true,
    });
  };

  const handleEdit = (coffee: Coffee) => {
    if (!coffee.isCustom) {
      alert("Cannot edit default coffees. Create a copy instead.");
      return;
    }
    setEditingCoffee(coffee);
  };

  const handleDuplicate = (coffee: Coffee) => {
    const newCoffee: Coffee = {
      ...coffee,
      id: "",
      name: `${coffee.name} (Copy)`,
      isCustom: true,
    };
    setEditingCoffee(newCoffee);
  };

  const handleSave = (coffee: Coffee) => {
    if (editingCoffee?.id) {
      coffeeService.updateCoffee(editingCoffee.id, coffee);
    } else {
      coffeeService.addCoffee(coffee);
    }
    setEditingCoffee(null);
    setIsCreating(false);
    loadCoffees();
  };

  const handleCancel = () => {
    setEditingCoffee(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    const coffee = coffeeService.getCoffee(id);
    if (!coffee) return;

    if (!coffee.isCustom) {
      alert("Cannot delete default coffees");
      return;
    }

    if (confirm(`Are you sure you want to delete "${coffee.name}"?`)) {
      coffeeService.deleteCoffee(id);
      loadCoffees();
    }
  };

  if (editingCoffee || isCreating) {
    return (
      <CoffeeEditor
        coffee={editingCoffee}
        onSave={handleSave}
        onCancel={handleCancel}
        onDuplicate={
          editingCoffee && !isCreating ? () => handleDuplicate(editingCoffee) : undefined
        }
      />
    );
  }

  // Group coffees by brand
  const brands = new Map<string, Coffee[]>();
  coffees.forEach((coffee) => {
    const brand = coffee.brand || "Other";
    if (!brands.has(brand)) {
      brands.set(brand, []);
    }
    brands.get(brand)!.push(coffee);
  });

  return (
    <div className="bg-white dark:bg-olive/20 backdrop-blur-sm rounded-lg p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-coffee rounded-full"></div>
          <h2 className="text-xl font-bold text-olive-dark dark:text-cream">Coffee Library</h2>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-coffee hover:bg-coffee/80 text-white dark:text-cream rounded-lg transition-all font-medium text-sm flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Coffee
        </button>
      </div>

      {coffees.length === 0 ? (
        <div className="mt-6 p-6 bg-white dark:bg-olive-dark/30 rounded-lg text-center">
          <p className="text-olive/80 dark:text-caramel/70 text-sm">
            No coffees yet. Click "Add Coffee" to start building your library.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Array.from(brands.entries()).map(([brand, brandCoffees]) => (
            <div key={brand} className="border-2 border-coffee/50 dark:border-caramel/20 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedBrand(expandedBrand === brand ? null : brand)}
                className="w-full px-4 py-3 bg-white dark:bg-olive-dark/30 hover:bg-white dark:hover:bg-olive-dark/50 transition-colors flex items-center justify-between"
              >
                <span className="font-semibold text-olive-dark dark:text-cream">{brand}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-olive/80 dark:text-caramel/70">
                    {brandCoffees.length} {brandCoffees.length === 1 ? "coffee" : "coffees"}
                  </span>
                  <svg
                    className={`w-5 h-5 text-olive dark:text-caramel transition-transform ${
                      expandedBrand === brand ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {expandedBrand === brand && (
                <div className="divide-y divide-caramel/10">
                  {brandCoffees.map((coffee) => (
                    <CoffeeCard
                      key={coffee.id}
                      coffee={coffee}
                      onEdit={() => handleEdit(coffee)}
                      onDelete={() => handleDelete(coffee.id)}
                      onDuplicate={!coffee.isCustom ? () => handleDuplicate(coffee) : undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface CoffeeCardProps {
  coffee: Coffee;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

const CoffeeCard: React.FC<CoffeeCardProps> = ({ coffee, onEdit, onDelete, onDuplicate }) => {
  const roastColors: Record<string, string> = {
    light: "bg-yellow-600/20 text-yellow-100 border-yellow-600/30",
    medium: "bg-amber-600/20 text-amber-100 border-amber-600/30",
    dark: "bg-orange-900/20 text-orange-100 border-orange-900/30",
  };

  return (
    <div className="p-4 bg-white dark:bg-olive-dark/20 hover:bg-white dark:hover:bg-olive-dark/30 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-1">
            <h3 className="font-semibold text-olive-dark dark:text-cream">{coffee.name}</h3>
          </div>
          {coffee.description && (
            <p className="text-sm text-caramel/80 mb-3 line-clamp-2">{coffee.description}</p>
          )}
          <div className="flex gap-2 flex-wrap">
            <span className={`text-xs px-2 py-1 rounded border ${roastColors[coffee.roast]}`}>
              {coffee.roast.charAt(0).toUpperCase() + coffee.roast.slice(1)}
            </span>
            <span className="text-xs px-2 py-1 rounded border bg-blue-900/20 text-blue-100 border-blue-900/30">
              {coffee.type === "beans" ? "Beans" : "Ground"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {coffee.isCustom ? (
            <>
              <button
                onClick={onEdit}
                className="p-2 text-olive dark:text-caramel hover:text-coffee dark:hover:text-cream hover:bg-white dark:hover:bg-olive-dark/50 rounded transition-colors"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </>
          ) : (
            <button
              onClick={onDuplicate}
              className="p-2 text-olive dark:text-caramel hover:text-coffee dark:hover:text-cream hover:bg-white dark:hover:bg-olive-dark/50 rounded transition-colors"
              title="Duplicate"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoffeePage;
