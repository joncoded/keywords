/* 
keywords by @joncoded (aka @jonchius)
/app/page.tsx
home page - main landing page
*/

import { Tabs } from '@/components/home/Tabs'
import PhraseForm from '@/components/home/PhraseForm'
import ParagraphForm from '@/components/home/ParagraphForm'
import { getLatestPosts } from '@/lib/blog'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const latestPosts = getLatestPosts(6)

  const analysisTabs = [
    {
      id: 'phrase',
      label: 'Phrase',
      content: <PhraseForm />,
    },
    {
      id: 'paragraph',
      label: 'Writing',
      content: <ParagraphForm />,
    },
  ]

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">

        {/* hero */}
        <div className="mb-6 md:mb-12">
          <h1 className="text-lg md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to <span className="text-red-600">Keywords</span>!
          </h1>
          <p className="text-md md:text-lg text-gray-600 dark:text-gray-400">
            Understand phrases, analyze writing, and learn more about interesting words!
          </p>
        </div>

        {/* "analysis" tabs */}
        <section className="mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Start here</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <Tabs tabs={analysisTabs} defaultTab="phrase" />
          </div>
        </section>

        {/* blog */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">From the blog</h2>
            {latestPosts.length > 0 && (
              <Link
                href="/blog"
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
              >
                View all →
              </Link>
            )}
          </div>
          
          {latestPosts.length === 0 ? (
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                No blog posts yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {post.image && (
                    <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <time className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(post.date).toISOString().split('T')[0]}
                    </time>
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-2 hover:text-red-600 dark:hover:text-red-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                    {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded"
                        >
                          <Link href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}>{tag}</Link>
                        </span>
                      ))}
                    </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
