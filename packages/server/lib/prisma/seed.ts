import { PrismaClient } from '@prisma/client'
import { getOrCreateSuperUser, getOrCreateTenant, getOrCreateCredential } from './seed-utils'
import * as dotenv from 'dotenv'
dotenv.config({})

// Initialize Prisma client
const prisma = new PrismaClient()

/**
 * Main seed function
 */
async function main() {
  console.log('🌱 Starting database seeding...')

  // Get environment variables using our utility
  const {
    SUPER_ADMIN_EMAIL = 'superadmin@localhost',
    SUPER_ADMIN_USERNAME = 'superadmin',
    SUPER_ADMIN_NAME = 'Super Admin',
    SUPER_ADMIN_PASSWORD = 'password',
    APP_NAME = 'Credential Store',
    APP_DESCRIPTION = 'Credential Store'
  } = process.env

  // Seed super admin user with environment variables
  const superAdmin = await getOrCreateSuperUser(
    prisma,
    SUPER_ADMIN_EMAIL!,
    SUPER_ADMIN_USERNAME!,
    SUPER_ADMIN_NAME!,
    SUPER_ADMIN_PASSWORD!
  )

  console.log('✅ Database seeding completed!')
}

// Execute the main function
main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
