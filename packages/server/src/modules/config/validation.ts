import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  POSTGRES_DB: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_PORT: z.coerce.number().default(5432),
  INTERNAL_DATABASE_URL: z.string(),
  ELECTRIC_PORT: z.coerce.number(),
  CADDY_PORT: z.coerce.number(),
  JWT_SECRET: z.string(),
  MAIL_FROM: z.string(),
  MAIL_HOST: z.string(),
  MAIL_PORT: z.coerce.number(),
  MAIL_USER: z.string(),
  MAIL_PASS: z.string(),
  SERVER_PORT: z.coerce.number(),
  APP_NAME: z.string(),
  APP_DESCRIPTION: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GITHUB_CALLBACK_URL: z.string(),
  S3_ACCESS_KEY: z.string(),
  S3_SECRET_KEY: z.string(),
  S3_BUCKET_NAME: z.string(),
  S3_REGION: z.string(),
  S3_ENDPOINT: z.string(),
  S3_CDN_URL: z.string(),
  CLIENT_URL: z.string(),
  CLIENT_PORT: z.coerce.number(),
  CORS_ORIGIN: z.string(),
  OPENAI_API_KEY: z.string(),
})

export type EnvVars = z.infer<typeof envSchema>

export function validateEnv(rawEnv: Record<string, unknown> = process.env): EnvVars {
  const parsed = envSchema.safeParse(rawEnv)
  if (!parsed.success) {
    // Print all validation errors
    console.error('❌ Invalid environment variables:', parsed.error.format())
    throw new Error('Invalid environment variables')
  }
  return parsed.data
} 