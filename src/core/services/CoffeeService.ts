import type { Coffee } from "../../types/coffee";
import { RepositoryFactory } from "../storage/repositories/RepositoryFactory";

export class CoffeeService {
  private repository = RepositoryFactory.createCoffeeRepository();

  /**
   * Get all coffees
   */
  getAllCoffees(): Coffee[] {
    return this.repository.findAll();
  }

  /**
   * Get default coffees
   */
  getDefaultCoffees(): Coffee[] {
    return this.repository.findDefaults();
  }

  /**
   * Get custom coffees
   */
  getCustomCoffees(): Coffee[] {
    return this.repository.findCustom();
  }

  /**
   * Get coffee by ID
   */
  getCoffee(id: string): Coffee | undefined {
    return this.repository.findById(id);
  }

  /**
   * Add a new coffee
   */
  addCoffee(coffee: Omit<Coffee, "id">): Coffee {
    const newCoffee: Coffee = {
      ...coffee,
      id: `coffee-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    };
    this.repository.save(newCoffee);
    return newCoffee;
  }

  /**
   * Update an existing coffee
   */
  updateCoffee(id: string, updates: Partial<Omit<Coffee, "id">>): Coffee | undefined {
    const coffee = this.repository.findById(id);
    if (!coffee) return undefined;

    const updated = { ...coffee, ...updates };
    this.repository.save(updated);
    return updated;
  }

  /**
   * Delete a coffee
   */
  deleteCoffee(id: string): void {
    this.repository.delete(id);
  }
}

export const coffeeService = new CoffeeService();
