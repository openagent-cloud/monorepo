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

## Client-Specific Development

### Local Development

```bash
# Start just the client in development mode
npm run dev

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

- Use React hooks for local state
- Use context API for shared state when needed
- Use ElectricSQL for persisted data
- Leverage ElectricSQL's reactivity for real-time updates

### Data Access

- Access data directly from the local PGLite database
- Use ElectricSQL's query builder for type-safe queries
- Create custom hooks for data access patterns
- Subscribe to data changes with `useLiveQuery`
- Handle loading and error states consistently
