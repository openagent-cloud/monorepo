import axios from 'axios'
import { Response } from 'express'
import { adapter_type } from '@prisma/client'
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../utils/prisma/prisma.service'
import { ConfigService } from '../../utils/config/config.service'
import { safeDecrypt } from '../../utils/encryption/encryption.util'
import { UsageStats } from '../../utils/types/models.types'

@Injectable()
export class ProxyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Get the API endpoint for a given adapter
   */
  private getEndpointForAdapter(adapter: adapter_type): string {
    switch (adapter) {
      case adapter_type.openai:
        return 'https://api.openai.com/v1/chat/completions'
      case adapter_type.anthropic:
        return 'https://api.anthropic.com/v1/messages'
      case adapter_type.cohere:
        return 'https://api.cohere.ai/v1/generate'
      default:
        throw new BadRequestException(`Unsupported adapter: ${adapter}`)
    }
  }

  /**
   * Handle a proxy request to an AI service
   * @param adapter The adapter/service to use
   * @param api_key The tenant's API key
   * @param payload The request payload to send to the AI service
   * @returns The response from the AI service
   */
  async handleProxyRequest(adapter: string, api_key: string, payload: Record<string, any>) {
    // Convert string to adapter_type enum
    let adapter_type: adapter_type
    try {
      adapter_type = this.toAdapterType(adapter)
    } catch (error) {
      throw new BadRequestException(`Unsupported adapter: ${adapter}`)
    }

    // Find the tenant
    const tenant = await this.prisma.tenant.findUnique({ where: { api_key } })
    if (!tenant) {
      throw new UnauthorizedException('Invalid API key')
    }

    // Find the credential
    const credential = await this.prisma.credential.findFirst({
      where: {
        tenant_id: tenant.id,
        service: adapter_type['openai']
      }
    })

    if (!credential) {
      throw new UnauthorizedException(`No credentials found for ${adapter}`)
    }

    // Decrypt the credential using our safe helper
    const decryptedKey = safeDecrypt(credential.encrypted_key, this.configService.encryptionKey)

    // Get the endpoint for this adapter
    const url = this.getEndpointForAdapter(adapter_type)

    // Make the request to the AI service
    const start = Date.now()
    try {
      const res = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${decryptedKey}`,
          'Content-Type': 'application/json'
        }
      })
      const duration = Date.now() - start

      // Extract token usage and other metadata
      const tokenUsage = res.data.usage || {}
      const model = res.data.model || payload.model || null
      const metadata: Record<string, any> = {}

      // Collect additional metadata based on the adapter
      if (adapter_type === adapter_type['openai']) {
        // OpenAI specific metadata
        if (res.data.system_fingerprint) metadata.system_fingerprint = res.data.system_fingerprint
        if (res.data.id) metadata.response_id = res.data.id
      } else if (adapter_type === adapter_type['anthropic']) {
        // Anthropic specific metadata
        if (res.data.stop_reason) metadata.stop_reason = res.data.stop_reason
        if (res.data.stop_sequence) metadata.stop_sequence = res.data.stop_sequence
      } else if (adapter_type === adapter_type['cohere']) {
        // Cohere specific metadata
        if (res.data.meta) metadata.meta = res.data.meta
      }

      // Log the request with token usage and metadata
      await this.prisma.proxy_request.create({
        data: {
          tenant_id: tenant.id,
          service: adapter_type,
          endpoint: url,
          status: res.status,
          response_ms: duration,
          prompt_tokens: tokenUsage.prompt_tokens || null,
          completion_tokens: tokenUsage.completion_tokens || null,
          total_tokens: tokenUsage.total_tokens || null,
          model,
          metadata: Object.keys(metadata).length > 0 ? metadata : undefined
        }
      })

      return res.data
    } catch (error) {
      const duration = Date.now() - start

      // Log the failed request
      await this.prisma.proxy_request.create({
        data: {
          tenant_id: tenant.id,
          service: adapter_type,
          endpoint: url,
          status: error.response?.status || 500,
          response_ms: duration
        }
      })

      // Rethrow the error
      throw error
    }
  }

  /**
   * Handle a streaming proxy request to an AI service
   * @param adapter The adapter/service to use
   * @param api_key The tenant's API key
   * @param payload The request payload to send to the AI service
   * @param response The Express response object to stream the response to
   */
  async handleStreamingProxyRequest(
    adapter: string,
    api_key: string,
    payload: Record<string, any>,
    response: Response
  ): Promise<void> {
    // Convert string to adapter_type enum
    let adapter_type: adapter_type
    try {
      adapter_type = this.toAdapterType(adapter)
    } catch (error) {
      throw new BadRequestException(`Unsupported adapter: ${adapter}`)
    }

    // Find the tenant
    const tenant = await this.prisma.tenant.findUnique({ where: { api_key } })
    if (!tenant) {
      throw new UnauthorizedException('Invalid API key')
    }

    // Find the credential
    const credential = await this.prisma.credential.findFirst({
      where: {
        tenant_id: tenant.id,
        service: adapter_type['openai']
      }
    })

    if (!credential) {
      throw new UnauthorizedException(`No credentials found for ${adapter}`)
    }

    // Decrypt the credential using our safe helper
    const decryptedKey = safeDecrypt(credential.encrypted_key, this.configService.encryptionKey)

    // Get the endpoint for this adapter
    const url = this.getEndpointForAdapter(adapter_type)

    // Make sure streaming is enabled in the payload
    payload.stream = true

    // Make the request to the AI service
    const start = Date.now()
    let tokenCount = 0
    const metadata: Record<string, any> = {}

    try {
      // Set up the streaming response
      response.setHeader('Content-Type', 'text/event-stream')
      response.setHeader('Cache-Control', 'no-cache')
      response.setHeader('Connection', 'keep-alive')

      // Make the request to the AI service
      const axiosResponse = await axios({
        method: 'post',
        url,
        data: payload,
        headers: {
          Authorization: `Bearer ${decryptedKey}`,
          'Content-Type': 'application/json',
          Accept: 'text/event-stream'
        },
        responseType: 'stream'
      })

      // Stream the response to the client
      axiosResponse.data.on('data', (chunk: Buffer) => {
        const chunkStr = chunk.toString()

        // Parse the chunk
        const lines = chunkStr.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)

            // Check if it's the [DONE] message
            if (data.trim() === '[DONE]') {
              response.write('data: [DONE]\n\n')
              return
            }

            try {
              const parsed = JSON.parse(data)

              // Count tokens
              if (
                parsed.choices &&
                parsed.choices[0] &&
                parsed.choices[0].delta &&
                parsed.choices[0].delta.content
              ) {
                tokenCount += parsed.choices[0].delta.content.length / 4 // Rough estimate
              }

              // Collect metadata
              if (adapter_type === adapter_type['openai']) {
                if (parsed.model && !metadata.model) metadata.model = parsed.model
                if (parsed.system_fingerprint)
                  metadata.system_fingerprint = parsed.system_fingerprint
                if (parsed.id && !metadata.response_id) metadata.response_id = parsed.id
              }

              // Forward the chunk to the client
              response.write(`data: ${data}\n\n`)
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      })

      // When the stream ends, log the request
      axiosResponse.data.on('end', async () => {
        const duration = Date.now() - start
        const model = metadata.model || payload.model || null

        await this.prisma.proxy_request.create({
          data: {
            tenant_id: tenant.id,
            service: adapter_type,
            endpoint: `${url} (streaming)`,
            status: axiosResponse.status,
            response_ms: duration,
            completion_tokens: tokenCount > 0 ? tokenCount : null,
            model,
            metadata: Object.keys(metadata).length > 0 ? metadata : undefined
          }
        })
      })

      // Handle stream errors
      axiosResponse.data.on('error', async (error: Error) => {
        const duration = Date.now() - start
        // Log the failed request
        await this.prisma.proxy_request.create({
          data: {
            tenant_id: tenant.id,
            service: adapter_type,
            endpoint: `${url} (streaming)`,
            status: 500,
            response_ms: duration
          }
        })
        // End the response
        if (!response.headersSent) {
          response.status(500).end()
        }
      })
    } catch (error) {
      // Handle errors in setting up the stream
      const duration = Date.now() - start
      await this.prisma.proxy_request.create({
        data: {
          tenant_id: tenant.id,
          service: adapter_type,
          endpoint: `${url} (streaming)`,
          status: error.response?.status || 500,
          response_ms: duration
        }
      })

      // Send error response if headers haven't been sent yet
      if (!response.headersSent) {
        response.status(error.response?.status || 500).json({
          error: error.message,
          details: error.response?.data || 'Unknown error'
        })
      }
    }
  }

  /**
   * Get usage statistics for a tenant
   * @param api_key The tenant's API key
   * @returns Usage statistics
   */
  async getUsageStats(api_key: string): Promise<UsageStats> {
    // Find the tenant
    const tenant = await this.prisma.tenant.findUnique({ where: { api_key } })
    if (!tenant) {
      throw new UnauthorizedException('Invalid API key')
    }

    // Get all proxy requests for this tenant
    const requests = await this.prisma.proxy_request.findMany({
      where: {
        tenant_id: tenant.id
      }
    })

    // Calculate statistics
    const totalRequests = requests.length
    const successfulRequests = requests.filter((r) => r.status >= 200 && r.status < 300).length
    const failedRequests = totalRequests - successfulRequests
    const avgResponseTime =
      requests.reduce((sum, r) => sum + r.response_ms, 0) / (totalRequests || 1)

    // Calculate token usage
    const totalTokens = requests.reduce((sum, r) => sum + (r.total_tokens || 0), 0)
    const promptTokens = requests.reduce((sum, r) => sum + (r.prompt_tokens || 0), 0)
    const completionTokens = requests.reduce((sum, r) => sum + (r.completion_tokens || 0), 0)

    // Get unique models used
    const models = [...new Set(requests.filter((r) => r.model).map((r) => r.model as string))]

    // Group by service
    const byService = Object.values(adapter_type).reduce(
      (acc, service) => {
        // Convert enum value to string for comparison with database values
        const serviceValue = service
        const serviceRequests = requests.filter((r) => r.service === serviceValue)
        acc[service] = {
          total: serviceRequests.length,
          successful: serviceRequests.filter((r) => r.status >= 200 && r.status < 300).length,
          avgResponseTime:
            serviceRequests.reduce((sum, r) => sum + r.response_ms, 0) /
            (serviceRequests.length || 1),
          totalTokens: serviceRequests.reduce((sum, r) => sum + (r.total_tokens || 0), 0),
          promptTokens: serviceRequests.reduce((sum, r) => sum + (r.prompt_tokens || 0), 0),
          completionTokens: serviceRequests.reduce((sum, r) => sum + (r.completion_tokens || 0), 0),
          models: [...new Set(serviceRequests.filter((r) => r.model).map((r) => r.model as string))]
        }
        return acc
      },
      {} as Record<string, any>
    )

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      avgResponseTime: Math.round(avgResponseTime),
      totalTokens,
      promptTokens,
      completionTokens,
      models,
      byService
    }
  }

  /**
   * Converts a string adapter name to our adapter_type enum
   * Useful when receiving adapter names from external sources like API requests
   */
  toAdapterType(adapterName: string): adapter_type {
    // Check if adapterName is defined and not empty
    if (!adapterName) {
      throw new Error('Adapter name is required')
    }

    // Convert to lowercase and try to match with our enum values
    const normalizedName = adapterName.toLowerCase()
    switch (normalizedName) {
      case 'openai':
        return adapter_type.openai
      case 'anthropic':
        return adapter_type.anthropic
      case 'cohere':
        return adapter_type.cohere
      default:
        throw new Error(`Unsupported adapter: ${adapterName}`)
    }
  }
}
