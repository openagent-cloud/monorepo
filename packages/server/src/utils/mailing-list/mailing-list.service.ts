import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../utils/prisma/prisma.service'
import { SubscribeDto } from './dto/subscribe.dto'

@Injectable()
export class MailingListService {
  constructor(private readonly prisma: PrismaService) {}

  async subscribe(subscribeDto: SubscribeDto) {
    const { email, metadata, source, tenantId } = subscribeDto

    // Use upsert to either create a new record or update an existing one
    // Make sure metadata is properly formatted as JSON or undefined
    const formattedMetadata = metadata || undefined

    const result = await this.prisma.mailing_list.upsert({
      where: { email, tenant_id: tenantId },
      update: {
        subscribed: true,
        updated_at: new Date(),
        metadata: formattedMetadata,
        source: source || 'website'
      },
      create: {
        email,
        metadata: formattedMetadata,
        source: source || 'website',
        subscribed: true,
        tenant: {
          connect: {
            id: tenantId
          }
        }
      }
    })

    return result
  }

  async unsubscribe(tenantId: number, email: string) {
    const result = await this.prisma.mailing_list.update({
      where: { email, tenant_id: tenantId },
      data: {
        subscribed: false,
        updated_at: new Date()
      }
    })

    return result
  }

  async getAllSubscribers(tenantId: number) {
    const subscribers = await this.prisma.mailing_list.findMany({
      where: { subscribed: true, tenant_id: tenantId },
      orderBy: { created_at: 'desc' }
    })

    return subscribers
  }
}
