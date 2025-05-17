import { PrismaClient } from '../../index';
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
export declare function createSuperUser(prisma: InstanceType<typeof PrismaClient>, email: string, username: string, name: string, password: string): Promise<any>;
//# sourceMappingURL=createSuperUser.d.ts.map