import { PrismaClient, module } from '@prisma/client'
import { randomUUID } from 'crypto'

export async function getOrCreateTenant(prisma: PrismaClient, name: string) {
  const existingTenant = await prisma.tenant.findFirst({
    where: { name }
  })

  if (existingTenant) {
    return existingTenant
  }

  const api_key = `tnnt_${randomUUID()}`
  return prisma.tenant.create({
    data: {
      name,
      api_key,
      modules: [
        module.content,
        module.ai_agent,
        module.ai_proxy,
        module.flows,
        module.contact,
        module.mailing_list,
        module.users
      ]
    }
  })
}