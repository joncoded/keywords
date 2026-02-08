/* 
keywords by @joncoded (aka @jonchius)
/lib/blog.ts
blog handler
*/

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/blog')

// helper to parse comma-separated tags
function parseTags(tags: string | string[] | undefined): string[] {
  if (!tags) return []
  if (Array.isArray(tags)) return tags
  return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
}

export interface BlogPost {
  slug: string
  title: string
  date: string
  image?: string
  tags?: string[]
  draft: boolean
  content: string
}

export function getAllPosts(): BlogPost[] {
  // check if directory exists
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug: data.slug || slug,
        title: data.title,
        date: data.date,
        image: data.image,
        tags: parseTags(data.tags),
        draft: data.draft || false,
        content,
      } as BlogPost
    })

  // filter out drafts and future-dated posts
  const now = new Date()
  const publishedPosts = allPostsData.filter(post => {
    if (post.draft) return false
    const postDate = new Date(post.date)
    return postDate <= now
  })

  // sort by date descending
  return publishedPosts.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug: data.slug || slug,
      title: data.title,
      date: data.date,
      image: data.image,
      tags: parseTags(data.tags),
      draft: data.draft || false,
      content,
    } as BlogPost
  } catch (error) {
    return null
  }
}

export function getLatestPosts(limit: number = 5): BlogPost[] {
  const allPosts = getAllPosts()
  return allPosts.slice(0, limit)
}

export function getPostsByTag(tag: string): BlogPost[] {
  const allPosts = getAllPosts()
  return allPosts.filter(post => 
    post.tags?.some(t => t.toLowerCase() === tag.toLowerCase())
  )
}

export function getAllTags(): string[] {
  const allPosts = getAllPosts()
  const tagSet = new Set<string>()
  
  allPosts.forEach(post => {
    post.tags?.forEach(tag => tagSet.add(tag))
  })
  
  return Array.from(tagSet).sort()
}

// tag description interface
export interface TagDescription {
  name: string
  slug: string
  description?: string
}

// read tag descriptions from CMS
export function getTagDescription(tagName: string): string | undefined {
  const tagsDirectory = path.join(process.cwd(), 'content/tags')
  
  if (!fs.existsSync(tagsDirectory)) {
    return undefined
  }

  try {
    const fileNames = fs.readdirSync(tagsDirectory)
    
    for (const fileName of fileNames) {
      if (!fileName.endsWith('.md')) continue
      
      const fullPath = path.join(tagsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)
      
      if (data.name?.toLowerCase() === tagName.toLowerCase()) {
        return data.description
      }
    }
  } catch (error) {
    return undefined
  }
  
  return undefined
}

export function getAllTagDescriptions(): Record<string, TagDescription> {
  const tagsDirectory = path.join(process.cwd(), 'content/tags')
  const descriptions: Record<string, TagDescription> = {}
  
  if (!fs.existsSync(tagsDirectory)) {
    return descriptions
  }

  try {
    const fileNames = fs.readdirSync(tagsDirectory)
    
    fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .forEach(fileName => {
        const fullPath = path.join(tagsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data } = matter(fileContents)
        
        if (data.name) {
          descriptions[data.name.toLowerCase()] = {
            name: data.name,
            slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
            description: data.description,
          }
        }
      })
  } catch (error) {
    return descriptions
  }
  
  return descriptions
}
