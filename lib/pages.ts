/* 
keywords by @joncoded (aka @jonchius)
/lib/pages.ts
static page handler
*/

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const pagesDirectory = path.join(process.cwd(), 'content/pages')

export interface Page {
  slug: string
  title: string
  content: string
}

export function getAllPages(): Page[] {
  // check if directory exists
  if (!fs.existsSync(pagesDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(pagesDirectory)
  
  const allPagesData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(pagesDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug: data.slug || slug,
        title: data.title,
        content,
      } as Page
    })

  // sort by title alphabetically
  return allPagesData.sort((a, b) => a.title.localeCompare(b.title))
}

export function getPageBySlug(slug: string): Page | null {
  try {
    const fullPath = path.join(pagesDirectory, `${slug}.md`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug: data.slug || slug,
      title: data.title,
      content,
    } as Page
  } catch (error) {
    return null
  }
}
