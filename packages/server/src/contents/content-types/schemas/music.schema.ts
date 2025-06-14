import { JSONSchemaType } from 'ajv'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { ContentType } from './content.schema'

const BaseMusic = z.object({
	kind: z.string(),
	artist: z.string(),
	album: z.string(),
	duration: z.number(),
	releaseDate: z.string(),
})

const SelfHostSchema = BaseMusic.extend({
	kind: z.literal('selfhost'),
	url: z.object({
		url: z.string(),
		isMembersOnly: z.boolean(),
	}),
})

const SpotifySchema = BaseMusic.extend({
	kind: z.literal('spotify'),
	spotify: z.object({
		spotifyId: z.string(),
	}),
})

const SoundCloudSchema = BaseMusic.extend({
	kind: z.literal('soundcloud'),
	soundcloud: z.object({
		soundcloudUser: z.string(),
		soundcloudTrackId: z.string(),
	}),
})

const YouTubeSchema = BaseMusic.extend({
	kind: z.literal('youtube'),
	youtube: z.object({
		youtubeId: z.string(),
	}),
})

export const MusicZodSchema = z.union([
	SelfHostSchema,
	SpotifySchema,
	SoundCloudSchema,
	YouTubeSchema,
])

export type MusicType = z.infer<typeof MusicZodSchema>

export const MusicSchema = zodToJsonSchema(MusicZodSchema, 'music')

export const MusicContentType: ContentType = {
	name: 'music',
	schema: MusicSchema as unknown as JSONSchemaType<any>,
}
