-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create function to update reaction counts and conversation counts when reactions, comments, or replies are added, updated, or deleted
CREATE OR REPLACE FUNCTION update_reaction_counts()
RETURNS TRIGGER AS $$
DECLARE
  content_id_val INT;
  is_reaction_type BOOLEAN := false;
  is_comment_type BOOLEAN := false;
BEGIN
  -- Determine which content_id we're dealing with
  IF TG_OP = 'DELETE' THEN
    content_id_val := OLD.parent_id;
  ELSE
    content_id_val := NEW.parent_id;
  END IF;

  -- Handle new top-level content (create reaction count record)
  IF TG_OP = 'INSERT' AND NEW.parent_id IS NULL THEN
    INSERT INTO content_reaction_counts 
        (content_id, upvote_count, downvote_count, emoji_count, 
         comment_count, reply_count, conversation_count, total_count, emoji_breakdown)
    VALUES 
        (NEW.id, 0, 0, 0, 0, 0, 0, 0, '{}'::jsonb)
    ON CONFLICT (content_id) DO NOTHING;
    RETURN NULL; -- New content has no reactions/comments yet
  END IF;

  -- Create reaction count record for ALL new content - every content can be reacted to
  -- In this unified system, any content type can have children of any type
  IF TG_OP = 'INSERT' THEN
    INSERT INTO content_reaction_counts 
        (content_id, upvote_count, downvote_count, emoji_count, 
         comment_count, reply_count, conversation_count, total_count, emoji_breakdown)
    VALUES 
        (NEW.id, 0, 0, 0, 0, 0, 0, 0, '{}'::jsonb)
    ON CONFLICT (content_id) DO NOTHING;
  END IF;

  -- If no parent_id, this is not a reaction/comment
  IF content_id_val IS NULL THEN
    RETURN NULL;
  END IF;

  -- Check if this is a reaction or comment
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    SELECT ct.name = 'reaction' INTO is_reaction_type
    FROM content_type ct WHERE ct.id = NEW.content_type_id;
    
    SELECT ct.name = 'comment' INTO is_comment_type  
    FROM content_type ct WHERE ct.id = NEW.content_type_id;
  ELSIF TG_OP = 'DELETE' THEN
    SELECT ct.name = 'reaction' INTO is_reaction_type
    FROM content_type ct WHERE ct.id = OLD.content_type_id;
    
    SELECT ct.name = 'comment' INTO is_comment_type
    FROM content_type ct WHERE ct.id = OLD.content_type_id;
  END IF;

  IF NOT (is_reaction_type OR is_comment_type) THEN
    RETURN NULL;
  END IF;
  
  -- Ensure reaction count record exists for the target content
  INSERT INTO content_reaction_counts (
    content_id, upvote_count, downvote_count, emoji_count, 
    comment_count, reply_count, conversation_count, 
    total_count, emoji_breakdown
  )
  VALUES (content_id_val, 0, 0, 0, 0, 0, 0, 0, '{}')
  ON CONFLICT (content_id) DO NOTHING;

  -- Recalculate all counts for the target content
  UPDATE content_reaction_counts crc
  SET 
    upvote_count = COALESCE((SELECT COUNT(*) FROM content WHERE parent_id = crc.content_id AND content_type_id IN (SELECT id FROM content_type WHERE name = 'reaction') AND metadata->>'kind' = 'upvote'), 0),
    downvote_count = COALESCE((SELECT COUNT(*) FROM content WHERE parent_id = crc.content_id AND content_type_id IN (SELECT id FROM content_type WHERE name = 'reaction') AND metadata->>'kind' = 'downvote'), 0),
    emoji_count = COALESCE((SELECT COUNT(*) FROM content WHERE parent_id = crc.content_id AND content_type_id IN (SELECT id FROM content_type WHERE name = 'reaction') AND metadata->>'kind' = 'emoji'), 0),
    emoji_breakdown = COALESCE((
        SELECT jsonb_object_agg(data.emoji, data.count_per_emoji) 
        FROM (
            SELECT metadata->>'emoji' AS emoji, COUNT(*) as count_per_emoji
            FROM content
            WHERE parent_id = crc.content_id
              AND content_type_id IN (SELECT id FROM content_type WHERE name = 'reaction')
              AND metadata->>'kind' = 'emoji' AND metadata->>'emoji' IS NOT NULL
            GROUP BY metadata->>'emoji'
        ) AS data
    ), '{}'::jsonb),
    comment_count = COALESCE((SELECT COUNT(*) FROM content WHERE parent_id = crc.content_id AND content_type_id IN (SELECT id FROM content_type WHERE name = 'comment')), 0),
    reply_count = COALESCE((
      SELECT COUNT(*)
      FROM content reply
      JOIN content comment ON reply.parent_id = comment.id
      WHERE comment.parent_id = crc.content_id
        AND reply.content_type_id IN (SELECT id FROM content_type WHERE name = 'comment')
        AND comment.content_type_id IN (SELECT id FROM content_type WHERE name = 'comment')
    ), 0),
    updated_at = NOW()
  WHERE crc.content_id = content_id_val;

  -- Update total counts
  UPDATE content_reaction_counts 
  SET 
    total_count = upvote_count + downvote_count + emoji_count,
    conversation_count = comment_count + reply_count
  WHERE content_id = content_id_val;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger on the content table
