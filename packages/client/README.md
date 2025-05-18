# electric-stack-template/client ⚡️

## Client Template Repository

### For sake of saving time, for the greater good 🚀 [@tyzoo](https://github.com/tyzoo)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/tyzoo/electric-stack-template/issues)
[![Stars](https://img.shields.io/github/stars/tyzoo/electric-stack-template.svg)](https://github.com/tyzoo/electric-stack-template/stargazers)
[![Forks](https://img.shields.io/github/forks/tyzoo/electric-stack-template.svg)](https://github.com/tyzoo/electric-stack-template/network/members)
[![Issues](https://img.shields.io/github/issues/tyzoo/electric-stack-template.svg)](https://github.com/tyzoo/electric-stack-template/issues)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/tyzoo/electric-stack-template/)

Welcome to ElectricStack ⚡️, the official template repository for building local-first realtime applications

Frontend React/Vite application for the electric-stack-template project.

## Local-First Architecture

This client implements a **local-first** architecture using **@electric-sql/pglite**, providing:

- Full offline functionality with local data access
- Automatic sync when online without conflicts
- Improved performance with local-first queries
- Real-time updates across all connected clients
- Enhanced user experience with instant UI feedback

The PGLite database runs directly in the browser, enabling lightning-fast queries and complete offline functionality while seamlessly syncing with the server when a connection is available.

## Usage

For complete documentation and stack commands, see the [root README.md](../../README.md).

> **Important Development Note:**
>
> In this project, **Docker Compose** is used to run the entire development stack. The client, server, database, and all other services are already running with hot reloading enabled when you use `make dev` from the root directory.
>
> **Do not** use the commands below to start the client in development mode, as this would create duplicate processes. These commands are primarily for reference, linting/formatting, or building for error checking.

## Client-Specific Commands

```bash
# Build the client (for error checking)
npm run build

# Lint code
npm run lint

# Format code
npm run format
```

### Tech Stack

- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **ElectricSQL/PGLite** - Local-first PostgreSQL database in the browser

### Directory Structure

```
/src               # Source code
  /components      # React components
  /hooks           # Custom React hooks
  /pages           # Page components
  /utils           # Utility functions
  /electric        # ElectricSQL/PGLite setup and configuration
  App.tsx          # Main App component
  main.tsx         # Entry point
/public            # Static assets
```

## Conventions

### Component Structure

- Use functional components with hooks
- Keep components small and focused
- Place reusable components in `/components`
- Place page components in `/pages`

### Styling

- Use Tailwind CSS for styling
- Prefer utility classes over custom CSS
- Use component composition for complex UI elements

### State Management

- Use Zustand for state management (preferred over Context API)
- Use React hooks for component-local state
- Use ElectricSQL for persisted data
- Leverage ElectricSQL's reactivity for real-time updates

```tsx
// Example Zustand store
import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))
```

#### Using the PGlite Store

The application uses a Zustand store to manage the PGlite database instance:

```tsx
// Access the PGlite database in any component
import { usePGlite } from '../hooks/usePGlite'

function MyComponent() {
  const { db, isInitialized, isInitializing, error } = usePGlite()

  if (isInitializing) return <p>Loading database...</p>
  if (error) return <p>Error: {error.message}</p>
  if (!isInitialized || !db) return <p>Database not initialized</p>

  // Now you can use the PGlite database
  const handleSomething = async () => {
    await db.query('SELECT * FROM blogs')
  }

  return <div>/* Your component JSX */</div>
}
```

### Data Access

- Access data directly from the local PGLite database
- Use ElectricSQL's query builder for type-safe queries
- Create custom hooks for data access patterns
- Subscribe to data changes with `useLiveQuery`
- Handle loading and error states consistently

### Database Operation Conventions

#### Accessing the Database

- Use the `usePGlite` hook to access the PGlite database instance
- The hook handles initialization and provides loading/error states
- Example:
  ```tsx
  const { db, isInitialized } = usePGlite()
  ```

#### Reading Data

- **ALWAYS** use `useLiveQuery` whenever possible, which reads from pglite (a synced local database)
- This ensures components automatically re-render when data changes
- Queries will reactively update when data is modified locally or synced from the server
- Example:
  ```tsx
  const blogs = useLiveQuery<Blog>(
    `
    SELECT * FROM blogs ORDER BY created_at DESC
  `,
    [],
    { db },
  )
  ```

#### Writing Data

- **ALWAYS** use `useMutation` which calls REST API queries to the NestJS server
- This ensures proper tracking of changes and synchronization
- All write operations (INSERT, UPDATE, DELETE) should use mutations
- Example:

  ```tsx
  // Import the useMutation hook and axios
  import { useMutation } from 'react-query'
  import axios from 'axios'

  // Define your mutation function
  function useCreateBlog() {
    return useMutation({
      mutationFn: async (blogData) => {
        const response = await axios.post('/api/blogs', blogData)
        return response.data
      },
      onSuccess: () => {
        // The local PGlite database will be automatically updated
        // through the Electric sync process after the server operation completes
      },
    })
  }

  // Usage in a component
  function CreateBlogForm() {
    const createBlogMutation = useCreateBlog()

    const handleSubmit = async (e) => {
      e.preventDefault()

      await createBlogMutation.mutateAsync({
        title: 'New Blog Post',
        content: 'This is the content of my blog post',
        authorId: 1,
        published: true,
      })
    }

    return (
      <form onSubmit={handleSubmit}>
        {/* Form inputs */}
        <button type="submit" disabled={createBlogMutation.isPending}>
          {createBlogMutation.isPending ? 'Saving...' : 'Save'}
        </button>
      </form>
    )
  }
  ```

#### Implementation Without Dependencies

If the ElectricSQL React packages aren't available, implement similar patterns:

- For reads: Implement a custom `useLiveQuery` that polls the database
- For writes: Implement mutations that execute queries with proper error handling

### ElectricSQL Synchronization

This app uses ElectricSQL to synchronize data between the client PGlite database and the server's Postgres database. The synchronization is managed through the Zustand store and exposed via the `usePGlite` hook.

#### Accessing Sync Functions

```tsx
import { usePGlite } from '../hooks/usePGlite'

function MyComponent() {
  const {
    db,
    isInitialized,
    isSyncing,
    isInitialSyncComplete,
    startSync,
    stopSync,
    serverUrl,
    setServerUrl,
  } = usePGlite()

  // Control sync manually if needed
  const handleStartSync = () => {
    startSync()
  }

  const handleStopSync = () => {
    stopSync()
  }

  return (
    <div>
      <div>Sync Status: {isSyncing ? 'Syncing' : 'Not Syncing'}</div>
      <div>Initial Sync: {isInitialSyncComplete ? 'Complete' : 'Not Complete'}</div>
      <button onClick={handleStartSync}>Start Sync</button>
      <button onClick={handleStopSync}>Stop Sync</button>
    </div>
  )
}
```

#### Configuration Options

The `usePGlite` hook accepts configuration options:

```tsx
const { db } = usePGlite({
  autoSync: true, // Automatically start sync after initialization (default: true)
  syncDelay: 500, // Delay in ms before starting sync (default: 500)
})
```

#### Sync Process

1. When `autoSync` is enabled, the sync starts automatically after database initialization
2. The sync process connects to the server API and synchronizes data for the following tables:
   - `blogs` - Blog posts synchronized with the server
   - `comments` - Comments synchronized with the server
3. Changes made locally are automatically synced to the server when online
4. Changes made on the server are automatically synced to the client
