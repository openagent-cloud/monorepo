import React from 'react'
import Editor from '@monaco-editor/react'
import { codeToHtml } from 'shiki'

export interface EditableCodeBlock {
  code: string
  language: string
}

export interface CodeEditorProps {
  language: string
  code: string
  editable?: boolean
  height?: string
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  code,
  editable = false,
  height = editable ? "300px" : "200px"
}) => {
  return (
    <div className="my-4 rounded overflow-hidden border border-gray-200 dark:border-gray-700">
      <Editor
        height={height}
        language={language}
        value={code}
        theme="vs-dark"
        options={{
          readOnly: !editable,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on'
        }}
      />
    </div>
  )
}

export const renderCodeToHtml = async (code: string, language: string): Promise<string> => {
  try {
    return await codeToHtml(code.trim(), {
      lang: language,
      theme: 'nord'
    })
  } catch (error) {
    console.error('Error highlighting code:', error)
    return `<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto"><code>${code}</code></pre>`
  }
}

export const InlineCode: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <code className="bg-muted px-1 py-0.5 rounded">{children}</code>
} 