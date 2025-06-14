## Content-Type Schemas

Each schema must export the following:

- A Zod schema definition (e.g., `CommentZodSchema`)
- A TypeScript type definition derived from the Zod schema (e.g., `CommentType`)
- The JSON schema object created via zodToJsonSchema (e.g., `CommentSchema`)
- The content-type object (e.g., `CommentContentType`), which contains both the name of the content-type and its schema
- Be sure to `export *` from the root `index.ts` file

### Advantages of Zod-based schemas

- Type safety with automatic type inference
- Runtime validation
- More expressive validation rules using `.refine()`
- Cleaner API for defining schemas
- Automatic conversion to JSON Schema via `zod-to-json-schema`
