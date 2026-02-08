/* 
keywords by @joncoded (aka @jonchius)
/app/blog/page.tsx
blog posts (list of entries)
*/

import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts } from '@/lib/blog'

export default function BlogPage() {
  const posts = getAllPosts()

  if (posts.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Blog</h1>
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <p className="text-gray-600 dark:text-gray-400 text-center">
              No blog posts yet ... check back soon!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm mb-4 inline-block"
          >
            ← Back to home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Blog</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {posts.length} post{posts.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
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
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2 mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>
                </Link>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}