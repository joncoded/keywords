/* 
keywords by @joncoded (aka @jonchius)
/app/pages/[slug]/page.tsx
static pages (single page)
*/

import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getAllPages, getPageBySlug } from '@/lib/pages'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const pages = getAllPages()
  return pages.map((page) => ({
    slug: page.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const page = getPageBySlug(slug)

  if (!page) {
    return {
      title: 'Page not found',
    }
  }

  return {
    title: `${page.title} | Keywords`,
  }
}

export default async function PageDisplay({ params }: PageProps) {
  const { slug } = await params
  const page = getPageBySlug(slug)

  if (!page) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* link back to pages list */}
        <Link
          href="/pages"
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm mb-6 inline-block"
        >
          ← Back to pages
        </Link>

        {/* page heading */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {page.title}
          </h1>
        </header>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {page.content}
          </ReactMarkdown>
        </div>

      </article>
    </div>
  )
}
