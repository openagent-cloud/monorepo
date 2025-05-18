import { useEffect, useState, useCallback } from 'react'
import { useLiveQuery } from '@electric-sql/pglite-react'
import { BlogItem } from './BlogItem'
import { createLogger } from '../../../lib/logger'

// Create a logger instance with the appropriate context
const logger = createLogger('BlogList')

interface Blog {
  id: string
  title: string
  content: string
  published: boolean
  author_id: number
  created_at: string
  comment_count: number
}

// Field definition in query results
interface QueryField {
  name: string
  dataTypeID: number
}

// Define query result types
type BlogCountResult = { count: number }[] | { rows?: { count: number }[], fields?: QueryField[] } | null | undefined
type BlogsQueryResult = Blog[] | { rows?: Blog[], fields?: QueryField[] } | null | undefined

interface BlogListProps {
  selectedBlogId: string | null
  onSelectBlog: (blogId: string) => void
}

export function BlogList({ selectedBlogId, onSelectBlog }: BlogListProps) {
  // Add state to safely store results
  const [blogCount, setBlogCount] = useState<number | undefined>(undefined)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [error, setError] = useState<Error | null>(null)

  // Use blog counts to show proper loading state
  const blogCountResult = useLiveQuery<{ count: number }>(
    'SELECT COUNT(*) as count FROM blogs',
    []
  )

  // Extract count from query result
  const extractCount = useCallback((result: BlogCountResult): number | undefined => {
    try {
      if (result && 'rows' in result && result.rows && result.rows.length > 0) {
        return Number(result.rows[0].count)
      } else if (Array.isArray(result) && result.length > 0) {
        return Number(result[0].count)
      }
      return undefined
    } catch (err) {
      logger.error('Error extracting count:', err)
      return undefined
    }
  }, [])

  // Process blog count results safely
  useEffect(() => {
    if (!blogCountResult) return

    const count = extractCount(blogCountResult)
    if (count !== undefined) {
      setBlogCount(count)
    }
  }, [blogCountResult, extractCount])

  // Live query for blogs - updates in real-time when data changes
  const blogsQuery = useLiveQuery<Blog>(
    `
    SELECT 
      b.id, 
      b.title, 
      b.content, 
      b.published, 
      b.author_id, 
      b.created_at,
      COUNT(c.id) as comment_count
    FROM blogs b
    LEFT JOIN comments c ON b.id = c.blog_id
    GROUP BY b.id
    ORDER BY b.created_at DESC
    `,
    [],
  )

  // Extract blogs from query result
  const extractBlogs = useCallback((result: BlogsQueryResult): Blog[] => {
    try {
      if (Array.isArray(result)) {
        return result
      } else if (result && typeof result === 'object' && 'rows' in result && Array.isArray(result.rows)) {
        return result.rows
      }
      return []
    } catch (err) {
      logger.error('Error extracting blogs:', err)
      return []
    }
  }, [])

  // Compare two blog arrays for equality
  const areBlogsEqual = useCallback((a: Blog[], b: Blog[]): boolean => {
    if (a.length !== b.length) return false

    // Compare each blog by ID
    const aIds = new Set(a.map(blog => blog.id))
    return b.every(blog => aIds.has(blog.id))
  }, [])

  // Process blogs results safely
  useEffect(() => {
    try {
      if (!blogsQuery) return

      const newBlogs = extractBlogs(blogsQuery)

      // Only update if the actual data changed
      if (!areBlogsEqual(newBlogs, blogs)) {
        setBlogs(newBlogs)
      }
    } catch (error) {
      logger.error('Error processing blogs:', error)
      setError(error instanceof Error ? error : new Error('Failed to load blog posts'))
      setBlogs([])
    }
  }, [blogsQuery, extractBlogs, areBlogsEqual, blogs])

  // Debug logs for troubleshooting - use only when needed
  useEffect(() => {
    if (import.meta.env.DEV) {
      logger.debug('Query state:', {
        blogsQuery: blogsQuery ? 'data present' : 'undefined',
        blogCount,
        blogLength: blogs.length
      })
    }
  }, [blogsQuery, blogs, blogCount])

  // Show loading state if blog count is undefined (still loading)
  if (blogCount === undefined) {
    return (
      <div className="p-6 bg-white rounded shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-white rounded shadow">
        <div className="text-red-500 mb-4">
          <p className="font-semibold">Error loading blogs:</p>
          <p>{error.message}</p>
        </div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </button>
      </div>
    )
  }

  if (blogs.length === 0) {
    return (
      <div className="p-8 bg-white rounded shadow text-center">
        <div className="text-gray-400 mb-3 text-6xl">📝</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No blog posts yet</h3>
        <p className="text-gray-500 mb-6">Create your first post using the form</p>
        <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 inline-block">
          <p>💡 Create a blog post and see it appear instantly!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          Recent Posts
          <div className="bg-blue-50 text-blue-700 text-xs ml-2 px-2 py-0.5 rounded">
            ↓ Live Query
          </div>
        </h2>
        <span className="text-sm text-gray-500">
          {blogs.length} {blogs.length === 1 ? 'post' : 'posts'}
        </span>
      </div>
      <div className="space-y-4">
        {blogs.map((blog) => (
          <div key={blog.id}>
            <BlogItem
              blog={blog}
              isSelected={blog.id === selectedBlogId}
              onClick={() => onSelectBlog(blog.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
} 