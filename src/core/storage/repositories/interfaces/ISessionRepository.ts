import type { BrewingSession } from "../../../../types/coffee";

/**
 * Interface for brewing session repository
 * Abstracts storage implementation for session management
 */
export interface ISessionRepository {
  /**
   * Get all sessions from storage
   * @returns Array of all sessions
   */
  findAll(): BrewingSession[];

  /**
   * Find a session by ID
   * @param id - The session ID
   * @returns The session or undefined if not found
   */
  findById(id: string): BrewingSession | undefined;

  /**
   * Find sessions sorted by timestamp (newest first)
   * @returns Array of sessions sorted by timestamp
   */
  findAllSorted(): BrewingSession[];

  /**
   * Add a new session (adds to the beginning of the list)
   * @param session - The session to add
   */
  add(session: BrewingSession): void;

  /**
   * Save a session (create or update)
   * @param session - The session to save
   */
  save(session: BrewingSession): void;

  /**
   * Save multiple sessions at once
   * @param sessions - Array of sessions to save
   */
  saveAll(sessions: BrewingSession[]): void;

  /**
   * Delete a session by ID
   * @param id - The session ID
   */
  delete(id: string): void;

  /**
   * Delete all sessions
   */
  deleteAll(): void;

  /**
   * Check if a session exists
   * @param id - The session ID
   * @returns True if the session exists
   */
  exists(id: string): boolean;

  /**
   * Count all sessions
   * @returns Number of sessions
   */
  count(): number;
}
