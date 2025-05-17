import { PrismaClient } from '../../index';
/**
 * Create a default project and add a user as a member
 *
 * @param prisma - Prisma client instance
 * @param name - Project name
 * @param description - Project description
 * @param userId - User ID to add as owner
 * @returns The created project
 */
export declare function createProject(prisma: InstanceType<typeof PrismaClient>, name: string | undefined, description: string | undefined, userId: number): Promise<any>;
//# sourceMappingURL=createProject.d.ts.map