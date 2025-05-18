import { useState } from 'react'
import { useCreateBlog } from '../../../hooks/useBlogMutations'
import { createLogger } from '../../../lib/logger'

// Create a logger instance with the appropriate context
const logger = createLogger('CreateBlogForm')

export function CreateBlogForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [authorId, setAuthorId] = useState<number>(2)

  // Use mutation for creating a blog post via REST API
  const createBlogMutation = useCreateBlog()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required')
      return
    }

    setError(null)

    try {
      // Use the author ID from the input field
      await createBlogMutation.mutateAsync({
        title,
        content,
        published,
        author_id: authorId
      })

      // Clear form on success
      setTitle('')
      setContent('')
      setSuccess(true)
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      logger.error('Error creating blog:', err)
      setError('Failed to create blog post')
    }
  }

  // Calculate remaining characters (optional limits)
  const titleLimit = 100
  const contentLimit = 2000
  const titleRemaining = titleLimit - title.length
  const contentRemaining = contentLimit - content.length

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-2 bg-red-100 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="p-2 bg-green-100 text-green-700 text-sm rounded flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Blog post created successfully!
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <span className={`text-xs ${titleRemaining < 20 ? 'text-amber-500' : 'text-gray-500'}`}>
            {titleRemaining} characters left
          </span>
        </div>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, titleLimit))}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={createBlogMutation.isPending}
          placeholder="Enter an interesting title"
          maxLength={titleLimit}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <span className={`text-xs ${contentRemaining < 200 ? 'text-amber-500' : 'text-gray-500'}`}>
            {contentRemaining} characters left
          </span>
        </div>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, contentLimit))}
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={createBlogMutation.isPending}
          placeholder="Write your blog post here..."
          maxLength={contentLimit}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="authorId" className="block text-sm font-medium text-gray-700">
            Author ID
          </label>
          <span className="text-xs text-blue-500">
            Use ID 2 for user "zoo"
          </span>
        </div>
        <input
          type="number"
          id="authorId"
          value={authorId}
          onChange={(e) => setAuthorId(parseInt(e.target.value) || 2)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={createBlogMutation.isPending}
          min="1"
        />
      </div>

      <div className="flex items-center">
        <input
          id="published"
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          disabled={createBlogMutation.isPending}
        />
        <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
          Publish immediately
        </label>
      </div>

      <button
        type="submit"
        disabled={createBlogMutation.isPending || !title.trim() || !content.trim()}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
      >
        {createBlogMutation.isPending ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating...
          </span>
        ) : (
          'Create Blog Post'
        )}
      </button>
    </form>
  )
} 