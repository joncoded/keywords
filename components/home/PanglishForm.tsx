'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PanglishForm() {
  const [phrase, setPhrase] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const wordCount = phrase.trim().split(/\s+/).filter(Boolean).length
  const isValid = wordCount > 0 && wordCount <= 20

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isValid || isSubmitting) return

    setIsSubmitting(true)

    setTimeout(() => {
      const encodedPhrase = encodeURIComponent(phrase.trim())
      router.push(`/panglish?q=${encodedPhrase}`)
    }, 150)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={`mb-4`}>
        <p className={`text-md dark:text-gray-400 mb-1 transition-opacity duration-300`}>
          Translate modern English into <strong>an English that uses only Germanic roots</strong>
        </p>
        <p className={`text-sm text-gray-600 dark:text-gray-500`}>
          (e.g. &quot;translation&quot; → &quot;tongue-shift&quot;, &quot;philosophy&quot; → &quot;mind-lore&quot;)
        </p>
      </div>
      <div>
        <input
          type="text"
          value={phrase}
          onChange={(e) => {
            setPhrase(e.target.value)
          }}
          placeholder="Enter a modern English word or phrase (max 20 words)"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          disabled={isSubmitting}
        />
        <p className={`text-sm mt-1 ${
          wordCount > 20 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
        }`}>
          {wordCount} / 20 words
        </p>
      </div>

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Translating...' : 'Translate to Panglish'}
      </button>
    </form>
  )
}
