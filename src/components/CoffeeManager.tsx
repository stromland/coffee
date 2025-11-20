import React, { useEffect, useState } from "react";
import { Input, Select } from "../shared/components/ui";
import { generateSecureId } from "../shared/utils/idGenerator";
import type { Coffee, CoffeeRoast, CoffeeType } from "../types/coffee";

interface CoffeeEditorProps {
  coffee: Coffee | null;
  onSave: (coffee: Coffee) => void;
  onCancel: () => void;
  onDuplicate?: () => void;
}

const CoffeeEditor: React.FC<CoffeeEditorProps> = ({ coffee, onSave, onCancel, onDuplicate }) => {
  const [brand, setBrand] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [roast, setRoast] = useState<CoffeeRoast>("medium");
  const [type, setType] = useState<CoffeeType>("beans");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (coffee) {
      setBrand(coffee.brand);
      setName(coffee.name);
      setDescription(coffee.description || "");
      setRoast(coffee.roast);
      setType(coffee.type);
    }
  }, [coffee]);

  const validate = (): boolean => {
    const newErrors: string[] = [];

    if (!brand.trim()) {
      newErrors.push("Brand is required");
    }
    if (!name.trim()) {
      newErrors.push("Name is required");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const savedCoffee: Coffee = {
      id: coffee?.id || generateSecureId("coffee"),
      brand: brand.trim(),
      name: name.trim(),
      description: description.trim() || undefined,
      roast,
      type,
      isCustom: true,
    };

    onSave(savedCoffee);
  };

  return (
    <div className="bg-white dark:bg-olive/20 backdrop-blur-sm rounded-lg p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-coffee rounded-full"></div>
          <h2 className="text-xl font-bold text-olive-dark dark:text-cream">
            {coffee?.id ? "Edit Coffee" : "Add New Coffee"}
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Input
            label="Brand"
            placeholder="e.g., Single Origin, Blend, Local Roaster"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            fullWidth
          />

          <Input
            label="Name"
            placeholder="e.g., Ethiopian Yirgacheffe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <div>
            <label className="block text-sm font-medium text-olive-dark dark:text-cream mb-2">
              Description (Optional)
            </label>
            <textarea
              placeholder="Describe the coffee's flavor profile, origin, or characteristics..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-olive-dark/50 border-2 border-coffee/50 dark:border-caramel/30 rounded-lg text-olive-dark dark:text-cream placeholder-olive/50 dark:placeholder-caramel/50 focus:outline-none focus:border-coffee"
              rows={3}
            />
          </div>

          <Select
            label="Roast"
            value={roast}
            onChange={(e) => setRoast(e.target.value as CoffeeRoast)}
            options={[
              { value: "light", label: "Light" },
              { value: "medium", label: "Medium" },
              { value: "dark", label: "Dark" },
            ]}
            fullWidth
          />

          <Select
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value as CoffeeType)}
            options={[
              { value: "beans", label: "Beans" },
              { value: "ground", label: "Ground" },
            ]}
            fullWidth
          />

          {errors.length > 0 && (
            <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-3">
              <ul className="space-y-1">
                {errors.map((error, idx) => (
                  <li key={idx} className="text-sm text-red-300 flex items-start gap-2">
                    <span>•</span>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          {onDuplicate && (
            <button
              onClick={onDuplicate}
              className="flex-1 px-6 py-3 bg-white dark:bg-olive-dark/50 hover:bg-white dark:hover:bg-olive-dark/70 text-olive dark:text-caramel hover:text-coffee dark:hover:text-cream rounded-lg font-semibold transition-colors"
            >
              Duplicate
            </button>
          )}
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-white dark:bg-olive-dark/50 hover:bg-white dark:hover:bg-olive-dark/70 text-olive dark:text-caramel hover:text-coffee dark:hover:text-cream rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-coffee hover:bg-coffee/80 text-white dark:text-cream rounded-lg font-semibold transition-colors"
          >
            {coffee?.id ? "Save Changes" : "Add Coffee"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeEditor;
