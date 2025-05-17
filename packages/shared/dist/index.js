"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.PrismaClient = exports.token_type = exports.user_role = void 0;
// Import environment utilities
require("./src/env");
__exportStar(require("./src/env"), exports);
// Enum types that mirror the Prisma enums
var user_role;
(function (user_role) {
    user_role["admin"] = "admin";
    user_role["super_admin"] = "super_admin";
    user_role["user"] = "user";
})(user_role || (exports.user_role = user_role = {}));
var token_type;
(function (token_type) {
    token_type["access"] = "access";
    token_type["email_verification"] = "email_verification";
    token_type["password_reset"] = "password_reset";
    token_type["refresh"] = "refresh";
    token_type["siwe"] = "siwe";
})(token_type || (exports.token_type = token_type = {}));
// Try to import Prisma client if it's been generated
let prismaImport;
try {
    // This will throw an error if Prisma hasn't been generated yet
    prismaImport = require('./generated/prisma');
}
catch (e) {
    console.warn('Prisma client not found. Run `npm run db:generate` in the shared package first.');
    // Create a mock PrismaClient if not available yet
    prismaImport = {
        PrismaClient: class MockPrismaClient {
            constructor() {
                console.warn('Using mock Prisma client. Database operations will fail.');
            }
        }
    };
}
// Export the PrismaClient class for use by consumers
exports.PrismaClient = prismaImport.PrismaClient;
exports.prisma = global.prisma || new exports.PrismaClient();
// Use our environment utility to check for development mode
const env_1 = require("./src/env");
if (env_1.env.IS_DEVELOPMENT) {
    global.prisma = exports.prisma;
}
// Re-export everything from Prisma
try {
    Object.assign(exports, prismaImport);
}
catch (e) {
    console.warn('Failed to export Prisma types');
}
// Don't fail if Prisma types aren't generated yet
// This export will be replaced with the real one when Prisma is generated
// export * from './generated/prisma' 
//# sourceMappingURL=index.js.map