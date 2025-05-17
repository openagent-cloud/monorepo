-- Initialize the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Set a custom dimension setting if needed
-- ALTER DATABASE "rend" SET vector.dim = 1536;
-- The above line is commented out because Prisma will handle the dimension (1536) in the schema
-- But you can uncomment it if you prefer to set it at the database level

-- Grant permissions to the user
-- Note: We can't use environment variables here, so we'll use a more generic approach
ALTER SYSTEM SET wal_level = logical;
