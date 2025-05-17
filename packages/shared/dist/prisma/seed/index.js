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
const index_1 = require("../../index");
const env_1 = require("../../src/env");
const createSuperUser_1 = require("./createSuperUser");
const createProject_1 = require("./createProject");
// Initialize Prisma client
const prisma = new index_1.PrismaClient();
/**
 * Main seed function
 */
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🌱 Starting database seeding...');
        // Get environment variables using our utility
        const { SUPER_ADMIN_EMAIL, SUPER_ADMIN_USERNAME, SUPER_ADMIN_NAME, SUPER_ADMIN_PASSWORD, APP_NAME, APP_DESCRIPTION, } = env_1.env;
        // Seed super admin user with environment variables
        const superAdmin = yield (0, createSuperUser_1.createSuperUser)(prisma, SUPER_ADMIN_EMAIL, SUPER_ADMIN_USERNAME, SUPER_ADMIN_NAME, SUPER_ADMIN_PASSWORD);
        // Create a default project and add the super admin as a member
        yield (0, createProject_1.createProject)(prisma, APP_NAME, APP_DESCRIPTION, superAdmin.id);
        console.log('✅ Database seeding completed!');
    });
}
// Execute the main function
main()
    .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
//# sourceMappingURL=index.js.map