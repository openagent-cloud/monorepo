# PGlite WASM Abort Error Troubleshooting Guide

## The Problem

When using the PGlite library (from ElectricSQL), you may encounter a mysterious WebAssembly abort error:

```
Aborted(). Build with -sASSERTIONS for more info.
    at __abort_js (http://localhost:5850/@fs/app/node_modules/@electric-sql/pglite/dist/index.js)
    at pglite.wasm:wasm-function[15312]:0x73d190
    // ...more stack trace...
    at Module._pgl_backend
```

This error is typically caused by memory corruption or mishandling of data structures within the WebAssembly module that powers PGlite.

## Common Causes

1. **Type Mismatches**: Accessing properties on undefined or null objects returned from queries
2. **Race Conditions**: Using query results before they're fully loaded
3. **Concurrent Access**: Multiple simultaneous queries overwhelming the database
4. **Invalid Data Processing**: Processing query results incorrectly
5. **React Rendering Issues**: Directly using query results in render without proper null checks

## The Fix: Defensive Programming

To prevent these WASM errors, implement robust defensive programming patterns:

### 1. Use State Management Instead of Direct Rendering

```typescript
// BAD: Direct usage in render
const results = useLiveQuery('SELECT * FROM table')
return <div>{results[0].value}</div> // Might crash!

// GOOD: Process via useEffect with error handling
const [data, setData] = useState([])
const results = useLiveQuery('SELECT * FROM table')

useEffect(() => {
  try {
    if (results && Array.isArray(results)) {
      setData(results)
    } else if (results?.rows && Array.isArray(results.rows)) {
      setData(results.rows)
    }
  } catch (err) {
    console.error('Error processing query results:', err)
    setData([])
  }
}, [results])
```

### 2. Add Comprehensive Null Checks

Always check if objects exist before accessing their properties:

```typescript
// Instead of: results[0].name
// Use: results && results[0] && results[0].name
// Or with optional chaining: results?.[0]?.name
```

### 3. Handle Both Result Formats

PGlite may return results in different formats depending on the context:

```typescript
// Handle both array results and object with rows property
const items = Array.isArray(results) ? results : results?.rows || []
```

### 4. Wrap Functions in try/catch

Add try/catch blocks to prevent crashes in utility functions:

```typescript
const processUser = (user) => {
  try {
    return `${user.firstName} ${user.lastName}`
  } catch (err) {
    console.error('Error processing user:', err)
    return 'Unknown User'
  }
}
```

### 5. Use Conditional Hook Calls Properly

React Hooks must be called in the same order on every render. Instead of conditionally calling `useLiveQuery`, use the query unconditionally but process the results conditionally:

```typescript
// Instead of:
const comments = isSelected ? useLiveQuery(...) : null

// Do this:
const comments = useLiveQuery(
  isSelected ? 'SELECT * FROM comments WHERE blog_id = $1' : 'SELECT 1',
  isSelected ? [blogId] : []
)
```

## Prevention Checklist

- [ ] Always wrap data processing in try/catch blocks
- [ ] Implement proper null checking
- [ ] Use useEffect to safely process query results
- [ ] Have fallback values for all operations
- [ ] Monitor console for PGlite warnings
- [ ] Verify database operations with small test cases first

## For Developers

If you need to debug deeper, you can rebuild PGlite with assertions enabled:

```
emcc -sASSERTIONS=1 ...other-flags...
```

This will provide more detailed error messages when WASM aborts occur.

---

Remember: When working with WebAssembly modules like PGlite, defensive programming is essential since runtime errors often lack detailed information about what went wrong.
