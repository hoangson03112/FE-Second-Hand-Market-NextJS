/**
 * LocalStorage Wrapper
 * 
 * Provides type-safe, error-handled access to localStorage
 * with automatic JSON serialization/deserialization
 */

type StorageValue = string | number | boolean | object | null;

class LocalStorage {
  /**
   * Set item in localStorage
   */
  set<T extends StorageValue>(key: string, value: T): boolean {
    try {
      if (typeof window === "undefined") {
        console.warn("localStorage is not available (SSR)");
        return false;
      }

      const serialized = typeof value === "string" 
        ? value 
        : JSON.stringify(value);
      
      window.localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      return false;
    }
  }

  /**
   * Get item from localStorage
   */
  get<T extends StorageValue>(key: string): T | null {
    try {
      if (typeof window === "undefined") {
        return null;
      }

      const item = window.localStorage.getItem(key);
      if (item === null) {
        return null;
      }

      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(item) as T;
      } catch {
        return item as T;
      }
    } catch (error) {
      console.error(`Error getting localStorage key "${key}":`, error);
      return null;
    }
  }

  /**
   * Remove item from localStorage
   */
  remove(key: string): boolean {
    try {
      if (typeof window === "undefined") {
        return false;
      }

      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  }

  /**
   * Clear all items from localStorage
   */
  clear(): boolean {
    try {
      if (typeof window === "undefined") {
        return false;
      }

      window.localStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      return false;
    }
  }

  /**
   * Check if key exists in localStorage
   */
  has(key: string): boolean {
    if (typeof window === "undefined") {
      return false;
    }
    return window.localStorage.getItem(key) !== null;
  }

  /**
   * Get all keys from localStorage
   */
  keys(): string[] {
    if (typeof window === "undefined") {
      return [];
    }
    return Object.keys(window.localStorage);
  }
}

export const storage = new LocalStorage();

