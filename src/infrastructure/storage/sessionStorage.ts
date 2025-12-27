/**
 * SessionStorage Wrapper
 * 
 * Similar to localStorage but data is cleared when tab closes
 */

type StorageValue = string | number | boolean | object | null;

class SessionStorage {
  /**
   * Set item in sessionStorage
   */
  set<T extends StorageValue>(key: string, value: T): boolean {
    try {
      if (typeof window === "undefined") {
        console.warn("sessionStorage is not available (SSR)");
        return false;
      }

      const serialized = typeof value === "string" 
        ? value 
        : JSON.stringify(value);
      
      window.sessionStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
      return false;
    }
  }

  /**
   * Get item from sessionStorage
   */
  get<T extends StorageValue>(key: string): T | null {
    try {
      if (typeof window === "undefined") {
        return null;
      }

      const item = window.sessionStorage.getItem(key);
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
      console.error(`Error getting sessionStorage key "${key}":`, error);
      return null;
    }
  }

  /**
   * Remove item from sessionStorage
   */
  remove(key: string): boolean {
    try {
      if (typeof window === "undefined") {
        return false;
      }

      window.sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
      return false;
    }
  }

  /**
   * Clear all items from sessionStorage
   */
  clear(): boolean {
    try {
      if (typeof window === "undefined") {
        return false;
      }

      window.sessionStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing sessionStorage:", error);
      return false;
    }
  }

  /**
   * Check if key exists in sessionStorage
   */
  has(key: string): boolean {
    if (typeof window === "undefined") {
      return false;
    }
    return window.sessionStorage.getItem(key) !== null;
  }
}

export const sessionStorage = new SessionStorage();

