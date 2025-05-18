// Declaration for CSS imports
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

// Allow importing CSS files directly
declare module 'katex/dist/katex.min.css' 