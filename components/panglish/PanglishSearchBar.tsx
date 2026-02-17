'use client'

import { useState, FormEvent } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
  onReset?: () => void
  isCompact?: boolean
}

export default function PanglishSearchBar({ onSearch, onReset, isCompact = false }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    const wordCount = query.trim().split(/\s+/).filter(Boolean).length
    if (!query.trim()) {
      setError('Please enter a word or phrase')
      return
    }
    if (wordCount > 20) {
      setError(`Too many words (${wordCount}/20 max)`)
      return
    }

    setError('')
    onSearch(query.trim())
  }

  const handleReset = () => {
    setQuery('')
    setError('')
    if (onReset) {
      onReset()
    }
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`w-full transition-all duration-500 ${
        isCompact ? 'max-w-7xl' : 'max-w-2xl'
      }`}
    >
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter an English word or phrase..."
          className={`w-full px-6 text-lg border-2 border-gray-300 dark:border-gray-600 
            rounded-full bg-white dark:bg-gray-800 
            focus:outline-none focus:border-red-500 dark:focus:border-red-400
            transition-all duration-200
            placeholder:text-sm md:placeholder:text-lg placeholder:text-gray-400 dark:placeholder:text-gray-500
            ${isCompact ? 'py-3 text-base' : 'py-4'}
            ${(query || isCompact) ? 'pr-44 sm:pr-40' : 'pr-32'}`}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
          {(query || isCompact) && (
            <button
              type="button"
              onClick={handleReset}
              className={`bg-gray-500 hover:bg-gray-600 text-white font-semibold
                rounded-full transition-all duration-200
                ${isCompact ? 'px-2 py-2 text-sm' : 'px-4 py-3 text-sm'}`}
              title="Clear and start new search"
            >
              Clear
            </button>
          )}
          <button
            type="submit"
            className={`bg-red-500 hover:bg-red-600 text-white font-semibold
              rounded-full transition-all duration-200
              ${isCompact ? 'px-2 py-2 text-sm' : 'px-4 py-3'}`}
            title="Translate to Panglish"
          >
            Translate
          </button>
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-2 ml-4">{error}</p>
      )}
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 ml-4">
        {query.trim().split(/\s+/).filter(Boolean).length} / 20 words
      </p>
    </form>
  )
}
