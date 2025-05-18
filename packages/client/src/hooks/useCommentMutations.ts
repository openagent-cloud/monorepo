import { useMutation } from '@tanstack/react-query'
import api from '../lib/axios'

interface Comment {
  id: string
  content: string
  blog_id: string
  author_id: number
  created_at: string
  updated_at: string
}

interface CreateCommentData {
  content: string
  blog_id: string
  author_id: number
}

interface UpdateCommentData {
  content?: string
}

export function useCreateComment() {
  return useMutation({
    mutationFn: async (commentData: CreateCommentData) => {
      const response = await api.post<Comment>('/comments', commentData)
      return response.data
    }
  })
}

export function useUpdateComment() {
  return useMutation({
    mutationFn: async ({ id, ...commentData }: UpdateCommentData & { id: string }) => {
      const response = await api.put<Comment>(`/comments/${id}`, commentData)
      return response.data
    }
  })
}

export function useDeleteComment() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<Comment>(`/comments/${id}`)
      return response.data
    }
  })
} 