import React from 'react'

// ThreeSupport type
interface ThreeSupportType {
  isAvailable: boolean
  GLBViewer: React.ComponentType<{ url: string }> | null
}

// Initial ThreeSupport object - we're simplifying this to avoid version issues
export const ThreeSupport: ThreeSupportType = {
  isAvailable: false,
  GLBViewer: null
}

// Fallback component when 3D libraries aren't available
export const GLBViewerFallback: React.FC<{ url: string }> = ({ url }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded border p-4 my-4 text-center">
      <p>3D model viewer is currently disabled</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        Open 3D model ({url})
      </a>
    </div>
  )
} 