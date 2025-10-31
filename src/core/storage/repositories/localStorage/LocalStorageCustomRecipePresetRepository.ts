import type { CustomRecipePreset } from "../../../../types/coffee";
import type { ICustomRecipePresetRepository } from "../interfaces/ICustomRecipePresetRepository";
import { BaseRepository } from "./BaseRepository";

/**
 * LocalStorage implementation of custom recipe preset repository
 */
export class LocalStorageCustomRecipePresetRepository
  extends BaseRepository<CustomRecipePreset>
  implements ICustomRecipePresetRepository
{
  constructor() {
    super("coffee-custom-presets");
  }
}
