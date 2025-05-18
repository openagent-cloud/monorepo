import React from 'react'
import Mermaid from 'react-mermaid2'

/**
 * Props for the MermaidComponent
 */
interface MermaidComponentProps {
  /**
   * Mermaid chart definition in text format
   * @example "graph TD; A-->B; A-->C; B-->D; C-->D;"
   */
  chart: string
}

/**
 * Renders Mermaid diagrams from a text definition
 * 
 * Uses react-mermaid2 for reliable rendering with React
 * 
 * @example
 * ```tsx
 * <MermaidComponent chart={`
 *   flowchart TB
 *     A[Start] --> B{Decision}
 *     B -->|Yes| C[End]
 *     B -->|No| D[Process]
 *     D --> A
 * `} />
 * ```
 */
export const MermaidComponent: React.FC<MermaidComponentProps> = ({ chart }) => {
  return (
    <div className="my-4 rounded border p-2 overflow-auto">
      <Mermaid
        chart={chart}
        config={{
          theme: 'default',
          securityLevel: 'loose',
          startOnLoad: true,
          fontFamily: 'monospace',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'linear'
          }
        }}
      />
    </div>
  )
} 