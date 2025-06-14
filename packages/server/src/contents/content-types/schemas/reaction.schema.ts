import { JSONSchemaType } from 'ajv'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { ContentType } from './content.schema'

const BaseReaction = z.object({
	kind: z.string(),
})

const EmojiReaction = BaseReaction.extend({
	kind: z.literal('emoji'),
	emoji: z.string(),
})

const UpvoteReaction = BaseReaction.extend({
	kind: z.literal('upvote'),
})

const DownvoteReaction = BaseReaction.extend({
	kind: z.literal('downvote'),
})

export const ReactionZodSchema = z.union([
	EmojiReaction,
	UpvoteReaction,
	DownvoteReaction,
])

export type ReactionType = z.infer<typeof ReactionZodSchema>

export const ReactionSchema = zodToJsonSchema(ReactionZodSchema, 'reaction')

export const ReactionContentType: ContentType = {
	name: 'reaction',
	schema: ReactionSchema as unknown as JSONSchemaType<any>,
}
