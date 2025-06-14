import { JSONSchemaType } from 'ajv'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { ContentType } from './content.schema'

const BaseComment = z.object({
	kind: z.string(),
})

const TextComment = BaseComment.extend({
	kind: z.literal('text'),
})

const ImageComment = BaseComment.extend({
	kind: z.literal('image'),
	imageUrl: z.string(),
})

const EmbedComment = BaseComment.extend({
	kind: z.literal('embed'),
	embedUrl: z.string(),
	description: z.string().optional(),
})

const ReplyComment = BaseComment.extend({
	kind: z.literal('reply'),
})

export const CommentZodSchema = z.union([
	TextComment,
	ImageComment,
	EmbedComment,
	ReplyComment,
])

export type CommentType = z.infer<typeof CommentZodSchema>

export const CommentSchema = zodToJsonSchema(CommentZodSchema, 'comment')

export const CommentContentType: ContentType = {
	name: 'comment',
	schema: CommentSchema as unknown as JSONSchemaType<any>,
}
