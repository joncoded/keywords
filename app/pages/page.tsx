/* 
keywords by @joncoded (aka @jonchius)
/app/pages/page.tsx
static pages (list of pages)
*/

import Link from 'next/link'
import { getAllPages } from '@/lib/pages'

export default function PagesIndex() {
  const pages = getAllPages()

  if (pages.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Pages</h1>
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <p className="text-gray-600 dark:text-gray-400 text-center">
              No pages yet: create one in the admin panel!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="mb-8">
          <Link
            href="/"
            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm mb-4 inline-block"
          >
            ← Back to home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Pages</h1>
        </div>

        <div className="space-y-4">
          {pages.map((page) => (
            <Link
              key={page.slug}
              href={`/pages/${page.slug}`}
              className="block p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors">
                {page.title}
              </h2>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}
