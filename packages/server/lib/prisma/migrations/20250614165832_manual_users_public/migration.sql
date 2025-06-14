-- Function to sync user data to user_public
CREATE OR REPLACE FUNCTION sync_user_to_user_public() RETURNS TRIGGER AS $$
BEGIN
    -- For INSERT operations
    IF TG_OP = 'INSERT' THEN
        INSERT INTO "users_public" (
            id,
            avatar_url,
            bio,
            created_at,
            modules,
            name,
            public_key,
            role,
            updated_at,
            username,
            uuid
        ) VALUES (
            NEW.id,
            NEW.avatar_url,
            NEW.bio,
            NEW.created_at,
            NEW.modules,
            NEW.name,
            NEW.public_key,
            NEW.role,
            NEW.updated_at,
            NEW.username,
            NEW.uuid
        );
        RETURN NEW;
    
    -- For UPDATE operations
    ELSIF TG_OP = 'UPDATE' THEN
        -- Check if the user_public record exists
        IF EXISTS (SELECT 1 FROM "users_public" WHERE id = NEW.id) THEN
            UPDATE "users_public" SET
                avatar_url = NEW.avatar_url,
                bio = NEW.bio,
                modules = NEW.modules,
                name = NEW.name,
                public_key = NEW.public_key,
                role = NEW.role,
                updated_at = NEW.updated_at,
                username = NEW.username,
                uuid = NEW.uuid
            WHERE id = NEW.id;
        ELSE
            -- If no record exists (edge case), create one
            INSERT INTO "users_public" (
                id,
                avatar_url,
                bio,
                created_at,
                modules,
                name,
                public_key,
                role,
                updated_at,
                username,
                uuid
            ) VALUES (
                NEW.id,
                NEW.avatar_url,
                NEW.bio,
                NEW.created_at,
                NEW.modules,
                NEW.name,
                NEW.public_key,
                NEW.role,
                NEW.updated_at,
                NEW.username,
                NEW.uuid
            );
        END IF;
        RETURN NEW;
    
    -- For DELETE operations (optional - depends on if you want cascading deletes)
    ELSIF TG_OP = 'DELETE' THEN
        DELETE FROM "users_public" WHERE id = OLD.id;
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it already exists
DROP TRIGGER IF EXISTS user_sync_trigger ON "users";

-- Create the trigger on the user table
CREATE TRIGGER user_sync_trigger
AFTER INSERT OR UPDATE ON "users"
FOR EACH ROW
EXECUTE FUNCTION sync_user_to_user_public();

-- Initial sync of existing data
-- This will copy all existing user records to user_public if they don't exist there already
INSERT INTO "users_public" (
    id,
    avatar_url,
    bio,
    created_at,
    modules,
    name,
    public_key,
    role,
    updated_at,
    username,
    uuid
)
SELECT 
    u.id,
    u.avatar_url,
    u.bio,
    u.created_at,
    u.modules,
    u.name,
    u.public_key,
    u.role,
    u.updated_at,
    u.username,
    u.uuid
FROM "users" u
LEFT JOIN "users_public" up ON u.id = up.id
WHERE up.id IS NULL;
