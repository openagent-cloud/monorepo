import { useState } from 'react'
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { MessageRenderer } from "./components/message-renderer/MessageRenderer"

const EXAMPLE_MARKDOWN = `# Message Renderer Demo

This is a demonstration of the **MessageRenderer** component that renders markdown content.

## Features:

- **Code Highlighting** with Shiki
- **Math Equations** with KaTeX
- **Diagrams** with Mermaid
- **YouTube Embeds** from URLs
- **Audio and Video** playback
- **3D Models** with Three.js
- **Editable Code** with Monaco Editor
- **Text File** rendering

### Code Example

\`\`\`typescript
// This is a TypeScript code example
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

### Editable Code Example

\`\`\`javascript
// [editable]
// This code block is editable - try changing it!
function calculateSum(a, b) {
  return a + b;
}

const result = calculateSum(5, 10);
console.log("The sum is:", result);
\`\`\`

### Math Example

The lift coefficient ($C_L$) is a dimensionless coefficient.

### Mermaid Diagram

\`\`\`mermaid
flowchart TB
A[Start] --> B{Is it working?}
B -->|Yes| C[Great!]
B -->|No| D[Debug]
D -->|Fix| B
\`\`\`

### Media Examples

#### YouTube Video
https://www.youtube.com/watch?v=dQw4w9WgXcQ

#### Audio File
https://samplelib.com/lib/preview/mp3/sample-3s.mp3

#### Video File
https://samplelib.com/lib/preview/mp4/sample-5s.mp4

#### 3D Model (GLB)
https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf

#### Example Text File
https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore
`

function App() {
  const [markdown, setMarkdown] = useState(EXAMPLE_MARKDOWN)

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Message Renderer Library Demo</h1>

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Edit Markdown:</h2>
        <textarea
          className="w-full h-40 p-2 border rounded"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
        />
        <div className="flex gap-2 mt-2">
          <Button onClick={() => setMarkdown(EXAMPLE_MARKDOWN)}>Reset</Button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Rendered Output:</h2>
        <div className="border rounded p-4 bg-white">
          <MessageRenderer content={markdown} />
        </div>
      </div>

      <div className="mt-8 pt-8 border-t">
        <h2 className="text-lg font-medium mb-4">Library UI Components:</h2>
        <div className="flex gap-4 items-center">
          <Button>Example Button</Button>
          <Input placeholder="Example Input" />
        </div>
      </div>
    </div>
  )
}

export default App
