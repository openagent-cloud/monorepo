// prisma/seed/createProject.ts
import { PrismaClient } from '../../index';
import { randomUUID } from 'crypto';

/**
 * Create a default project and add a user as a member
 *
 * @param prisma - Prisma client instance
 * @param name - Project name
 * @param description - Project description
 * @param userId - User ID to add as owner
 * @returns The created project
 */
export async function createProject(
  prisma: InstanceType<typeof PrismaClient>,
  name: string = 'Default Project',
  description: string = 'A default project created during seeding',
  userId: number,
) {
  // Check if a default project already exists
  const existingProject = await prisma.$queryRaw`
    SELECT * FROM projects WHERE name = ${name} LIMIT 1
  `.catch(() => null);

  if (
    existingProject &&
    Array.isArray(existingProject) &&
    existingProject.length > 0
  ) {
    console.log('📋 Default project already exists, skipping.');
    return existingProject[0];
  }

  // For now, just log that we would create a project
  // since the projects table doesn't exist in the schema yet
  console.log(
    `📋 Would create project "${name}" and add user ${userId} as owner`,
  );
  console.log('   (Projects table not in schema yet, so just simulating)');

  // Return a mock project
  return {
    id: 1,
    name,
    description,
    uuid: randomUUID(),
    created_at: new Date(),
    updated_at: new Date(),
  };
} 