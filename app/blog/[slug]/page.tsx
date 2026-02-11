/* 
keywords by @joncoded (aka @jonchius)
/app/blog/[slug]/page.tsx
blog post single page - dynamic route based on slug
*/

import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getAllPosts, getPostBySlug } from '@/lib/blog'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: '404 (blog post not found) | Keywords',
    }
  }

  return {
    title: `${post.title} | Keywords`,
    description: post.content.slice(0, 160),
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // get all posts for navigation
  const allPosts = getAllPosts()
  const currentIndex = allPosts.findIndex((p) => p.slug === slug)
  const newerPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const olderPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null

  return (
    <div className="min-h-screen">
      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* link back to blog list */}
        <Link
          href="/blog"
          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm mb-6 inline-block"
        >
          ← Back to blog
        </Link>

        {/* blog post header */}
        <header className="mb-8">
          <time className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(post.date).toISOString().split('T')[0]}
          </time>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
            {post.title}
          </h1>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* featured image */}
        {post.image && (
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* content */}
        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-red-600 dark:prose-a:text-red-400 prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-img:rounded-lg">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* older-newer blog post navigation */}
        <nav className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            {olderPost && (
              <Link
                href={`/blog/${olderPost.slug}`}
                className="group p-4 hover:border-red-600 dark:hover:border-red-400 transition-colors"
              >
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">← Older</div>
                <div className="font-medium text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  {olderPost.title}
                </div>
              </Link>
            )}
            </div>
            <div>
            {newerPost && (
              <Link
                href={`/blog/${newerPost.slug}`}
                className="group p-4 hover:border-red-600 dark:hover:border-red-400 transition-colors md:text-right md:ml-auto"
              >
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Newer →</div>
                <div className="font-medium text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  {newerPost.title}
                </div>
              </Link>
            )}
            </div>
          </div>
        </nav>
      </article>
    </div>
  )
}
