// IndexedDB Caching System for PyXom
// Implements critical order 8: Advanced browser storage for larger assets

interface CacheEntry {
  key: string;
  data: any;
  timestamp: number;
  expiry: number;
  size: number;
  type: 'asset' | 'code' | 'result' | 'settings';
}

interface CacheConfig {
  dbName: string;
  version: number;
  maxSize: number; // in bytes
  defaultExpiry: number; // in milliseconds
}

class IndexedDBCache {
  private db: IDBDatabase | null = null;
  private config: CacheConfig;
  private isInitialized = false;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      dbName: 'PyXomCache',
      version: 1,
      maxSize: 100 * 1024 * 1024, // 100MB
      defaultExpiry: 24 * 60 * 60 * 1000, // 24 hours
      ...config
    };
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.config.dbName, this.config.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create main cache store
        if (!db.objectStoreNames.contains('cache')) {
          const cacheStore = db.createObjectStore('cache', { keyPath: 'key' });
          cacheStore.createIndex('timestamp', 'timestamp');
          cacheStore.createIndex('type', 'type');
          cacheStore.createIndex('expiry', 'expiry');
        }

        // Create metadata store
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }
      };
    });
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  async set(key: string, data: any, options: {
    expiry?: number;
    type?: CacheEntry['type'];
  } = {}): Promise<void> {
    await this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    const now = Date.now();
    const expiry = options.expiry || this.config.defaultExpiry;
    const type = options.type || 'asset';
    
    // Calculate size (approximate)
    const size = this.calculateSize(data);
    
    const entry: CacheEntry = {
      key,
      data,
      timestamp: now,
      expiry: now + expiry,
      size,
      type
    };

    // Check if we need to cleanup space
    await this.cleanupIfNeeded(size);

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const request = store.put(entry);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async get(key: string): Promise<any | null> {
    await this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readonly');
      const store = transaction.objectStore('cache');
      const request = store.get(key);

      request.onsuccess = () => {
        const entry = request.result as CacheEntry;
        
        if (!entry) {
          resolve(null);
          return;
        }

        // Check if expired
        if (Date.now() > entry.expiry) {
          this.delete(key).catch(console.error);
          resolve(null);
          return;
        }

        resolve(entry.data);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async delete(key: string): Promise<void> {
    await this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    await this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async keys(): Promise<string[]> {
    await this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readonly');
      const store = transaction.objectStore('cache');
      const request = store.getAllKeys();

      request.onsuccess = () => resolve(request.result as string[]);
      request.onerror = () => reject(request.error);
    });
  }

  async getByType(type: CacheEntry['type']): Promise<CacheEntry[]> {
    await this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readonly');
      const store = transaction.objectStore('cache');
      const index = store.index('type');
      const request = index.getAll(type);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getStats(): Promise<{
    totalEntries: number;
    totalSize: number;
    typeBreakdown: Record<string, { count: number; size: number }>;
    oldestEntry: number;
    newestEntry: number;
  }> {
    await this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readonly');
      const store = transaction.objectStore('cache');
      const request = store.getAll();

      request.onsuccess = () => {
        const entries = request.result as CacheEntry[];
        
        const stats = {
          totalEntries: entries.length,
          totalSize: 0,
          typeBreakdown: {} as Record<string, { count: number; size: number }>,
          oldestEntry: Date.now(),
          newestEntry: 0
        };

        entries.forEach(entry => {
          stats.totalSize += entry.size;
          
          if (!stats.typeBreakdown[entry.type]) {
            stats.typeBreakdown[entry.type] = { count: 0, size: 0 };
          }
          stats.typeBreakdown[entry.type].count++;
          stats.typeBreakdown[entry.type].size += entry.size;

          if (entry.timestamp < stats.oldestEntry) {
            stats.oldestEntry = entry.timestamp;
          }
          if (entry.timestamp > stats.newestEntry) {
            stats.newestEntry = entry.timestamp;
          }
        });

        resolve(stats);
      };

      request.onerror = () => reject(request.error);
    });
  }

  private calculateSize(data: any): number {
    // Approximate size calculation
    const jsonString = JSON.stringify(data);
    return new Blob([jsonString]).size;
  }

  private async cleanupIfNeeded(newEntrySize: number): Promise<void> {
    const stats = await this.getStats();
    
    if (stats.totalSize + newEntrySize <= this.config.maxSize) {
      return; // No cleanup needed
    }

    // Get all entries sorted by timestamp (oldest first)
    const entries = await this.getAllEntries();
    entries.sort((a, b) => a.timestamp - b.timestamp);

    let freedSpace = 0;
    const toDelete: string[] = [];

    for (const entry of entries) {
      toDelete.push(entry.key);
      freedSpace += entry.size;
      
      if (stats.totalSize - freedSpace + newEntrySize <= this.config.maxSize) {
        break;
      }
    }

    // Delete oldest entries
    for (const key of toDelete) {
      await this.delete(key);
    }
  }

  private async getAllEntries(): Promise<CacheEntry[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readonly');
      const store = transaction.objectStore('cache');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async cleanupExpired(): Promise<number> {
    await this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');

    const now = Date.now();
    let deletedCount = 0;

    const entries = await this.getAllEntries();
    for (const entry of entries) {
      if (now > entry.expiry) {
        await this.delete(entry.key);
        deletedCount++;
      }
    }

    return deletedCount;
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.isInitialized = false;
    }
  }
}

// Specialized cache instances
export class PyodideCache extends IndexedDBCache {
  constructor() {
    super({
      dbName: 'PyXomPyodideCache',
      maxSize: 200 * 1024 * 1024, // 200MB for Pyodide assets
      defaultExpiry: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }

  async cachePyodideAsset(url: string, data: ArrayBuffer): Promise<void> {
    await this.set(`pyodide_${url}`, data, {
      type: 'asset',
      expiry: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }

  async getPyodideAsset(url: string): Promise<ArrayBuffer | null> {
    return await this.get(`pyodide_${url}`);
  }
}

export class CodeCache extends IndexedDBCache {
  constructor() {
    super({
      dbName: 'PyXomCodeCache',
      maxSize: 50 * 1024 * 1024, // 50MB for code and results
      defaultExpiry: 24 * 60 * 60 * 1000 // 24 hours
    });
  }

  async cacheExecutionResult(codeHash: string, result: any): Promise<void> {
    await this.set(`result_${codeHash}`, result, {
      type: 'result',
      expiry: 60 * 60 * 1000 // 1 hour for execution results
    });
  }

  async getExecutionResult(codeHash: string): Promise<any | null> {
    return await this.get(`result_${codeHash}`);
  }

  async cacheUserCode(userId: string, exerciseId: string, code: string): Promise<void> {
    await this.set(`code_${userId}_${exerciseId}`, code, {
      type: 'code',
      expiry: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
  }

  async getUserCode(userId: string, exerciseId: string): Promise<string | null> {
    return await this.get(`code_${userId}_${exerciseId}`);
  }
}

// Global cache instances
let pyodideCache: PyodideCache | null = null;
let codeCache: CodeCache | null = null;

export const getPyodideCache = (): PyodideCache => {
  if (!pyodideCache) {
    pyodideCache = new PyodideCache();
  }
  return pyodideCache;
};

export const getCodeCache = (): CodeCache => {
  if (!codeCache) {
    codeCache = new CodeCache();
  }
  return codeCache;
};

export { IndexedDBCache };
export type { CacheEntry, CacheConfig };
