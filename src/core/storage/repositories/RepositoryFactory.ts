import type { ICustomRecipePresetRepository } from "./interfaces/ICustomRecipePresetRepository";
import type { IFourSixPresetRepository } from "./interfaces/IFourSixPresetRepository";
import type { ISessionRepository } from "./interfaces/ISessionRepository";
import {
  LocalStorageCustomRecipePresetRepository,
  LocalStorageFourSixPresetRepository,
  LocalStorageSessionRepository,
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
   * Create a FourSix preset repository instance
   * @returns FourSix preset repository implementation
   */
  static createFourSixPresetRepository(): IFourSixPresetRepository {
    return new LocalStorageFourSixPresetRepository();
  }

  /**
   * Create a custom recipe preset repository instance
   * @returns Custom recipe preset repository implementation
   */
  static createCustomRecipePresetRepository(): ICustomRecipePresetRepository {
    return new LocalStorageCustomRecipePresetRepository();
  }
}
