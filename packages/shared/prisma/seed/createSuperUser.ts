// prisma/seed/createSuperUser.ts
import { PrismaClient, user_role } from '../../index';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

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
export async function createSuperUser(
  prisma: InstanceType<typeof PrismaClient>,
  email: string,
  username: string,
  name: string,
  password: string,
) {
  // Check if the super admin already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('🛡️  Super admin already exists, skipping.');
    return existing;
  }

  // Hash the password
  const hashed = await bcrypt.hash(password, 10);

  // Create the super admin user
  const superAdmin = await prisma.user.create({
    data: {
      email,
      username,
      name,
      password_hash: hashed,
      role: user_role.super_admin,
      uuid: randomUUID(),
      is_email_verified: true,
    },
  });

  console.log('🛡️  Super admin seeded:', superAdmin.email);
  return superAdmin;
} 