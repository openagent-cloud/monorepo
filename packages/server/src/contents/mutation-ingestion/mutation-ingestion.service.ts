import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../utils/prisma/prisma.service'
import { MutationDto } from './dto/mutation.dto'
import { v4 as uuidv4 } from 'uuid'
import { processContentMutation, processContentTypeMutation } from './processors'

@Injectable()
export class MutationIngestionService {
  constructor(private readonly prisma: PrismaService) {}

  async processMutations(mutations: MutationDto[], user?: any) {
    const txid = uuidv4()
    for (const mutation of mutations) {
      await this.processSingleMutation(mutation, user)
    }
    return { txid }
  }

  private async processSingleMutation(mutation: MutationDto, user?: any) {
    const { type, collection, key, value } = mutation

    // Handle based on collection type
    switch (collection) {
      case 'content':
        return processContentMutation(this.prisma, type, key, value, user)
      case 'content_type':
        return processContentTypeMutation(type, key, value)
      default:
        throw new Error(`Unknown collection: ${String(collection)}`)
    }
  }
}
