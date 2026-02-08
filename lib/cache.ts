/* 
keywords by @joncoded (aka @jonchius)
/app/lib/cache.ts
caches searches for up to 1 year to reduce LLM API usage
*/

const CACHE_DURATION = 365 * 24 * 60 * 60 * 1000 // 1 year in milliseconds

interface CacheEntry<T> {
  data: T
  timestamp: number
}

export function getCachedAnalysis<T>(
  type: 'phrase' | 'writing',
  query: string
): T | null {
  try {
    const cacheKey = `cache_${type}_${generateCacheKey(query)}`
    const cached = localStorage.getItem(cacheKey)
    
    if (!cached) return null
    
    const entry: CacheEntry<T> = JSON.parse(cached)
    const now = Date.now()
    
    // check cache age
    if (now - entry.timestamp < CACHE_DURATION) {
      return entry.data
    }
    
    // if expired remove from cache
    localStorage.removeItem(cacheKey)
    return null
  } catch (error) {
    console.error('Error reading cache:', error)
    return null
  }
}

export function setCachedAnalysis<T>(
  type: 'phrase' | 'writing',
  query: string,
  data: T
): void {
  try {
    const cacheKey = `cache_${type}_${generateCacheKey(query)}`
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now()
    }
    localStorage.setItem(cacheKey, JSON.stringify(entry))
  } catch (error) {
    console.error('Error writing cache:', error)
    // clear old entries if localStorage is full or corrupted
    clearExpiredCache()
  }
}

function generateCacheKey(query: string): string {
  
  // normalize query (trim, lowercase) to improve cache hit rate
  const normalized = query.trim().toLowerCase()
  
  // hash generation using a simple algorithm (djb2)
  let hash = 0
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash 
  }
  
  return Math.abs(hash).toString(36)
}

export function clearExpiredCache(): void {
  try {
    const now = Date.now()
    const keysToRemove: string[] = []
    
    // find expired cache entries
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.startsWith('cache_phrase_') || key.startsWith('cache_writing_'))) {
        const cached = localStorage.getItem(key)
        if (cached) {
          try {
            const entry: CacheEntry<any> = JSON.parse(cached)
            if (now - entry.timestamp >= CACHE_DURATION) {
              keysToRemove.push(key)
            }
          } catch {
            // invalid cache entry, remove it
            keysToRemove.push(key)
          }
        }
      }
    }
    
    // delete expired entries
    keysToRemove.forEach(key => localStorage.removeItem(key))
    
    console.log(`Cleared ${keysToRemove.length} expired cache entries`)
  } catch (error) {
    console.error('Error clearing expired cache:', error)
  }
}

export function clearAllCache(): void {
  try {
    const keysToRemove: string[] = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.startsWith('cache_phrase_') || key.startsWith('cache_writing_'))) {
        keysToRemove.push(key)
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key))
    
    console.log(`Cleared ${keysToRemove.length} cache entries`)
  } catch (error) {
    console.error('Error clearing cache:', error)
  }
}