const CACHE_DURATION = 365 * 24 * 60 * 60 * 1000

interface CacheEntry<T> {
  data: T
  timestamp: number
}

export function getCachedTranslation<T>(query: string): T | null {
  if (typeof window === 'undefined') return null

  try {
    const cacheKey = `cache_translation_${generateCacheKey(query)}`
    const cached = localStorage.getItem(cacheKey)

    if (!cached) return null

    const entry: CacheEntry<T> = JSON.parse(cached)
    const now = Date.now()

    if (now - entry.timestamp < CACHE_DURATION) {
      return entry.data
    }

    localStorage.removeItem(cacheKey)
    return null
  } catch (error) {
    console.error('Error reading cache:', error)
    return null
  }
}

export function setCachedTranslation<T>(query: string, data: T): void {
  if (typeof window === 'undefined') return

  try {
    const cacheKey = `cache_translation_${generateCacheKey(query)}`
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    }
    localStorage.setItem(cacheKey, JSON.stringify(entry))
  } catch (error) {
    console.error('Error writing cache:', error)
    clearExpiredCache()
  }
}

function generateCacheKey(query: string): string {
  const normalized = query.trim().toLowerCase()
  let hash = 0

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }

  return Math.abs(hash).toString(36)
}

export function clearExpiredCache(): void {
  if (typeof window === 'undefined') return

  try {
    const now = Date.now()
    const keysToRemove: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('cache_translation_')) {
        const cached = localStorage.getItem(key)
        if (cached) {
          try {
            const entry: CacheEntry<unknown> = JSON.parse(cached)
            if (now - entry.timestamp >= CACHE_DURATION) {
              keysToRemove.push(key)
            }
          } catch {
            keysToRemove.push(key)
          }
        }
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key))
  } catch (error) {
    console.error('Error clearing cache:', error)
  }
}
