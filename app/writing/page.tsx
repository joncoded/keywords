'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import ParagraphForm from '@/components/home/ParagraphForm'
import { Collapsible } from '@/components/app/Collapsible'
import { getCachedAnalysis, setCachedAnalysis } from '@/lib/cache'

interface Etymology {
  origin: string
  history: string
}

interface Example {
  sentence: string
  romanization?: string
  translation?: string
}

interface Inflection {
  form: string
  value: string
}

interface InflectionData {
  type: string
  forms: Inflection[]
}

interface DifficultWord {
  word: string
  cefrLevel: string
  romanization?: string
  definition: string
  etymology: Etymology
  examples: Example[]
  rephrasing: string
  inflections: InflectionData | null
}

interface WritingAnalysis {
  originalText: string
  language: string
  translation: string
  summary: string
  difficultWords: DifficultWord[]
}

function WritingAnalysisComponent() {
  const searchParams = useSearchParams()
  const hash = searchParams.get('h')
  const text = searchParams.get('t')

  const [analysis, setAnalysis] = useState<WritingAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fromCache, setFromCache] = useState(false)
  const [openWordIndex, setOpenWordIndex] = useState<number>(0)

  useEffect(() => {
    if (!hash || !text) {
      return
    }

    const analyzeWriting = async () => {
      
      setLoading(true)
      setError(null)

      try {

        // check cache 
        const cached = getCachedAnalysis<WritingAnalysis>('writing', text)

        if (cached) {
          setAnalysis(cached)
          setFromCache(true)
          setLoading(false)
          return
        }

        // if not in cache then call api
        setFromCache(false)
        const response = await fetch('/api/analyze-writing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        })

        if (!response.ok) {
          throw new Error('Failed to analyze writing')
        }

        const data = await response.json()
        setAnalysis(data)

        // cache result
        setCachedAnalysis('writing', text, data)

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    analyzeWriting()
  }, [hash, text])

  if (!hash && !text) {
    return (
      <div className="min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Analyze writing
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Submit a writing sample to analyze difficult words and get explanations!
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <ParagraphForm />
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Analyzing writing sample...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <ParagraphForm />
          </div>
        </div>
      </div>
    )
  }

  if (!analysis) return null

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* writing heading */}

        <div className="mb-8">
        
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            "{analysis.originalText}"
          </h1>

          <p className="text-gray-500 dark:text-gray-300 mt-2">{analysis.language} writing</p>

        </div>

        {/* translation / summary */}
        <section className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {analysis.translation === 'Already in English' ? 'Summary' : 'Translation & Summary'}
          </h2>
          {analysis.translation !== 'Already in English' && (
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              <span className="font-medium">Translation:</span> {analysis.translation}
            </p>
          )}
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-medium">Simple explanation:</span> {analysis.summary}
          </p>
        </section>

        {/* vocabulary builder */}
        {analysis.difficultWords.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Vocabulary builder 
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-200 mb-4">{analysis.difficultWords.length} "difficult" (<a href="https://share.google/aimode/iAdpVwOHVMwv2P5bX" className="text-red-600 hover:underline" target="_blank">CEFR level B2</a> or higher) word{analysis.difficultWords.length !== 1 ? 's' : ''} found</p>
            <div className="space-y-4">
              {analysis.difficultWords.map((word, index) => (
                <Collapsible
                  key={index}
                  title={word.word}
                  badge={word.cefrLevel}
                  isOpen={openWordIndex === index}
                  onToggle={() => setOpenWordIndex(openWordIndex === index ? -1 : index)}
                >
                  <div className="space-y-4">
                    {/* transliteration to Latin characters */}
                    {word.romanization && (
                      <div>
                        <p className="text-sm font-mono text-gray-600 dark:text-gray-400">
                          {word.romanization}
                        </p>
                      </div>
                    )}

                    {/* meaning */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Meaning
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">{word.definition}</p>
                    </div>

                    {/* etymology */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Etymology
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span className="font-medium">Origin:</span> {word.etymology.origin}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">History:</span> {word.etymology.history}
                      </p>
                    </div>

                    {/* examples */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Examples
                      </h3>
                      <div className="space-y-3">
                        {word.examples.map((example, exIndex) => (
                          <div key={exIndex} className="border-l-4 border-red-600 pl-3">
                            <p className="text-gray-700 dark:text-gray-300 text-sm">{example.sentence}</p>
                            {example.romanization && (
                              <p className="text-xs font-mono text-gray-500 dark:text-gray-500 mt-1">
                                {example.romanization}
                              </p>
                            )}
                            {example.translation && (
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {example.translation}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* rephrasing */}
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Simplified: 
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">{word.rephrasing}</p>
                    </div>

                    {/* inflections */}
                    {word.inflections && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Inflections ({word.inflections.type})
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                  Form
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                  Value
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {word.inflections.forms.map((inflection, infIndex) => (
                                <tr key={infIndex}>
                                  <td className="px-3 py-2 text-sm text-gray-900 dark:text-white font-medium">
                                    {inflection.form}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                                    {inflection.value}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </Collapsible>
              ))}
            </div>
          </section>
        )}

        {analysis.difficultWords.length === 0 && (
          <section className="mb-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <p className="text-green-800 dark:text-green-200">
              Great! This text doesn't contain any difficult words (CEFR B1+) ... it's written at an accessible level!
            </p>
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

export default function WritingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    }>
      <WritingAnalysisComponent />
    </Suspense>
  )
}
