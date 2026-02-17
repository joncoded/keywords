'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import PanglishSearchBar from './PanglishSearchBar'
import PanglishTranslationResults from './PanglishTranslationResults'
import { TranslationResponse } from '@/types/translation'
import { getCachedTranslation, setCachedTranslation } from '@/lib/panglish-cache'
import Link from 'next/dist/client/link'

export default function PanglishSearchInterface() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [result, setResult] = useState<TranslationResponse | undefined>()
  const [error, setError] = useState<string | undefined>()
  
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleSearch = useCallback(async (query: string, updateUrl = true) => {
    setIsLoading(true)
    setSearchQuery(query)
    setHasSearched(true)
    setError(undefined)
    setResult(undefined)

    if (updateUrl) {
      router.push(`/panglish?q=${encodeURIComponent(query)}`, { scroll: false })
    }

    try {
      const cached = getCachedTranslation<TranslationResponse>(query)
      if (cached) {
        setResult(cached)
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to translate')
      }

      setResult(data.data)
      setCachedTranslation(query, data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    const queryFromUrl = searchParams.get('q')
    if (queryFromUrl) {
      handleSearch(queryFromUrl, false) 
    }
  }, [searchParams, handleSearch])

  const handleReset = () => {
    setSearchQuery('')
    setHasSearched(false)
    setResult(undefined)
    setError(undefined)
    setIsLoading(false)
    
    router.push('/panglish', { scroll: false })
  }

  return (
    <div>
      {!hasSearched ? (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">
              Welcome to Panglish
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-500 my-2 text-center">
              (<strong>Panglish</strong> = <em className="mr-1">&quot;Pan-&quot;</em> [&quot;all&quot;] + &quot;English&quot;)
            </p>
            <p className="text-xl text-gray-600 dark:text-gray-400 text-center">
              Find out how English would have looked had it stuck with its earlier word roots!
            </p>
            <p className="text-md text-gray-500 dark:text-gray-500 mt-2 text-center">
              e.g. &quot;translation&quot; → &quot;tongue-shift&quot;, &quot;philosophy&quot; → &quot;mind-lore&quot;
            </p>
            
            <div className="mt-12">
              <PanglishSearchBar 
                onSearch={handleSearch}
                onReset={handleReset}
                isCompact={false}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            
            <div className="mb-8">
              <Link
                href="/"
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm mb-4 inline-block"
              >
                ← Back to home
              </Link>
              
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Panglish
              </h1>
                            
            </div>

            <div className="mb-8">
              <PanglishSearchBar 
                onSearch={handleSearch}
                onReset={handleReset}
                isCompact={true}
              />
            </div>

            <PanglishTranslationResults 
              query={searchQuery} 
              isLoading={isLoading}
              result={result}
              error={error}
            />
          </div>
        </div>
      )}
    </div>
  )
}
