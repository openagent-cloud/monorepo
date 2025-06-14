import { JSONSchemaType } from 'ajv'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { ContentType } from './content.schema'

const BasePress = z.object({
	kind: z.string(),
	date: z.string(),
	image: z.string().optional(),
})

const SelfPress = BasePress.extend({
	kind: z.literal('self'),
	content: z.string(),
})

const ExternalPress = BasePress.extend({
	kind: z.literal('external'),
	source: z.string(),
	url: z.string(),
})

export const PressZodSchema = z.union([SelfPress, ExternalPress])

export type PressType = z.infer<typeof PressZodSchema>

export const PressSchema = zodToJsonSchema(PressZodSchema, 'press')

export const PressContentType: ContentType = {
	name: 'press',
	schema: PressSchema as unknown as JSONSchemaType<any>,
}
