/* 
keywords by @joncoded (aka @jonchius)
/lib/rateLimit.ts
rate limit for form filler
*/

const RATE_LIMIT_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export function checkRateLimit(type: 'phrase' | 'writing'): { 
  allowed: boolean
  timeRemaining?: number 
} {
  const key = `rateLimit_${type}`
  const lastAnalysis = localStorage.getItem(key)
  
  if (!lastAnalysis) {
    return { allowed: true }
  }
  
  const lastTime = parseInt(lastAnalysis, 10)
  const now = Date.now()
  const timePassed = now - lastTime
  
  if (timePassed < RATE_LIMIT_DURATION) {
    const timeRemaining = RATE_LIMIT_DURATION - timePassed
    return { 
      allowed: false, 
      timeRemaining: Math.ceil(timeRemaining / 1000) // seconds
    }
  }
  
  return { allowed: true }
}

export function setRateLimit(type: 'phrase' | 'writing'): void {
  const key = `rateLimit_${type}`
  localStorage.setItem(key, Date.now().toString())
}

export function formatTimeRemaining(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`
  }
  
  return `${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`
}