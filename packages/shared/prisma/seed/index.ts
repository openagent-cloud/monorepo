import { PrismaClient } from '../../index';
import { env } from '../../src/env';
import { createSuperUser } from './createSuperUser';
import { createProject } from './createProject';

// Initialize Prisma client
const prisma = new PrismaClient();

/**
 * Main seed function
 */
async function main() {
  console.log('🌱 Starting database seeding...');

  // Get environment variables using our utility
  const {
    SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_USERNAME,
    SUPER_ADMIN_NAME,
    SUPER_ADMIN_PASSWORD,
    APP_NAME,
    APP_DESCRIPTION,
  } = env;

  // Seed super admin user with environment variables
  const superAdmin = await createSuperUser(
    prisma,
    SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_USERNAME,
    SUPER_ADMIN_NAME,
    SUPER_ADMIN_PASSWORD,
  );

  // Create a default project and add the super admin as a member
  await createProject(prisma, APP_NAME, APP_DESCRIPTION, superAdmin.id);

  console.log('✅ Database seeding completed!');
}

// Execute the main function
main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 