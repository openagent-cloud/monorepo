import { useMutation } from '@tanstack/react-query'
import api from '../lib/axios'

interface Blog {
  id: string
  title: string
  content: string
  published: boolean
  author_id: number
  created_at: string
  updated_at: string
}

interface CreateBlogData {
  title: string
  content: string
  published?: boolean
  author_id: number
}

interface UpdateBlogData {
  title?: string
  content?: string
  published?: boolean
}

export function useCreateBlog() {
  return useMutation({
    mutationFn: async (blogData: CreateBlogData) => {
      const response = await api.post<Blog>('/blogs', blogData)
      return response.data
    }
  })
}

export function useUpdateBlog() {
  return useMutation({
    mutationFn: async ({ id, ...blogData }: UpdateBlogData & { id: string }) => {
      const response = await api.put<Blog>(`/blogs/${id}`, blogData)
      return response.data
    }
  })
}

export function useDeleteBlog() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<Blog>(`/blogs/${id}`)
      return response.data
    }
  })
} 