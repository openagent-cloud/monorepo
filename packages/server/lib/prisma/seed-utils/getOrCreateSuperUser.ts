// prisma/seed/createSuperUser.ts
import { adapter_type, PrismaClient, user_role, module } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import { getOrCreateTenant } from './getOrCreateTenant'
import { getOrCreateCredential } from './getOrCreateCredential'
// Environment variables should be loaded in the main seed file

/**
 * Create or update the super admin user
 *
 * @param prisma - Prisma client instance
 * @param email - Super admin email
 * @param username - Super admin username
 * @param name - Super admin name
 * @param password - Super admin password (will be hashed)
 * @returns The created or updated super admin user
 */
export async function getOrCreateSuperUser(
  prisma: InstanceType<typeof PrismaClient>,
  email: string,
  username: string,
  name: string,
  password: string
) {
  // Check if the super admin already exists
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log('🛡️  Super admin already exists, skipping.')
    return existing
  }

  // Hash the password
  const hashed = await bcrypt.hash(password, 10)

  // Create a tenant for the super admin
  const tenant = await getOrCreateTenant(prisma, 'Super Admin Tenant')
  console.log('🛡️  Super admin tenant created:', tenant.id)

  // Store the OpenAI API key for the super admin, if it exists
  const openaiKey = process.env.OPENAI_API_KEY
  if (openaiKey) {
    const openai = await getOrCreateCredential(prisma, tenant.id, adapter_type.openai, openaiKey)
    console.log('🛡️  OpenAI API key stored for super admin:', openai.id)
  }

  // Store the Anthropic API key for the super admin, if it exists
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY
  if (anthropicApiKey) {
    const anthropic = await getOrCreateCredential(
      prisma,
      tenant.id,
      adapter_type.anthropic,
      anthropicApiKey
    )
    console.log('🛡️  Anthropic API key stored for super admin:', anthropic.id)
  }

  // Store the Cohere API key for the super admin, if it exists
  const cohereApiKey = process.env.COHERE_API_KEY
  if (cohereApiKey) {
    const cohere = await getOrCreateCredential(prisma, tenant.id, adapter_type.cohere, cohereApiKey)
    console.log('🛡️  Cohere API key stored for super admin:', cohere.id)
  }

  // Create the super admin user
  const superAdmin = await prisma.user.create({
    data: {
      email,
      username,
      name,
      password: hashed,
      role: user_role.superadmin,
      uuid: randomUUID(),
      is_verified: true,
      tenant_id: tenant.id,
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

  console.log('🛡️  Super admin seeded:', superAdmin.email)

  return superAdmin
}
