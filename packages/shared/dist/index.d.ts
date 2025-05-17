import './src/env';
export * from './src/env';
export interface User {
    id: number;
    email: string;
    name: string;
    username: string;
    role: 'admin' | 'super_admin' | 'user';
    avatarUrl?: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface Token {
    id: number;
    token: string;
    tokenHash: string;
    type: 'access' | 'email_verification' | 'password_reset' | 'refresh' | 'siwe';
    userId: number;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
}
export declare enum user_role {
    admin = "admin",
    super_admin = "super_admin",
    user = "user"
}
export declare enum token_type {
    access = "access",
    email_verification = "email_verification",
    password_reset = "password_reset",
    refresh = "refresh",
    siwe = "siwe"
}
export declare const PrismaClient: any;
declare global {
    var prisma: typeof PrismaClient | undefined;
}
export declare const prisma: any;
//# sourceMappingURL=index.d.ts.map