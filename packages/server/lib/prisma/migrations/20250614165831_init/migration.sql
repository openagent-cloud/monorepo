-- CreateEnum
CREATE TYPE "access_type" AS ENUM ('private', 'public', 'paywalled', 'restricted', 'subscriber', 'tokengated');

-- CreateEnum
CREATE TYPE "adapter_type" AS ENUM ('openai', 'anthropic', 'cohere');

-- CreateEnum
CREATE TYPE "module" AS ENUM ('content', 'ai_agent', 'ai_proxy', 'flows', 'contact', 'mailing_list', 'users');

-- CreateEnum
CREATE TYPE "post_visibility" AS ENUM ('public', 'private', 'unlisted');

-- CreateEnum
CREATE TYPE "token_type" AS ENUM ('access', 'email_verification', 'password_reset', 'refresh', 'siwe');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('user', 'elevated', 'moderator', 'admin', 'superadmin');

-- CreateTable
CREATE TABLE "agents" (
    "id" TEXT NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "model" TEXT NOT NULL DEFAULT 'gpt-4',
    "name" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "tools" TEXT[],
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_runs" (
    "id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "input" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "output" TEXT,
    "parent_run_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "tenant_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "agent_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_message" (
    "category" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "tenant_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "uuid" TEXT NOT NULL,

    CONSTRAINT "contact_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content" (
    "access_type" "access_type" NOT NULL DEFAULT 'public',
    "author_id" INTEGER NOT NULL,
    "content_type_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" SERIAL NOT NULL,
    "metadata" JSONB NOT NULL,
    "parent_id" INTEGER,
    "tenant_id" INTEGER NOT NULL,
    "title" TEXT,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "uuid" TEXT NOT NULL,

    CONSTRAINT "content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_access" (
    "content_id" INTEGER NOT NULL,
    "granted_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" SERIAL NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "type" "access_type" NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "user_id" INTEGER NOT NULL,
    "uuid" TEXT NOT NULL,

    CONSTRAINT "content_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_reaction_counts" (
    "content_id" INTEGER NOT NULL,
    "comment_count" INTEGER NOT NULL DEFAULT 0,
    "conversation_count" INTEGER NOT NULL DEFAULT 0,
    "downvote_count" INTEGER NOT NULL DEFAULT 0,
    "emoji_breakdown" JSONB,
    "emoji_count" INTEGER NOT NULL DEFAULT 0,
    "id" SERIAL NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "total_count" INTEGER NOT NULL DEFAULT 0,
    "upvote_count" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "reply_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "content_reaction_counts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_type" (
    "access_level" "access_type" NOT NULL DEFAULT 'public',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "schema" JSONB NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "uuid" TEXT NOT NULL,

    CONSTRAINT "content_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credentials" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "encrypted_key" TEXT NOT NULL,
    "meta" JSONB NOT NULL,
    "service" "adapter_type" NOT NULL,
    "tenant_id" INTEGER NOT NULL,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flow_charts" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "flow_charts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flow_edges" (
    "id" TEXT NOT NULL,
    "animated" BOOLEAN DEFAULT false,
    "chart_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" JSONB,
    "label" TEXT,
    "marker_end" JSONB,
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "source_handle" TEXT,
    "source_node_id" TEXT NOT NULL,
    "style" JSONB,
    "target_handle" TEXT,
    "target_node_id" TEXT NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "type" TEXT,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "flow_edges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flow_nodes" (
    "id" TEXT NOT NULL,
    "chart_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" JSONB,
    "height" INTEGER,
    "label" TEXT,
    "position" JSONB NOT NULL DEFAULT '{"x": 0, "y": 0}',
    "tenant_id" INTEGER NOT NULL,
    "type_name" TEXT,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "width" INTEGER,

    CONSTRAINT "flow_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flow_node_types" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "label" TEXT,
    "name" TEXT NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "flow_node_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mailing_list" (
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "metadata" JSONB,
    "source" TEXT NOT NULL DEFAULT 'website',
    "subscribed" BOOLEAN NOT NULL DEFAULT true,
    "tenant_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "uuid" TEXT NOT NULL,

    CONSTRAINT "mailing_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proxy_requests" (
    "id" TEXT NOT NULL,
    "completion_tokens" INTEGER,
    "cost_usd" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endpoint" TEXT NOT NULL,
    "metadata" JSONB DEFAULT '{}',
    "model" TEXT,
    "prompt_tokens" INTEGER,
    "response_ms" INTEGER NOT NULL,
    "service" "adapter_type" NOT NULL,
    "status" INTEGER NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "total_tokens" INTEGER,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "proxy_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenants" (
    "id" SERIAL NOT NULL,
    "api_key" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modules" "module"[] DEFAULT ARRAY[]::"module"[],
    "name" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "uuid" TEXT NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "tenant_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "type" "token_type" NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "user_id" INTEGER NOT NULL,
    "uuid" TEXT,

    CONSTRAINT "token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "avatar_url" TEXT,
    "bio" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "last_login" TIMESTAMPTZ,
    "modules" "module"[] DEFAULT ARRAY[]::"module"[],
    "name" TEXT,
    "password" TEXT NOT NULL,
    "public_key" TEXT,
    "private_key" TEXT,
    "refresh_token" TEXT,
    "refresh_token_expires" TIMESTAMPTZ,
    "reset_token" TEXT,
    "reset_token_expires" TIMESTAMPTZ,
    "role" "user_role" NOT NULL DEFAULT 'user',
    "tenant_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "username" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_public" (
    "avatar_url" TEXT,
    "bio" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" SERIAL NOT NULL,
    "modules" "module"[] DEFAULT ARRAY[]::"module"[],
    "name" TEXT,
    "public_key" TEXT,
    "role" "user_role" NOT NULL DEFAULT 'user',
    "tenant_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "username" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,

    CONSTRAINT "users_public_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AgentHandoffs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AgentHandoffs_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "agents_name_key" ON "agents"("name");

-- CreateIndex
CREATE INDEX "agents_tenant_id_idx" ON "agents"("tenant_id");

-- CreateIndex
CREATE INDEX "agents_is_active_idx" ON "agents"("is_active");

-- CreateIndex
CREATE INDEX "agent_runs_agent_id_idx" ON "agent_runs"("agent_id");

-- CreateIndex
CREATE INDEX "agent_runs_status_idx" ON "agent_runs"("status");

-- CreateIndex
CREATE INDEX "agent_runs_created_at_idx" ON "agent_runs"("created_at");

-- CreateIndex
CREATE INDEX "agent_runs_tenant_id_idx" ON "agent_runs"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "contact_message_uuid_key" ON "contact_message"("uuid");

-- CreateIndex
CREATE INDEX "contact_message_email_idx" ON "contact_message"("email");

-- CreateIndex
CREATE INDEX "contact_message_status_idx" ON "contact_message"("status");

-- CreateIndex
CREATE INDEX "contact_message_created_at_idx" ON "contact_message"("created_at");

-- CreateIndex
CREATE INDEX "contact_message_category_idx" ON "contact_message"("category");

-- CreateIndex
CREATE INDEX "contact_message_tenant_id_idx" ON "contact_message"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_uuid_key" ON "content"("uuid");

-- CreateIndex
CREATE INDEX "content_author_id_idx" ON "content"("author_id");

-- CreateIndex
CREATE INDEX "content_content_type_id_idx" ON "content"("content_type_id");

-- CreateIndex
CREATE INDEX "content_parent_id_idx" ON "content"("parent_id");

-- CreateIndex
CREATE INDEX "content_created_at_idx" ON "content"("created_at");

-- CreateIndex
CREATE INDEX "content_tenant_id_idx" ON "content"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_access_uuid_key" ON "content_access"("uuid");

-- CreateIndex
CREATE INDEX "content_access_content_id_idx" ON "content_access"("content_id");

-- CreateIndex
CREATE INDEX "content_access_user_id_idx" ON "content_access"("user_id");

-- CreateIndex
CREATE INDEX "content_access_type_idx" ON "content_access"("type");

-- CreateIndex
CREATE INDEX "content_access_tenant_id_idx" ON "content_access"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_reaction_counts_content_id_key" ON "content_reaction_counts"("content_id");

-- CreateIndex
CREATE INDEX "content_reaction_counts_tenant_id_idx" ON "content_reaction_counts"("tenant_id");

-- CreateIndex
CREATE INDEX "content_reaction_counts_content_id_idx" ON "content_reaction_counts"("content_id");

-- CreateIndex
CREATE INDEX "content_reaction_counts_total_count_idx" ON "content_reaction_counts"("total_count");

-- CreateIndex
CREATE INDEX "content_reaction_counts_conversation_count_idx" ON "content_reaction_counts"("conversation_count");

-- CreateIndex
CREATE UNIQUE INDEX "content_type_name_key" ON "content_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "content_type_uuid_key" ON "content_type"("uuid");

-- CreateIndex
CREATE INDEX "content_type_name_idx" ON "content_type"("name");

-- CreateIndex
CREATE INDEX "content_type_tenant_id_idx" ON "content_type"("tenant_id");

-- CreateIndex
CREATE INDEX "credentials_tenant_id_idx" ON "credentials"("tenant_id");

-- CreateIndex
CREATE INDEX "credentials_service_idx" ON "credentials"("service");

-- CreateIndex
CREATE INDEX "flow_charts_tenant_id_idx" ON "flow_charts"("tenant_id");

-- CreateIndex
CREATE INDEX "flow_charts_name_idx" ON "flow_charts"("name");

-- CreateIndex
CREATE INDEX "flow_edges_chart_id_idx" ON "flow_edges"("chart_id");

-- CreateIndex
CREATE INDEX "flow_edges_source_node_id_idx" ON "flow_edges"("source_node_id");

-- CreateIndex
CREATE INDEX "flow_edges_target_node_id_idx" ON "flow_edges"("target_node_id");

-- CreateIndex
CREATE INDEX "flow_edges_tenant_id_idx" ON "flow_edges"("tenant_id");

-- CreateIndex
CREATE INDEX "flow_nodes_chart_id_idx" ON "flow_nodes"("chart_id");

-- CreateIndex
CREATE INDEX "flow_nodes_type_name_idx" ON "flow_nodes"("type_name");

-- CreateIndex
CREATE INDEX "flow_nodes_tenant_id_idx" ON "flow_nodes"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "flow_node_types_name_key" ON "flow_node_types"("name");

-- CreateIndex
CREATE INDEX "flow_node_types_name_idx" ON "flow_node_types"("name");

-- CreateIndex
CREATE INDEX "flow_node_types_tenant_id_idx" ON "flow_node_types"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "mailing_list_email_key" ON "mailing_list"("email");

-- CreateIndex
CREATE UNIQUE INDEX "mailing_list_uuid_key" ON "mailing_list"("uuid");

-- CreateIndex
CREATE INDEX "mailing_list_tenant_id_idx" ON "mailing_list"("tenant_id");

-- CreateIndex
CREATE INDEX "mailing_list_email_idx" ON "mailing_list"("email");

-- CreateIndex
CREATE INDEX "mailing_list_source_idx" ON "mailing_list"("source");

-- CreateIndex
CREATE INDEX "mailing_list_subscribed_idx" ON "mailing_list"("subscribed");

-- CreateIndex
CREATE INDEX "proxy_requests_created_at_idx" ON "proxy_requests"("created_at");

-- CreateIndex
CREATE INDEX "proxy_requests_service_idx" ON "proxy_requests"("service");

-- CreateIndex
CREATE INDEX "proxy_requests_tenant_id_idx" ON "proxy_requests"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_api_key_key" ON "tenants"("api_key");

-- CreateIndex
CREATE INDEX "tenants_api_key_idx" ON "tenants"("api_key");

-- CreateIndex
CREATE INDEX "tenants_name_idx" ON "tenants"("name");

-- CreateIndex
CREATE UNIQUE INDEX "token_token_key" ON "token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "token_uuid_key" ON "token"("uuid");

-- CreateIndex
CREATE INDEX "token_tenant_id_idx" ON "token"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_public_key_key" ON "users"("public_key");

-- CreateIndex
CREATE UNIQUE INDEX "users_refresh_token_key" ON "users"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_reset_token_key" ON "users"("reset_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_uuid_key" ON "users"("uuid");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_public_key_idx" ON "users"("public_key");

-- CreateIndex
CREATE INDEX "users_tenant_id_idx" ON "users"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_public_public_key_key" ON "users_public"("public_key");

-- CreateIndex
CREATE UNIQUE INDEX "users_public_username_key" ON "users_public"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_public_uuid_key" ON "users_public"("uuid");

-- CreateIndex
CREATE INDEX "users_public_username_idx" ON "users_public"("username");

-- CreateIndex
CREATE INDEX "users_public_public_key_idx" ON "users_public"("public_key");

-- CreateIndex
CREATE INDEX "users_public_tenant_id_idx" ON "users_public"("tenant_id");

-- CreateIndex
CREATE INDEX "_AgentHandoffs_B_index" ON "_AgentHandoffs"("B");

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_runs" ADD CONSTRAINT "agent_runs_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_runs" ADD CONSTRAINT "agent_runs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_message" ADD CONSTRAINT "contact_message_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content" ADD CONSTRAINT "content_content_type_id_fkey" FOREIGN KEY ("content_type_id") REFERENCES "content_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content" ADD CONSTRAINT "content_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "content"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content" ADD CONSTRAINT "content_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_access" ADD CONSTRAINT "content_access_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_access" ADD CONSTRAINT "content_access_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_reaction_counts" ADD CONSTRAINT "content_reaction_counts_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_reaction_counts" ADD CONSTRAINT "content_reaction_counts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_type" ADD CONSTRAINT "content_type_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_charts" ADD CONSTRAINT "flow_charts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_edges" ADD CONSTRAINT "flow_edges_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "flow_charts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_edges" ADD CONSTRAINT "flow_edges_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_nodes" ADD CONSTRAINT "flow_nodes_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "flow_charts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_nodes" ADD CONSTRAINT "flow_nodes_type_name_fkey" FOREIGN KEY ("type_name") REFERENCES "flow_node_types"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_nodes" ADD CONSTRAINT "flow_nodes_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_node_types" ADD CONSTRAINT "flow_node_types_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mailing_list" ADD CONSTRAINT "mailing_list_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proxy_requests" ADD CONSTRAINT "proxy_requests_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_public" ADD CONSTRAINT "users_public_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgentHandoffs" ADD CONSTRAINT "_AgentHandoffs_A_fkey" FOREIGN KEY ("A") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgentHandoffs" ADD CONSTRAINT "_AgentHandoffs_B_fkey" FOREIGN KEY ("B") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
