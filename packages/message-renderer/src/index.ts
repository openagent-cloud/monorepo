// Main component export
export { MessageRenderer } from './components/message-renderer/MessageRenderer'
export type { MessageRendererProps } from './components/message-renderer/MessageRenderer'

// Allow direct usage of sub-components if needed
export { MermaidComponent } from './components/message-renderer/components/mermaid/MermaidComponent'
export { TextFileViewer } from './components/message-renderer/components/media/TextFileViewer'
export {
  YouTubeEmbed,
  AudioPlayer,
  VideoPlayer
} from './components/message-renderer/components/media/MediaComponents'