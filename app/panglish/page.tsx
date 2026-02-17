import { Suspense } from 'react'
import PanglishSearchInterface from '@/components/panglish/PanglishSearchInterface'

function PanglishLoadingFallback() {
  return (
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
      </div>
    </div>
  )
}

export default function PanglishPage() {
  return (
    <Suspense fallback={<PanglishLoadingFallback />}>
      <PanglishSearchInterface />
    </Suspense>
  )
}
