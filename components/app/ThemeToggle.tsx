/* 
keywords by @joncoded (aka @jonchius)
  /app/blog/page.tsx
theme switcher
*/

'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-20 h-9 rounded-full bg-gray-600 dark:bg-gray-700 animate-pulse" />
    )
  }

  return (
    <div className="flex items-center gap-1 bg-gray-600 dark:bg-gray-700 rounded-full p-1">
      <button
        onClick={() => setTheme('light')}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
          theme === 'light'
            ? 'bg-gray-800 dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
        aria-label="Light mode"
      >
        ☀️
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
          theme === 'system'
            ? 'bg-gray-800 dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
        aria-label="System mode"
      >
        💻
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
          theme === 'dark'
            ? 'bg-gray-800 dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
        aria-label="Dark mode"
      >
        🌙
      </button>
    </div>
  )
}
