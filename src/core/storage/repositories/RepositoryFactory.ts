import type { IBrewMethodRepository } from "./interfaces/IBrewMethodRepository";
import type { ISessionRepository } from "./interfaces/ISessionRepository";
import type { ICoffeeRepository } from "./interfaces/ICoffeeRepository";
import {
  LocalStorageBrewMethodRepository,
  LocalStorageSessionRepository,
  LocalStorageCoffeeRepository,
} from "./localStorage";

/**
 * Factory for creating repository instances
 * Centralizes repository instantiation and makes it easy to swap storage implementations
 */
export class RepositoryFactory {
  /**
   * Create a session repository instance
   * @returns Session repository implementation
   */
  static createSessionRepository(): ISessionRepository {
    return new LocalStorageSessionRepository();
  }

  /**
   * Create a brew method repository instance
   * @returns Brew method repository implementation
   */
  static createBrewMethodRepository(): IBrewMethodRepository {
    return new LocalStorageBrewMethodRepository();
  }

  /**
   * Create a coffee repository instance
   * @returns Coffee repository implementation
   */
  static createCoffeeRepository(): ICoffeeRepository {
    return new LocalStorageCoffeeRepository();
  }
}
