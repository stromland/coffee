import type { Coffee } from "../../../../types/coffee";
import type { ICoffeeRepository } from "../interfaces/ICoffeeRepository";
import { BaseRepository } from "./BaseRepository";

/**
 * Default coffees
 */
export const defaultCoffees: Coffee[] = [];

/**
 * LocalStorage implementation of coffee repository
 */
export class LocalStorageCoffeeRepository
  extends BaseRepository<Coffee>
  implements ICoffeeRepository
{
  constructor() {
    super("coffee-list");
  }

  /**
   * Get all coffees including default coffees
   */
  findAll(): Coffee[] {
    const customCoffees = this.loadFromStorage();
    return [...defaultCoffees, ...customCoffees];
  }

  /**
   * Get only default (built-in) coffees
   */
  findDefaults(): Coffee[] {
    return defaultCoffees;
  }

  /**
   * Get only custom (user-created) coffees
   */
  findCustom(): Coffee[] {
    return this.loadFromStorage();
  }

  /**
   * Find a coffee by ID (searches both default and custom)
   */
  findById(id: string): Coffee | undefined {
    return this.findAll().find((coffee) => coffee.id === id);
  }

  /**
   * Save a coffee (only custom coffees can be saved)
   */
  save(coffee: Coffee): void {
    // Ensure it's marked as custom when saving
    const customCoffee = { ...coffee, isCustom: true };

    const items = this.loadFromStorage();
    const existingIndex = items.findIndex((i) => i.id === customCoffee.id);

    if (existingIndex !== -1) {
      items[existingIndex] = customCoffee;
    } else {
      items.push(customCoffee);
    }

    this.saveToStorage(items);
  }

  /**
   * Delete a coffee (only custom coffees can be deleted)
   */
  delete(id: string): void {
    // Prevent deletion of default coffees
    const coffee = this.findById(id);
    if (coffee && !coffee.isCustom) {
      throw new Error("Cannot delete default coffees");
    }

    const items = this.loadFromStorage().filter((item) => item.id !== id);
    this.saveToStorage(items);
  }

  /**
   * Count all coffees (including defaults)
   */
  count(): number {
    return this.findAll().length;
  }

  /**
   * Check if a coffee exists (searches both default and custom)
   */
  exists(id: string): boolean {
    return this.findById(id) !== undefined;
  }
}
