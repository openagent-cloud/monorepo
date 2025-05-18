import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

async function main() {
  // First check if we already have a default tenant
  const existingTenant = await prisma.tenant.findFirst({
    where: { name: 'default' }
  })

  let tenant
  
  if (existingTenant) {
    // If it exists, just return it
    tenant = existingTenant
  } else {
    // Otherwise create a new one
    const apiKey = randomUUID()
    tenant = await prisma.tenant.create({
      data: {
        name: 'default',
        apiKey,
      }
    })
  }

  console.log('Seeded tenant')
  console.log('API Key:', tenant.apiKey)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
