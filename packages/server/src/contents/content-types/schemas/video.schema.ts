import { JSONSchemaType } from 'ajv'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { ContentType } from './content.schema'

const BaseVideo = z.object({
	kind: z.string(),
	duration: z.number(),
	releaseDate: z.string(),
	thumbnailUrl: z.string().optional(),
})

const SelfHostedVideo = BaseVideo.extend({
	kind: z.literal('selfhost'),
	url: z.string(),
})

const YouTubeVideo = BaseVideo.extend({
	kind: z.literal('youtube'),
	youtubeId: z.string(),
})

const VimeoVideo = BaseVideo.extend({
	kind: z.literal('vimeo'),
	vimeoId: z.string(),
})

const XVideo = BaseVideo.extend({
	kind: z.literal('x'),
	xId: z.string(),
})

const InstagramVideo = BaseVideo.extend({
	kind: z.literal('instagram'),
	instagramId: z.string(),
})

export const VideoZodSchema = z.union([
	SelfHostedVideo,
	YouTubeVideo,
	VimeoVideo,
	XVideo,
	InstagramVideo,
])

export type VideoType = z.infer<typeof VideoZodSchema>

export const VideoSchema = zodToJsonSchema(VideoZodSchema, 'video')

export const VideoContentType: ContentType = {
	name: 'video',
	schema: VideoSchema as unknown as JSONSchemaType<any>,
}
