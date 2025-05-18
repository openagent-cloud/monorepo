import { useLiveQuery } from '@electric-sql/pglite-react'
import { useState, useEffect } from 'react'
import { createLogger } from '../../../lib/logger'

// Create a logger instance with the appropriate context
const logger = createLogger('BlogItem')

interface BlogItemProps {
  blog: {
    id: string
    title: string
    content: string
    published: boolean
    author_id: number
    created_at: string
    comment_count: number
  }
  isSelected: boolean
  onClick: () => void
}

interface Comment {
  id: string
  content: string
  author_id: number
  created_at: string
}

export function BlogItem({ blog, isSelected, onClick }: BlogItemProps) {
  const [error, setError] = useState<Error | null>(null)
  const [commentsData, setCommentsData] = useState<Comment[]>([])

  // Clear comments when deselected
  useEffect(() => {
    if (!isSelected) {
      setCommentsData([])
    }
  }, [isSelected])

  // Dummy query for when not selected
  const dummyQuery = 'SELECT 1 LIMIT 0'

  // Real query for comments when selected
  const commentQuery = `
    SELECT id, content, author_id, created_at
    FROM comments
    WHERE blog_id = $1
    ORDER BY created_at DESC
  `

  // Only run the query when the blog is selected to reduce unnecessary database calls
  const queryResult = useLiveQuery<Comment>(
    isSelected ? commentQuery : dummyQuery,
    isSelected ? [blog.id] : []
  )

  // Process query results when selected
  useEffect(() => {
    if (!isSelected || !queryResult) return

    try {
      let newComments: Comment[] = []

      if (Array.isArray(queryResult)) {
        newComments = queryResult
      } else if (queryResult && 'rows' in queryResult && Array.isArray(queryResult.rows)) {
        newComments = queryResult.rows
      }

      setCommentsData(newComments)
    } catch (err) {
      logger.error('Error processing comments:', err)
      setError(err instanceof Error ? err : new Error('Failed to process comments'))
    }
  }, [queryResult, isSelected])

  const formattedDate = new Date(blog.created_at).toLocaleDateString()

  // Generate a placeholder avatar for users
  const getAvatarLetters = (id: number) => {
    try {
      const names = ['Alex', 'Blake', 'Casey', 'Dana', 'Ellis', 'Fran', 'Glen', 'Harper']
      const name = names[id % names.length]
      return name.substring(0, 2).toUpperCase()
    } catch {
      return 'XX'
    }
  }

  // Get a random username for placeholder purposes
  const getUserName = (id: number) => {
    try {
      const names = ['Alex', 'Blake', 'Casey', 'Dana', 'Ellis', 'Fran', 'Glen', 'Harper']
      const surnames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia']
      return `${names[id % names.length]} ${surnames[(id + 3) % surnames.length]}`
    } catch {
      return 'User ' + id
    }
  }

  return (
    <div
      className={`p-4 rounded shadow cursor-pointer transition ${isSelected ? 'bg-blue-50 border border-blue-300' : 'bg-white hover:bg-gray-50'}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-semibold">{blog.title}</h2>
        <span className={`px-2 py-1 text-xs rounded ${blog.comment_count > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-200'}`}>
          {blog.comment_count} {blog.comment_count === 1 ? 'comment' : 'comments'}
        </span>
      </div>

      {/* Author information */}
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium mr-2">
          {getAvatarLetters(blog.author_id)}
        </div>
        <div>
          <div className="text-sm font-medium">{getUserName(blog.author_id)}</div>
          <div className="text-gray-500 text-xs flex gap-2 items-center">
            <span>{formattedDate}</span>
            <span>•</span>
            {blog.published ? (
              <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">Published</span>
            ) : (
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">Draft</span>
            )}
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed">
        {blog.content.slice(0, 200)}
        {blog.content.length > 200 ? (
          <span>... <span className="text-blue-500 text-sm">Read more</span></span>
        ) : null}
      </p>

      {isSelected && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium flex items-center">
              Comments
              <div className="bg-blue-50 text-blue-700 text-xs ml-2 px-2 py-0.5 rounded">
                ↓ Live Query
              </div>
            </h3>
            <span className="text-xs text-gray-500">
              {commentsData?.length || 0} {commentsData?.length === 1 ? 'comment' : 'comments'}
            </span>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded mb-3 text-sm">
              Error loading comments: {error.message}
            </div>
          )}

          {!error && commentsData && commentsData.length > 0 ? (
            <div className="space-y-3">
              {commentsData.map((comment: Comment) => (
                <div key={comment.id} className="p-3 bg-gray-50 rounded-md border border-gray-100">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-medium mr-2">
                      {getAvatarLetters(comment.author_id)}
                    </div>
                    <div className="text-xs font-medium">{getUserName(comment.author_id)}</div>
                    <div className="text-xs text-gray-500 ml-2">
                      {comment.created_at ? new Date(comment.created_at).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Unknown date'}
                    </div>
                  </div>

                  <p className="text-gray-800">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm italic">No comments yet.</p>
              <p className="text-gray-400 text-xs mt-1">Be the first to add a comment!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 