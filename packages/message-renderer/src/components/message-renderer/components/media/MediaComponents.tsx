import React from 'react'
import { GLBViewerFallback } from '../three-support/ThreeSupport'
import { TextFileViewer } from './TextFileViewer'

// Media components
export const YouTubeEmbed: React.FC<{ videoId: string }> = ({ videoId }) => (
  <div className="relative aspect-video my-4 w-full">
    <iframe
      src={`https://www.youtube.com/embed/${videoId}`}
      className="absolute top-0 left-0 w-full h-full rounded"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
)

export const AudioPlayer: React.FC<React.AudioHTMLAttributes<HTMLAudioElement>> = ({ src, ...rest }) => (
  <div className="my-4">
    <audio controls className="w-full" src={src} {...rest}>
      Your browser does not support the audio element.
    </audio>
  </div>
)

export const VideoPlayer: React.FC<React.VideoHTMLAttributes<HTMLVideoElement>> = ({ src, ...rest }) => (
  <div className="relative aspect-video my-4 w-full">
    <video
      controls
      className="absolute top-0 left-0 w-full h-full rounded"
      src={src}
      {...rest}>
      Your browser does not support the video element.
    </video>
  </div>
)

// Function to recursively extract text content from React nodes
const extractTextContent = (children: React.ReactNode): string => {
  if (typeof children === 'string') {
    return children
  }

  if (Array.isArray(children)) {
    return children.map(extractTextContent).join('')
  }

  if (React.isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode }
    return extractTextContent(props.children || '')
  }

  return ''
}

// Handle YouTube embeds and other media types
export const MediaHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Extract all text content from children
  const textContent = extractTextContent(children).trim()

  console.log('Extracted text content:', textContent)

  // Skip processing if there's no content or it's not URL-like
  if (!textContent || !textContent.startsWith('http')) {
    return <p>{children}</p>
  }

  // Check if the content is a single URL (no other text)
  const isJustUrl = /^https?:\/\/\S+$/i.test(textContent)

  if (!isJustUrl) {
    return <p>{children}</p>
  }

  console.log('Processing URL:', textContent)

  // YouTube - match common formats
  if (textContent.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/)) {
    const videoId = textContent.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/)?.[1]
    console.log('YouTube match:', videoId)
    if (videoId) {
      return <YouTubeEmbed videoId={videoId} />
    }
  }

  // YouTube short links
  if (textContent.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)) {
    const videoId = textContent.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)?.[1]
    console.log('YouTube short match:', videoId)
    if (videoId) {
      return <YouTubeEmbed videoId={videoId} />
    }
  }

  // Audio
  if (textContent.match(/\.(mp3|wav|ogg|m4a)(\?.*)?$/i)) {
    console.log('Audio match:', textContent)
    return <AudioPlayer src={textContent} />
  }

  // Video
  if (textContent.match(/\.(mp4|webm|ogv)(\?.*)?$/i)) {
    console.log('Video match:', textContent)
    return <VideoPlayer src={textContent} />
  }

  // 3D Models
  if (textContent.match(/\.(glb|gltf)(\?.*)?$/i)) {
    console.log('3D model match:', textContent)
    // Always use fallback for now since we disabled ThreeSupport
    return <GLBViewerFallback url={textContent} />
  }

  // Text file
  if (
    textContent.match(/\.(txt|md|js|jsx|ts|tsx|py|java|c|cpp|cs|go|html|css|json|yaml|yml|sh|bash|gitignore)(\?.*)?$/i) ||
    textContent.match(/raw\.githubusercontent\.com/)
  ) {
    console.log('Text file match:', textContent)
    const extension = textContent.split('.').pop()?.toLowerCase() || 'txt'
    return <TextFileViewer url={textContent} extension={extension} />
  }

  // If it looks like a URL but wasn't caught by other handlers, make it clickable
  console.log('Generic URL:', textContent)
  return (
    <p>
      <a
        href={textContent}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        {textContent}
      </a>
    </p>
  )
} 