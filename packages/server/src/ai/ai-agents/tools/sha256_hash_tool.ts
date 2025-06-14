import { z } from 'zod'
import { tool } from '@openai/agents'
import * as crypto from 'crypto'

const sha256_hash_tool = tool({
  name: 'sha256_hash_tool',
  description: 'Generate a SHA-256 hash of the provided string',
  parameters: z.object({
    input: z
      .union([
        z.string().describe('The string to hash'),
        z.instanceof(Buffer).describe('Binary data to hash'),
        z.instanceof(Uint8Array).describe('Binary data to hash')
      ])
      .describe('The data to hash')
  }),
  execute: async ({ input }) => {
    return crypto.createHash('sha256').update(input).digest('hex')
  }
})

export default sha256_hash_tool
