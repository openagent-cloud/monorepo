import { useState } from 'react'
import { useCreateComment } from '../../../hooks/useCommentMutations'

interface CreateCommentFormProps {
  blogId: string
}

export function CreateCommentForm({ blogId }: CreateCommentFormProps) {
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [authorId, setAuthorId] = useState<number>(1)

  // Get a random username for placeholder purposes
  const getUserName = (id: number) => {
    const names = ['Alex', 'Blake', 'Casey', 'Dana', 'Ellis', 'Fran', 'Glen', 'Harper']
    const surnames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia']
    return `${names[id % names.length]} ${surnames[(id + 3) % surnames.length]}`
  }

  // Use mutation for creating a comment via REST API
  const createCommentMutation = useCreateComment()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      setError('Comment content is required')
      return
    }

    setError(null)

    try {
      // Execute the mutation to create comment via API
      // ElectricSQL will automatically sync this to the local database
      await createCommentMutation.mutateAsync({
        content,
        blog_id: blogId,
        author_id: authorId
      })

      // Clear form on success
      setContent('')
      setSuccess(true)
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Error creating comment:', err)
      setError('Failed to add comment')
    }
  }

  // Calculate remaining characters
  const commentLimit = 500
  const commentRemaining = commentLimit - content.length

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-2 bg-red-100 text-red-700 text-sm rounded flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="p-2 bg-green-100 text-green-700 text-sm rounded flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Comment added successfully!
        </div>
      )}

      <div className="flex items-center mb-2">
        <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-medium mr-2">
          {authorId ? getUserName(authorId).substring(0, 2).toUpperCase() : 'XX'}
        </div>
        <div>
          <select
            value={authorId}
            onChange={(e) => setAuthorId(parseInt(e.target.value))}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded py-1 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {[1, 2, 3, 4, 5].map(id => (
              <option key={id} value={id}>
                {getUserName(id)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Your Comment
          </label>
          <span className={`text-xs ${commentRemaining < 50 ? 'text-amber-500' : 'text-gray-500'}`}>
            {commentRemaining} characters left
          </span>
        </div>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, commentLimit))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={createCommentMutation.isPending}
          placeholder="Share your thoughts on this post..."
          maxLength={commentLimit}
        />
      </div>

      <button
        type="submit"
        disabled={createCommentMutation.isPending || !content.trim()}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
      >
        {createCommentMutation.isPending ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Adding...
          </span>
        ) : (
          'Add Comment'
        )}
      </button>
    </form>
  )
} 