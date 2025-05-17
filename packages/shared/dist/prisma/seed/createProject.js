"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = createProject;
const crypto_1 = require("crypto");
/**
 * Create a default project and add a user as a member
 *
 * @param prisma - Prisma client instance
 * @param name - Project name
 * @param description - Project description
 * @param userId - User ID to add as owner
 * @returns The created project
 */
function createProject(prisma_1) {
    return __awaiter(this, arguments, void 0, function* (prisma, name = 'Default Project', description = 'A default project created during seeding', userId) {
        // Check if a default project already exists
        const existingProject = yield prisma.$queryRaw `
    SELECT * FROM projects WHERE name = ${name} LIMIT 1
  `.catch(() => null);
        if (existingProject &&
            Array.isArray(existingProject) &&
            existingProject.length > 0) {
            console.log('📋 Default project already exists, skipping.');
            return existingProject[0];
        }
        // For now, just log that we would create a project
        // since the projects table doesn't exist in the schema yet
        console.log(`📋 Would create project "${name}" and add user ${userId} as owner`);
        console.log('   (Projects table not in schema yet, so just simulating)');
        // Return a mock project
        return {
            id: 1,
            name,
            description,
            uuid: (0, crypto_1.randomUUID)(),
            created_at: new Date(),
            updated_at: new Date(),
        };
    });
}
//# sourceMappingURL=createProject.js.map