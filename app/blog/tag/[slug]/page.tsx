/* 
keywords by @joncoded (aka @jonchius)
/app/blog/tag/[slug]/page.tsx
blog tag page - dynamic route based on tag slug
*/

import { getPostsByTag, getAllTags, getTagDescription } from '@/lib/blog'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const tags = getAllTags()
  return tags.map((tag) => ({
    slug: tag.toLowerCase().replace(/\s+/g, '-'),
  }))
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // Convert slug back to tag name (handle spaces)
  const tagName = slug.replace(/-/g, ' ')
  
  const posts = getPostsByTag(tagName)
  
  if (posts.length === 0) {
    notFound()
  }

  const description = getTagDescription(tagName)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* link back to blog list */}
      <div className="mb-8">
        <Link 
          href="/blog"
          className="text-red-600 dark:text-red-400 hover:underline text-sm mb-4 inline-block"
        >
          ← Back to blog
        </Link>
        <h1 className="text-4xl font-bold mb-2">
          Tag: <span className="text-red-600 dark:text-red-400">{tagName}</span>
        </h1>
        {description && (
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {description}
          </p>
        )}
        <p className="text-gray-500 dark:text-gray-500 mt-2">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </p>
      </div>

      {/* posts grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {post.image && (
              <div className="relative h-48 w-full">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-6">

              <h2 className="text-xl font-bold mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                {post.title}
              </h2>
              
              <time className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(post.date).toISOString().split('T')[0]}
              </time>            

            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
