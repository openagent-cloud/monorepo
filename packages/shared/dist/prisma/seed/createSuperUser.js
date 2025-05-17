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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.createSuperUser = createSuperUser;
// prisma/seed/createSuperUser.ts
const index_1 = require("../../index");
const bcrypt = __importStar(require("bcryptjs"));
const crypto_1 = require("crypto");
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
function createSuperUser(prisma, email, username, name, password) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if the super admin already exists
        const existing = yield prisma.user.findUnique({ where: { email } });
        if (existing) {
            console.log('🛡️  Super admin already exists, skipping.');
            return existing;
        }
        // Hash the password
        const hashed = yield bcrypt.hash(password, 10);
        // Create the super admin user
        const superAdmin = yield prisma.user.create({
            data: {
                email,
                username,
                name,
                password_hash: hashed,
                role: index_1.user_role.super_admin,
                uuid: (0, crypto_1.randomUUID)(),
                is_email_verified: true,
            },
        });
        console.log('🛡️  Super admin seeded:', superAdmin.email);
        return superAdmin;
    });
}
//# sourceMappingURL=createSuperUser.js.map