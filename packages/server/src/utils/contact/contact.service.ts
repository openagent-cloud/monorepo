import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../utils/prisma/prisma.service'
import { CreateContactDto } from './dto/create-contact.dto'
import { contact_message } from '@prisma/client'

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto) {
    const { name, email, message, category, metadata, tenantId } = createContactDto

    const result = await this.prisma.contact_message.create({
      data: {
        name,
        email,
        message,
        category: category || null,
        metadata: metadata || {},
        status: 'new',
        tenant: {
          connect: {
            id: tenantId
          }
        }
      }
    })

    return result
  }

  async findAll(tenantId: number, optionalCategory?: string) {
    let messages: contact_message[]
    if (!optionalCategory) {
      messages = await this.prisma.contact_message.findMany({
        where: { tenant_id: tenantId },
        orderBy: { created_at: 'desc' }
      })
    } else {
      messages = await this.prisma.contact_message.findMany({
        where: { AND: [{ tenant_id: tenantId }, { category: optionalCategory }] },
        orderBy: { created_at: 'desc' }
      })
    }
    return messages
  }

  async findOne(tenantId: number, id: number) {
    const message = await this.prisma.contact_message.findUnique({
      where: { id, tenant_id: tenantId }
    })

    return message
  }

  async updateStatus(tenantId: number, id: number, status: string) {
    const result = await this.prisma.contact_message.update({
      where: { id, tenant_id: tenantId },
      data: {
        status
      }
    })

    return result
  }
}
