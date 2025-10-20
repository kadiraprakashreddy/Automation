/**
 * DataStore - In-memory storage for extracted data during automation runs
 * Allows steps to store and retrieve data for later use
 */
class DataStore {
  constructor() {
    this.store = new Map();
  }

  /**
   * Store a value with a key
   * @param {string} key - The key to store the value under
   * @param {any} value - The value to store
   */
  set(key, value) {
    this.store.set(key, value);
  }

  /**
   * Retrieve a value by key
   * @param {string} key - The key to retrieve
   * @returns {any} The stored value or undefined
   */
  get(key) {
    return this.store.get(key);
  }

  /**
   * Check if a key exists
   * @param {string} key - The key to check
   * @returns {boolean}
   */
  has(key) {
    return this.store.has(key);
  }

  /**
   * Delete a key-value pair
   * @param {string} key - The key to delete
   */
  delete(key) {
    this.store.delete(key);
  }

  /**
   * Get all stored data
   * @returns {Object}
   */
  getAll() {
    return Object.fromEntries(this.store);
  }

  /**
   * Clear all stored data
   */
  clear() {
    this.store.clear();
  }

  /**
   * Get the number of stored items
   * @returns {number}
   */
  size() {
    return this.store.size;
  }
}

export default new DataStore();

