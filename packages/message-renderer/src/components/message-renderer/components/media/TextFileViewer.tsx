import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkEmoji from 'remark-emoji'
import rehypeRaw from 'rehype-raw'
import Editor from '@monaco-editor/react'

interface TextFileViewerProps {
  url: string
  extension: string
}

export const TextFileViewer: React.FC<TextFileViewerProps> = ({ url, extension }) => {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTextContent = async () => {
      try {
        setLoading(true)
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`)
        }
        const text = await response.text()
        setContent(text)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTextContent()
  }, [url])

  // Map file extensions to language modes for Monaco
  const getLanguageFromExtension = (ext: string): string => {
    const map: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'cs': 'csharp',
      'go': 'go',
      'html': 'html',
      'css': 'css',
      'md': 'markdown',
      'json': 'json',
      'yaml': 'yaml',
      'yml': 'yaml',
      'sh': 'shell',
      'bash': 'shell',
      'txt': 'plaintext',
    }
    return map[ext] || 'plaintext'
  }

  if (loading) {
    return <div className="p-4 text-center">Loading text file...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading file: {error}</div>
  }

  const language = getLanguageFromExtension(extension)

  if (extension === 'md') {
    return (
      <div className="border rounded p-4 my-4 bg-white dark:bg-gray-800">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkEmoji]}
          rehypePlugins={[rehypeRaw]}
        >
          {content}
        </ReactMarkdown>
      </div>
    )
  }

  return (
    <div className="my-4 rounded overflow-hidden border border-gray-200 dark:border-gray-700">
      <Editor
        height="300px"
        language={language}
        value={content}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on'
        }}
      />
    </div>
  )
} 