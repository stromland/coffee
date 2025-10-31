import type { BrewingSession } from "../../types/coffee";
import type { ISessionRepository } from "../storage/repositories/interfaces";
import { RepositoryFactory } from "../storage/repositories/RepositoryFactory";

/**
 * Session management service
 * Consolidates logic from sessionStorage.ts
 */
export class SessionService {
  private sessionRepo: ISessionRepository;

  constructor(sessionRepo: ISessionRepository) {
    this.sessionRepo = sessionRepo;
  }

  /**
   * Load all sessions (sorted by timestamp, newest first)
   */
  loadSessions(): BrewingSession[] {
    return this.sessionRepo.findAllSorted();
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
}

/**
 * Singleton instance of SessionService
 */
export const sessionService = new SessionService(RepositoryFactory.createSessionRepository());
