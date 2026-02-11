/* 
keywords by @joncoded (aka @jonchius)
/components/home/ParagraphForm.ts
paragraph form with rate limiting
*/

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkRateLimit, setRateLimit, formatTimeRemaining } from '@/lib/rateLimit'

export default function ParagraphForm() {
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rateLimitError, setRateLimitError] = useState<string | null>(null)
  const router = useRouter()

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  const isValid = wordCount > 0 && wordCount <= 50

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isValid || isSubmitting) return

    // check rate limit
    const rateCheck = checkRateLimit('writing')
    if (!rateCheck.allowed && rateCheck.timeRemaining) {
      setRateLimitError(
        `Please wait ${formatTimeRemaining(rateCheck.timeRemaining)} before analyzing another text sample.`
      )
      return
    }

    setIsSubmitting(true)
    setRateLimitError(null)

    // set rate limit timestamp
    setRateLimit('writing')

    // generate hash for sharing
    const encoder = new TextEncoder()
    const data = encoder.encode(text.trim())
    const hashArray = Array.from(data)
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 12)

    // small delay for smooth transition
    setTimeout(() => {
      const encodedText = encodeURIComponent(text.trim())
      router.push(`/writing?h=${hash}&t=${encodedText}`)
    }, 150)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            // clear error when user types
            setRateLimitError(null) 
          }}
          placeholder="Enter your writing sample (max 50 words)"
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
          disabled={isSubmitting}
        />
        <p className={`text-sm mt-1 ${
          wordCount > 50 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
        }`}>
          {wordCount} / 50 words
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