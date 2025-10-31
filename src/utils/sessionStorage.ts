import type { BrewingSession } from "../types/coffee";

const STORAGE_KEY = "coffee-brew-sessions";

export const loadSessions = (): BrewingSession[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored) as BrewingSession[];
  } catch (error) {
    console.error("Failed to load sessions:", error);
    return [];
  }
};

export const saveSession = (session: BrewingSession): void => {
  try {
    const sessions = loadSessions();
    sessions.unshift(session); // Add new session at the beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error("Failed to save session:", error);
    throw new Error("Failed to save session");
  }
};

export const deleteSession = (sessionId: string): void => {
  try {
    const sessions = loadSessions().filter((s) => s.id !== sessionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error("Failed to delete session:", error);
    throw new Error("Failed to delete session");
  }
};

export const getSessionById = (sessionId: string): BrewingSession | undefined => {
  return loadSessions().find((s) => s.id === sessionId);
};
