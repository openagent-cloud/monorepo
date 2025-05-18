# @openagent-cloud/zustand-explorer

A fully-featured interactive visualizer for Zustand stores in React applications.

## Features

- 🔍 **Real-time state visualization**: See live updates to your Zustand store state
- 🔎 **Search and filter**: Quickly find specific state properties
- ⏳ **Time-travel debugging**: Rewind to previous states for debugging
- 🔄 **Multiple store support**: Visualize and switch between multiple Zustand stores
- 🌓 **Theming**: Light, dark, and system theme support
- 🔍 **Deep state inspection**: Expandable tree view for nested objects and arrays
- 🎯 **Customizable depth**: Configure how deep state should be expanded by default

## Installation

No additional installation required - this component is part of the `electric-stack-template` project.

## Usage

### Basic Example

```tsx
import { ZustandExplorer } from '@/components/features/zustand-explorer'
import { useMyStore } from '@/stores/my-store'

function ZustandDebugPanel() {
  // Set up the stores to visualize
  const stores = [
    {
      name: 'My Store',
      store: useMyStore as unknown as StoreApi<unknown>,
      initialState: useMyStore.getState() as unknown as Record<string, unknown>,
    },
  ]

  return <ZustandExplorer stores={stores} height="600px" theme="system" expandDepth={2} />
}
```

### Props

| Prop          | Type                            | Default    | Description                                |
| ------------- | ------------------------------- | ---------- | ------------------------------------------ |
| `stores`      | `StoreData[]`                   | Required   | Array of store objects to visualize        |
| `width`       | `string \| number`              | `'100%'`   | Width of the explorer component            |
| `height`      | `string \| number`              | `'500px'`  | Height of the explorer component           |
| `theme`       | `'light' \| 'dark' \| 'system'` | `'system'` | Color theme for the explorer               |
| `expandDepth` | `number`                        | `2`        | Default depth to expand objects and arrays |
| `className`   | `string`                        | `''`       | Additional CSS class names                 |

### Store Data Format

Each store in the `stores` array should have the following format:

```ts
type StoreData = {
  name: string // Display name for the store
  store: StoreApi<unknown> // The Zustand store instance
  initialState: Record<string, unknown> // Initial state for reset functionality
}
```

## Features in Detail

### Time Travel Debugging

The "Enable Time Travel" button allows you to:

1. Record state changes as they occur
2. Navigate back and forth through state history
3. Reset to the initial state

### Search Functionality

The search box allows filtering the state tree by:

- Property keys (object keys)
- String values
- Number values

The tree will automatically expand to show matched properties.

## Example

See the `ZustandExplorerExample.tsx` file for a complete usage example with multiple stores.
