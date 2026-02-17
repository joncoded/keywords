'use client'

import { Suspense } from 'react'
import PanglishSearchInterface from '@/components/panglish/PanglishSearchInterface'

function PanglishLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
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
