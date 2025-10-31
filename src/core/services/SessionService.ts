import type { BrewingSession } from '../../types/coffee';
import { SessionRepository } from '../storage/repositories';
import { localStorageAdapter } from '../storage/LocalStorageAdapter';

/**
 * Session management service
 * Consolidates logic from sessionStorage.ts
 */
export class SessionService {
  private sessionRepo: SessionRepository;

  constructor() {
    this.sessionRepo = new SessionRepository(localStorageAdapter);
  }

  /**
   * Load all sessions (sorted by timestamp, newest first)
   */
  loadSessions(): BrewingSession[] {
    return this.sessionRepo.findAllSorted();
  }

  /**
   * Get a session by ID
   */
  getSessionById(sessionId: string): BrewingSession | undefined {
    return this.sessionRepo.findById(sessionId);
  }

  /**
   * Save a new session
   */
  saveSession(session: BrewingSession): void {
    this.sessionRepo.add(session);
  }

  /**
   * Delete a session
   */
  deleteSession(sessionId: string): void {
    this.sessionRepo.delete(sessionId);
  }

  /**
   * Get sessions by brewing method
   */
  getSessionsByMethod(methodId: string): BrewingSession[] {
    return this.sessionRepo.findByMethod(methodId);
  }

  /**
   * Get sessions by preset
   */
  getSessionsByPreset(presetId: string): BrewingSession[] {
    return this.sessionRepo.findByPreset(presetId);
  }

  /**
   * Get sessions by coffee type
   */
  getSessionsByCoffeeType(coffeeType: string): BrewingSession[] {
    return this.sessionRepo.findByCoffeeType(coffeeType);
  }

  /**
   * Get sessions by rating
   */
  getSessionsByRating(minRating: number): BrewingSession[] {
    return this.sessionRepo.findByRating(minRating);
  }

  /**
   * Get sessions within a date range
   */
  getSessionsByDateRange(startDate: number, endDate: number): BrewingSession[] {
    return this.sessionRepo.findByDateRange(startDate, endDate);
  }

  /**
   * Get total number of sessions
   */
  getTotalSessions(): number {
    return this.sessionRepo.count();
  }

  /**
   * Check if a session exists
   */
  sessionExists(sessionId: string): boolean {
    return this.sessionRepo.exists(sessionId);
  }

  /**
   * Clear all sessions
   */
  clearAllSessions(): void {
    this.sessionRepo.deleteAll();
  }
}

/**
 * Singleton instance of SessionService
 */
export const sessionService = new SessionService();
