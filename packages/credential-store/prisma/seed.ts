import { PrismaClient, AdapterType } from '@prisma/client'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

async function getOrCreateTenant(name: string) {
  const existingTenant = await prisma.tenant.findFirst({
    where: { name }
  })

  if (existingTenant) {
    return existingTenant
  }

  const apiKey = `tnnt_${randomUUID()}`
  return prisma.tenant.create({
    data: {
      name,
      apiKey,
    }
  })
}

async function getOrCreateCredential(tenantId: string, service: AdapterType, key: string) {
  const existingCredential = await prisma.credential.findFirst({
    where: {
      tenantId,
      service
    }
  })

  if (existingCredential) {
    return existingCredential
  }

  return prisma.credential.create({
    data: {
      tenantId,
      service,
      encryptedKey: key, // In production this should be encrypted
      meta: {}
    }
  })
}

async function main() {
  // Get or create default tenant
  const tenant = await getOrCreateTenant('default')
  console.log('Tenant ready:', tenant.name)
  console.log('API Key:', tenant.apiKey)

  // Get or create a test OpenAI credential
  const credential = await getOrCreateCredential(tenant.id, 'openai', 'sk-test-key')
  console.log('Credential ready:', credential.service)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
