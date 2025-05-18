import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkEmoji from 'remark-emoji'
import remarkMath from 'remark-math'
import rehypeRaw from 'rehype-raw'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

import { MermaidComponent } from './components/mermaid/MermaidComponent'
import { MediaHandler } from './components/media/MediaComponents'
import { CodeEditor, renderCodeToHtml, InlineCode } from './components/code-editor/CodeEditor'

export interface MessageRendererProps {
  /** 
   * Markdown content to render. Supports:
   * - GitHub Flavored Markdown
   * - Syntax highlighted code blocks
   * - Editable code blocks (with [editable] comment)
   * - Mermaid diagrams
   * - LaTeX math equations
   * - Media embeds (YouTube, audio, video, 3D models)
   */
  content: string
  /** 
   * When true, displays examples of all supported features.
   * Useful for demonstration and testing.
   */
  showExamples?: boolean
}

/**
 * A powerful markdown renderer component with support for code highlighting,
 * mermaid diagrams, LaTeX math, and media embeds.
 * 
 * @example
 * ```tsx
 * <MessageRenderer 
 *   content="# Hello\n\nThis is **bold** text with a [link](https://example.com)" 
 * />
 * ```
 */
export const MessageRenderer: React.FC<MessageRendererProps> = ({ content, showExamples = false }) => {
  const [highlighterHtml, setHighlighterHtml] = useState<Record<string, string>>({})
  const [editableCodeBlocks, setEditableCodeBlocks] = useState<Record<string, { code: string, language: string }>>({})

  // If demo mode is enabled, add examples to the content
  const displayContent = showExamples
    ? `${content}

## Component Feature Demo

This MessageRenderer supports various content types:

### Formatted Text
You can use **bold**, *italic*, and ~~strikethrough~~ text.

### Lists
* Unordered list item 1
* Unordered list item 2
  * Nested list item

1. Ordered list item 1
2. Ordered list item 2

### Inline Code
Use \`inline code\` for small code snippets like \`const x = 5\` or \`npm install\`.

### Code Blocks
With syntax highlighting:

\`\`\`typescript
// Regular code block with syntax highlighting
function calculateSum(a: number, b: number): number {
  return a + b
}

const result = calculateSum(5, 10)
console.log(\`The sum is: \${result}\`)
\`\`\`

### Editable Code Blocks

\`\`\`javascript
// [editable]
// You can edit this code block!
function greet(name) {
  return \`Hello, \${name}!\`
}

console.log(greet('World'))
\`\`\`

### Math Equations
Inline math: $E = mc^2$

Block math:
$$
\\begin{align}
\\frac{\\partial L}{\\partial \\theta} &= \\frac{1}{N}\\sum_{i=1}^N \\frac{\\partial}{\\partial \\theta}[-y_i \\log(h_\\theta(x_i)) - (1 - y_i)\\log(1 - h_\\theta(x_i))]\\\\
&= \\frac{1}{N}\\sum_{i=1}^N [-y_i \\frac{1}{h_\\theta(x_i)}\\frac{\\partial h_\\theta(x_i)}{\\partial \\theta} - (1 - y_i)\\frac{1}{1 - h_\\theta(x_i)}\\frac{\\partial (1 - h_\\theta(x_i))}{\\partial \\theta}]\\\\
&= \\frac{1}{N}\\sum_{i=1}^N [-\\frac{y_i}{h_\\theta(x_i)} + \\frac{1 - y_i}{1 - h_\\theta(x_i)}]\\frac{\\partial h_\\theta(x_i)}{\\partial \\theta}\\\\
&= \\frac{1}{N}\\sum_{i=1}^N [\\frac{h_\\theta(x_i) - y_i}{h_\\theta(x_i)(1 - h_\\theta(x_i))}]\\frac{\\partial h_\\theta(x_i)}{\\partial \\theta}
\\end{align}
$$

### Diagrams with Mermaid
\`\`\`mermaid
flowchart TB
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D -->|Fix| B
\`\`\`

### Media Embeds
YouTube videos, audio files, and more can be embedded by placing their URLs on a line by themselves with blank lines before and after.

#### YouTube Video
Just paste a YouTube URL on its own line:

https://www.youtube.com/watch?v=dQw4w9WgXcQ

#### Audio File
Audio files are automatically embedded with controls:

https://samplelib.com/lib/preview/mp3/sample-3s.mp3

#### Video File
Video files are displayed with an embedded player:

https://samplelib.com/lib/preview/mp4/sample-5s.mp4

#### 3D Model (GLB/GLTF)
3D models can be viewed and manipulated in the browser:

https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf

#### Text File
Text files are displayed with syntax highlighting:

https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore
`
    : content

  useEffect(() => {
    const renderCodeBlocks = async () => {
      const codeBlocks = Array.from(displayContent.matchAll(/```(\w+)?\n([\s\S]*?)```/g))
      const htmlMap: Record<string, string> = {}
      const editableMap: Record<string, { code: string, language: string }> = {}

      for (const [, lang = 'txt', code] of codeBlocks) {
        try {
          const key = `codeblock-${Math.random().toString(36).substring(2, 9)}`

          // Skip mermaid code blocks, they're rendered separately
          if (lang.toLowerCase() === 'mermaid') {
            continue
          }

          // If code block has special marker, make it editable
          if (code.includes('// [editable]') || code.includes('# [editable]')) {
            editableMap[key] = { code: code.trim(), language: lang }
          } else {
            htmlMap[key] = await renderCodeToHtml(code.trim(), lang)
          }
        } catch (error) {
          console.error('Error highlighting code:', error)
        }
      }

      setHighlighterHtml(htmlMap)
      setEditableCodeBlocks(editableMap)
    }

    renderCodeBlocks()
  }, [displayContent])

  const components: Components = {
    code({ node, className, children, ...props }) {
      // Check if this is an inline code block
      const isInline = node &&
        'position' in node &&
        node.position &&
        (!node.position.start.line || node.position.start.line === node.position.end.line)

      // Look for a language class
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : ''

      // Handle Mermaid diagrams
      if (language === 'mermaid') {
        const code = String(children).replace(/\n$/, '')
        return <MermaidComponent chart={code} />
      }

      // Try to find pre-highlighted HTML for this code block
      const indexHtml = Object.keys(highlighterHtml).find(() => {
        const contentStr = String(children || '')
        return contentStr.length > 0 && Object.values(highlighterHtml).some(html => html.includes(contentStr))
      })

      // Try to find editable code block
      const indexEditable = Object.keys(editableCodeBlocks).find(() => {
        const contentStr = String(children || '')
        return contentStr.length > 0 &&
          Object.values(editableCodeBlocks).some(({ code }) =>
            contentStr.includes(code) || code.includes(contentStr))
      })

      const highlighted = indexHtml ? highlighterHtml[indexHtml] : undefined
      const editable = indexEditable ? editableCodeBlocks[indexEditable] : undefined

      if (isInline) {
        return <InlineCode>{children}</InlineCode>
      }

      // Render with Monaco if editable
      if (editable) {
        return <CodeEditor
          language={editable.language}
          code={editable.code}
          editable={true}
        />
      }

      // Use Monaco for code blocks that aren't editable but have a language
      if (language && !highlighted && children) {
        const code = String(children).replace(/\n$/, '')
        return <CodeEditor
          language={language}
          code={code}
          editable={false}
        />
      }

      if (highlighted) {
        return (
          <div
            className="rounded overflow-auto text-sm"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        )
      }

      return (
        <pre className="bg-muted p-2 rounded">
          <code className={className} data-language={language} {...props}>
            {children}
          </code>
        </pre>
      )
    },

    // Custom image handling for responsive images
    img({ src, alt, ...props }) {
      return (
        <img
          src={src}
          alt={alt || ''}
          loading="lazy"
          className="rounded max-w-full h-auto"
          {...props}
        />
      )
    },

    // Handle YouTube embeds and other media types
    p({ children }) {
      return <MediaHandler>{children}</MediaHandler>
    }
  }

  return (
    <div className="prose max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkEmoji, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        components={components}
      >
        {displayContent}
      </ReactMarkdown>
    </div>
  )
} 