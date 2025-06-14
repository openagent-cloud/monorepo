import { PrismaClient, adapter_type } from '@prisma/client'

export async function getOrCreateCredential(prisma: PrismaClient, tenant_id: number, service: adapter_type, key: string) {
  const existingCredential = await prisma.credential.findFirst({
    where: {
      tenant_id,
      service
    }
  })

  if (existingCredential) {
    return existingCredential
  }

  return prisma.credential.create({
    data: {
      tenant_id,
      service,
      encrypted_key: key, // TODO: In production this should be encrypted
      meta: {}
    }
  })
}
