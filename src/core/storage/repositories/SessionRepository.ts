import type { BrewingSession } from '../../../types/coffee';
import type { StorageAdapter } from '../StorageAdapter';
import { BaseRepository } from './BaseRepository';

/**
 * Repository for brewing sessions
 */
export class SessionRepository extends BaseRepository<BrewingSession> {
  constructor(storage: StorageAdapter) {
    super('coffee-brew-sessions', storage);
  }

  /**
   * Add a new session (adds to the beginning of the list)
   * @param session - The session to add
   */
  add(session: BrewingSession): void {
    try {
      const sessions = this.findAll();
      sessions.unshift(session); // Add new session at the beginning
      this.saveAll(sessions);
    } catch (error) {
      console.error('Failed to add session:', error);
      throw new Error('Failed to add session');
    }
  }

  /**
   * Find sessions sorted by timestamp (newest first)
   * @returns Array of sessions sorted by timestamp
   */
  findAllSorted(): BrewingSession[] {
    const sessions = this.findAll();
    return sessions.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Find sessions by brewing method
   * @param methodId - The brewing method ID
   * @returns Array of sessions for the specified method
   */
  findByMethod(methodId: string): BrewingSession[] {
    return this.findAll().filter(session => session.brewingMethod === methodId);
  }

  /**
   * Find sessions by preset
   * @param presetId - The preset ID
   * @returns Array of sessions using the specified preset
   */
  findByPreset(presetId: string): BrewingSession[] {
    return this.findAll().filter(session => session.brewingPreset === presetId);
  }

  /**
   * Find sessions by coffee type
   * @param coffeeType - The coffee type/name
   * @returns Array of sessions for the specified coffee type
   */
  findByCoffeeType(coffeeType: string): BrewingSession[] {
    return this.findAll().filter(
      session => session.coffeeType.toLowerCase().includes(coffeeType.toLowerCase())
    );
  }

  /**
   * Find sessions by rating
   * @param rating - The minimum rating (1-5)
   * @returns Array of sessions with rating >= specified rating
   */
  findByRating(rating: number): BrewingSession[] {
    return this.findAll().filter(session => session.rating && session.rating >= rating);
  }

  /**
   * Get sessions within a date range
   * @param startDate - Start timestamp
   * @param endDate - End timestamp
   * @returns Array of sessions within the date range
   */
  findByDateRange(startDate: number, endDate: number): BrewingSession[] {
    return this.findAll().filter(
      session => session.timestamp >= startDate && session.timestamp <= endDate
    );
  }
}
