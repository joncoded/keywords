/* 
keywords by @joncoded (aka @jonchius)
/components/home/PhraseForm.ts
phrase form with rate limiting
*/

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkRateLimit, setRateLimit, formatTimeRemaining } from '@/lib/rateLimit'

export default function PhraseForm() {
  const [phrase, setPhrase] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rateLimitError, setRateLimitError] = useState<string | null>(null)
  const router = useRouter()

  const wordCount = phrase.trim().split(/\s+/).filter(Boolean).length
  const isValid = wordCount > 0 && wordCount <= 10

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isValid || isSubmitting) return

    // check rate limit
    const rateCheck = checkRateLimit('phrase')
    if (!rateCheck.allowed && rateCheck.timeRemaining) {
      setRateLimitError(
        `Please wait ${formatTimeRemaining(rateCheck.timeRemaining)} before analyzing another phrase.`
      )
      return
    }

    setIsSubmitting(true)
    setRateLimitError(null)

    // set rate limit timestamp
    setRateLimit('phrase')

    // small delay for smooth transition
    setTimeout(() => {
      const encodedPhrase = encodeURIComponent(phrase.trim())
      router.push(`/phrase?q=${encodedPhrase}`)
    }, 150)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={`mb-4`}>
        <p className={`text-md dark:text-gray-400 transition-opacity duration-300`}>
          Analyze a word/phrase to detect its <strong>language</strong> + <strong>meaning</strong> + <strong>origins (etymology)</strong> + <strong>examples</strong> + <strong>synonyms</strong>
        </p>        
      </div>
      <div>
        <input
          type="text"
          value={phrase}
          onChange={(e) => {
            setPhrase(e.target.value)
            // clear error when user types
            setRateLimitError(null) 
          }}
          placeholder="Enter a phrase (max 10 words)"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          disabled={isSubmitting}
        />
        <p className={`text-sm mt-1 ${
          wordCount > 10 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
        }`}>
          {wordCount} / 10 words
        </p>
      </div>

      {rateLimitError && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">{rateLimitError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Analyzing...' : 'Analyze'}
      </button>
    </form>
  )
}