import type { BrewingSession } from "../../../../types/coffee";
import type { ISessionRepository } from "../interfaces/ISessionRepository";
import { BaseRepository } from "./BaseRepository";

/**
 * LocalStorage implementation of session repository
 */
export class LocalStorageSessionRepository
  extends BaseRepository<BrewingSession>
  implements ISessionRepository
{
  constructor() {
    super("coffee-brew-sessions");
  }

  /**
   * Add a new session (adds to the beginning of the list)
   * @param session - The session to add
   */
  add(session: BrewingSession): void {
    try {
      const sessions = this.loadFromStorage();
      sessions.unshift(session); // Add new session at the beginning
      this.saveToStorage(sessions);
    } catch (error) {
      console.error("Failed to add session:", error);
      throw new Error("Failed to add session");
    }
  }

  /**
   * Find sessions sorted by timestamp (newest first)
   * @returns Array of sessions sorted by timestamp
   */
  findAllSorted(): BrewingSession[] {
    const sessions = this.loadFromStorage();
    return sessions.sort((a, b) => b.timestamp - a.timestamp);
  }
}
