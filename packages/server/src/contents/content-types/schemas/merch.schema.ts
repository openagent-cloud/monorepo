import { JSONSchemaType } from 'ajv'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { ContentType } from './content.schema'

const BaseMerch = z.object({
	kind: z.string(),
	image: z.string(),
	inStock: z.boolean(),
	url: z.string(),

	category: z
		.enum(['apparel', 'vinyl', 'digital', 'accessory', 'other'])
		.optional(),
})

const ShopifyMerch = BaseMerch.extend({
	kind: z.literal('shopify'),
	shopifyProductId: z.string(),
	shopifyVariantId: z.string(),
})

const StripeMerch = BaseMerch.extend({
	kind: z.literal('stripe'),
	price: z.number(),
	stripeProductId: z.string(),
})

export const MerchZodSchema = z.union([ShopifyMerch, StripeMerch])

export type MerchType = z.infer<typeof MerchZodSchema>

export const MerchSchema = zodToJsonSchema(MerchZodSchema, 'merch')

export const MerchContentType: ContentType = {
	name: 'merch',
	schema: MerchSchema as unknown as JSONSchemaType<any>,
}
