/* 
keywords by @joncoded (aka @jonchius)
/app/phrase/page.tsx
user submits a phrase for analysis 
responses retrieved from an LLM (via api/analyze-phrase/route.ts)
then displayed on UI
*/

'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { getCachedAnalysis, setCachedAnalysis } from '@/lib/cache'

// type definitions

interface Etymology {
  origin: string
  history: string
  evolution: string
}

interface Example {
  sentence: string
  romanization?: string
  translation?: string
  context: string
}

interface Synonym {
  word: string
  romanization?: string
  context: string
}

interface Inflection {
  form: string
  value: string
  translation: string
}

interface InflectionData {
  type: string
  forms: Inflection[]
}

interface PhraseAnalysis {
  phrase: string
  language: string
  romanization: string
  translation: string
  meaning: string
  etymology: Etymology
  examples: Example[]
  synonyms: Synonym[]
  inflections: InflectionData | null
}

function PhraseAnalysisComponent() {
  const searchParams = useSearchParams()
  const phrase = searchParams.get('q')
  
  const [analysis, setAnalysis] = useState<PhraseAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fromCache, setFromCache] = useState(false)

  useEffect(() => {
    if (!phrase) {
      setLoading(false)
      return
    }

    const analyzePhrase = async () => {
      try {
        
        // check cache
        const cached = getCachedAnalysis<PhraseAnalysis>('phrase', phrase)
        
        if (cached) {
          setAnalysis(cached)
          setFromCache(true)
          setLoading(false)
          return
        }
        
        setFromCache(false)

        // if not in cache then call api
        const response = await fetch('/api/analyze-phrase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phrase }),
        })

        if (!response.ok) {
          throw new Error('Failed to analyze phrase')
        }

        const data = await response.json()
        setAnalysis(data)
                
        // cache result
        setCachedAnalysis('phrase', phrase, data)
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    analyzePhrase()
  }, [phrase])

  if (!phrase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No phrase provided</p>
          <Link
            href="/"
            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Analyzing phrase...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Link
            href="/"
            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    )
  }

  if (!analysis) return null

  return (
    <div className="min-h-screen">      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* phrase heading */}
        <div className="mb-8">

          <Link
            href="/"
            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm mb-4 inline-block"
          >
            ← Back to home
          </Link>        

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {phrase}
          </h1>

          <p className="text-gray-500 dark:text-gray-300 mt-2">{analysis.language} phrase</p>
          
        </div>

        {/* translation (with meaning) */}
        <section className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Meaning</h2>
          
          <p className="text-gray-700 dark:text-gray-300">{analysis.translation} ({analysis.meaning.charAt(0).toLowerCase() + analysis.meaning.slice(1)})</p>
        </section>

        {/* etymology */}
        <section className="mb-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Etymology</h2>
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Origin</h3>
              <p className="text-gray-700 dark:text-gray-300">{analysis.etymology.origin}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">History</h3>
              <p className="text-gray-700 dark:text-gray-300">{analysis.etymology.history}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Evolution</h3>
              <p className="text-gray-700 dark:text-gray-300">{analysis.etymology.evolution}</p>
            </div>
          </div>
        </section>

        {/* examples */}
        <section className="mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Examples</h2>
          <div className="space-y-4">
            {analysis.examples.map((example, index) => (
              <div key={index} className="border-l-4 border-red-600 pl-4">
                <p className="text-gray-900 dark:text-white font-medium mb-1">{example.sentence}</p>
                {example.romanization && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1 font-mono">
                    Romanization: {example.romanization}
                  </p>
                )}
                {example.translation && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                    Translation: {example.translation}
                  </p>
                )}
                <p className="text-gray-500 dark:text-gray-500 text-sm">{example.context}</p>
              </div>
            ))}
          </div>
        </section>

        {/* synonyms */}
        <section className="mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Synonyms</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysis.synonyms.map((synonym, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-900 dark:text-white font-medium mb-1">{synonym.word}</p>
                {synonym.romanization && (
                  <p className="text-gray-600 dark:text-gray-400 text-xs mb-1 font-mono">
                    [ {synonym.romanization} ]
                  </p>
                )}
                <p className="text-gray-600 dark:text-gray-400 text-sm">{synonym.context}</p>
              </div>
            ))}
          </div>
        </section>

        {/* inflections */}
        {analysis.inflections && (
          <section className="mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Inflections ({analysis.inflections.type})
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Form
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Translation
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {analysis.inflections.forms.map((inflection, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                        {inflection.form}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {inflection.value}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {inflection.translation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              
            </div>
          </section>
        )}

        {fromCache && (
          <p className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-5 rounded mt-4">
            Cached result (analysis was saved from a previous query)
          </p>
        )}

      </div>
    </div>
  )
}

export default function PhrasePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    }>
      <PhraseAnalysisComponent />
    </Suspense>
  )
}
