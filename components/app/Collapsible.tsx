'use client'

import { useState } from 'react'

interface CollapsibleProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
  badge?: string
}

export function Collapsible({ title, isOpen, onToggle, children, badge }: CollapsibleProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">{title}</span>
          {badge && (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {badge}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  )
}