DROP TRIGGER IF EXISTS content_reaction_trigger ON content;
CREATE TRIGGER content_reaction_trigger
AFTER INSERT OR UPDATE OR DELETE ON content
FOR EACH ROW
EXECUTE FUNCTION update_reaction_counts();

-- Initial population of the counts table (run once after table and trigger function are created)
-- First, clear existing reaction counts table to ensure we create fresh records for all content
TRUNCATE content_reaction_counts;

-- Create reaction count records for ALL content items
-- Fixed version that properly handles all content regardless of whether they have reactions
INSERT INTO content_reaction_counts (
  content_id, upvote_count, downvote_count, emoji_count, 
  comment_count, reply_count, conversation_count, 
  total_count, emoji_breakdown, updated_at
)
SELECT 
  c.id AS content_id,
  -- Calculate reaction counts using subqueries to avoid LEFT JOIN issues
  COALESCE((SELECT COUNT(*) FROM content r WHERE r.parent_id = c.id AND r.content_type_id IN (SELECT id FROM content_type WHERE name = 'reaction') AND r.metadata->>'kind' = 'upvote'), 0) AS upvote_count,
  COALESCE((SELECT COUNT(*) FROM content r WHERE r.parent_id = c.id AND r.content_type_id IN (SELECT id FROM content_type WHERE name = 'reaction') AND r.metadata->>'kind' = 'downvote'), 0) AS downvote_count,
  COALESCE((SELECT COUNT(*) FROM content r WHERE r.parent_id = c.id AND r.content_type_id IN (SELECT id FROM content_type WHERE name = 'reaction') AND r.metadata->>'kind' = 'emoji'), 0) AS emoji_count,
  
  -- Calculate comment counts
  COALESCE((SELECT COUNT(*) FROM content cmnt WHERE cmnt.parent_id = c.id AND cmnt.content_type_id IN (SELECT id FROM content_type WHERE name = 'comment')), 0) AS comment_count,
  
  -- Calculate reply counts
  COALESCE((
    SELECT COUNT(*)
    FROM content reply
    JOIN content comment ON reply.parent_id = comment.id
    WHERE comment.parent_id = c.id
      AND reply.content_type_id IN (SELECT id FROM content_type WHERE name = 'comment')
      AND comment.content_type_id IN (SELECT id FROM content_type WHERE name = 'comment')
  ), 0) AS reply_count,
  
  -- Total conversation count
  (COALESCE((SELECT COUNT(*) FROM content cmnt WHERE cmnt.parent_id = c.id AND cmnt.content_type_id IN (SELECT id FROM content_type WHERE name = 'comment')), 0) + 
  COALESCE((
    SELECT COUNT(*)
    FROM content reply
    JOIN content comment ON reply.parent_id = comment.id
    WHERE comment.parent_id = c.id
      AND reply.content_type_id IN (SELECT id FROM content_type WHERE name = 'comment')
      AND comment.content_type_id IN (SELECT id FROM content_type WHERE name = 'comment')
  ), 0)) AS conversation_count,
  
  -- Calculate total reaction count
  COALESCE((SELECT COUNT(*) FROM content r WHERE r.parent_id = c.id AND r.content_type_id IN (SELECT id FROM content_type WHERE name = 'reaction')), 0) AS total_count,
  
  -- Calculate emoji breakdown
  COALESCE(
    (SELECT jsonb_object_agg(emoji_data.emoji, emoji_data.count_per_emoji)
     FROM (
       SELECT 
         r_emoji.metadata->>'emoji' AS emoji, 
         COUNT(*) AS count_per_emoji
       FROM content r_emoji
       WHERE r_emoji.parent_id = c.id
         AND r_emoji.content_type_id IN (SELECT id FROM content_type WHERE name = 'reaction')
         AND r_emoji.metadata->>'kind' = 'emoji'
         AND r_emoji.metadata->>'emoji' IS NOT NULL
       GROUP BY r_emoji.metadata->>'emoji'
     ) AS emoji_data
    ), '{}'::jsonb
  ) AS emoji_breakdown,
  
  NOW() AS updated_at
FROM content c;

-- Create a unique constraint on content_id
CREATE UNIQUE INDEX IF NOT EXISTS "content_reaction_counts_content_id_key" ON "content_reaction_counts"("content_id");
