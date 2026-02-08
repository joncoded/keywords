'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* skip to main content for a11y */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
          >
            Skip to main content
          </a>

          {/* logo */}
          <Link 
            href="/" 
            className="text-xl font-bold text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <span aria-hidden="true">🔑 字</span> Keywords
          </Link>

          {/* desktop navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/blog"
              className="text-sm font-medium text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/pages"
              className="text-sm font-medium text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Pages
            </Link>
            <ThemeToggle />
          </div>

          {/* mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-gray-200 dark:border-gray-800">
            <Link
              href="/blog"
              className="block text-sm font-medium text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/pages"
              className="block text-sm font-medium text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pages
            </Link>
            <div className="pt-2">
              <ThemeToggle />
            </div>
          </div>
        )}
        
      </nav>
    </header>
  )
}
