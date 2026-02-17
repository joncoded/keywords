import { TranslationResponse } from '@/types/translation'

interface TranslationResultsProps {
  query: string
  isLoading: boolean
  result?: TranslationResponse
  error?: string
}

export default function PanglishTranslationResults({ 
  query, 
  isLoading, 
  result,
  error 
}: TranslationResultsProps) {
  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mt-8 p-8 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-4"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mt-8 p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-800">
        <h2 className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase mb-2">
          Error
        </h2>
        <p className="text-lg text-red-700 dark:text-red-300">
          {error}
        </p>
      </div>
    )
  }

  if (!result) {
    return null
  }

  return (
    <div className="space-y-6">

      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-indigo-900/20 rounded-lg border-2 border-green-200 dark:border-green-800 p-6">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
          Original English
        </h2>
        <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
          {query}
        </p>
        
        <h2 className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase mb-2">
          Panglish Translation (tongue-shift)
        </h2>
        <p className="text-2xl font-bold text-green-900 dark:text-green-100">
          {result.translation}
        </p>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700 p-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          📚 Etymology
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {result.explanation}
        </p>
      </div>

      {result.alternatives && result.alternatives.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700 p-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            🔄 Alternates 
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">Note: alternatives may include some components from non-Germanic words ... trust but verify!</p>
          <ul className="space-y-2">
            {result.alternatives.map((alt, index) => (
              <li 
                key={index}
                className="text-gray-700 dark:text-gray-300 pl-4 border-l-4 border-red-300 dark:border-red-600"
              >
                {alt}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
