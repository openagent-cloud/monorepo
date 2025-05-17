-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "token_type" AS ENUM ('access', 'email_verification', 'password_reset', 'refresh', 'siwe');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('admin', 'super_admin', 'user');

-- CreateTable
CREATE TABLE "token" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "id" SERIAL NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "token" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "type" "token_type" NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "uuid" TEXT,

    CONSTRAINT "token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "avatar_url" TEXT,
    "cover_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "eth_address" TEXT,
    "face_prompt" TEXT,
    "header_image_url" TEXT,
    "id" SERIAL NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_2fa_enabled" BOOLEAN NOT NULL DEFAULT false,
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_eth_address_verified" BOOLEAN NOT NULL DEFAULT false,
    "last_login" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "name" TEXT NOT NULL,
    "password_hash" TEXT,
    "role" "user_role" NOT NULL DEFAULT 'user',
    "token2fa" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "uuid" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "token_token_key" ON "token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "token_uuid_key" ON "token"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_uuid_key" ON "users"("uuid");

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
