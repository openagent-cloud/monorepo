import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common'
import { UpdateUserSettingsDto, UserSettingsResponseDto } from './dto/user-settings.dto'
import { user_role } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from '../utils/prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserSettings(
    userId: number,
    requestingUserId: number,
    requestingUserRole: user_role,
    tenantId: number
  ): Promise<UserSettingsResponseDto> {
    // Check if user can access these settings
    this.checkUserAccess(userId, requestingUserId, requestingUserRole, tenantId)

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        bio: true,
        avatar_url: true,
        role: true,
        is_verified: true,
        public_key: true,
        created_at: true,
        updated_at: true
      }
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async updateUserSettings(
    userId: number,
    updateData: UpdateUserSettingsDto,
    requestingUserId: number,
    requestingUserRole: user_role,
    tenantId: number
  ): Promise<UserSettingsResponseDto> {
    // Check if user can modify these settings
    this.checkUserAccess(userId, requestingUserId, requestingUserRole, tenantId)

    // Check if user exists
    const existingUser = await this.prisma.user.findFirst({
      where: { 
        id: userId,
        tenant_id: tenantId 
      }
    })

    if (!existingUser) {
      throw new NotFoundException('User not found')
    }

    // Prepare update data
    const updateFields: any = {}

    // Handle name update
    if (updateData.name !== undefined) {
      updateFields.name = updateData.name
    }

    // Handle bio update
    if (updateData.bio !== undefined) {
      updateFields.bio = updateData.bio
    }

    // Handle avatar_url update
    if (updateData.avatar_url !== undefined) {
      updateFields.avatar_url = updateData.avatar_url
    }

    // Handle username update with uniqueness check
    if (updateData.username !== undefined) {
      const existingUsername = await this.prisma.user.findFirst({
        where: {
          username: updateData.username,
          tenant_id: tenantId,
          NOT: { id: userId }
        }
      })

      if (existingUsername) {
        throw new ConflictException('Username already taken')
      }

      updateFields.username = updateData.username
    }

    // Handle email update with uniqueness check
    if (updateData.email !== undefined) {
      const existingEmail = await this.prisma.user.findFirst({
        where: {
          email: updateData.email,
          tenant_id: tenantId,
          NOT: { id: userId }
        }
      })

      if (existingEmail) {
        throw new ConflictException('Email already in use')
      }

      updateFields.email = updateData.email
    }

    // Handle password update with hashing
    if (updateData.password !== undefined) {
      updateFields.password = await bcrypt.hash(updateData.password, 10)
    }

    // Perform the update
    const updatedUser = await this.prisma.user.update({
      where: { 
        id: userId,
        tenant_id: tenantId 
      },
      data: updateFields,
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        bio: true,
        avatar_url: true,
        role: true,
        is_verified: true,
        public_key: true,
        created_at: true,
        updated_at: true
      }
    })

    return updatedUser
  }

  /**
   * Check if the requesting user has permission to access/modify the target user's settings
   * Users can only modify their own settings, except admins who can modify any user's settings
   */
  private checkUserAccess(
    targetUserId: number,
    requestingUserId: number,
    requestingUserRole: user_role,
    tenantId: number
  ): void {
    // Users can always access their own settings
    if (targetUserId === requestingUserId) {
      return
    }

    // Admins and superadmins can access/modify any user's settings
    if (requestingUserRole === 'admin' || requestingUserRole === 'superadmin') {
      return
    }

    // Otherwise, access is forbidden
    throw new ForbiddenException('You can only access your own user settings')
  }

  async getUserById(userId: number, tenantId: number): Promise<UserSettingsResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        bio: true,
        avatar_url: true,
        role: true,
        is_verified: true,
        public_key: true,
        created_at: true,
        updated_at: true
      }
    })

    return user
  }

  async deleteUser(
    userId: number,
    requestingUserId: number,
    requestingUserRole: user_role,
    tenantId: number
  ): Promise<{ message: string }> {
    // Check if user can delete this account
    this.checkUserAccess(userId, requestingUserId, requestingUserRole, tenantId)

    const user = await this.prisma.user.findFirst({
      where: { 
        id: userId,
        tenant_id: tenantId 
      }
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    // TODO: You might want to soft delete or handle user data cleanup
    // For now, we'll do a hard delete but you might want to:
    // 1. Soft delete by setting a deleted_at field
    // 2. Anonymize user data instead of deleting
    // 3. Handle cleanup of related content, comments, etc.

    await this.prisma.user.delete({
      where: { 
        id: userId,
        tenant_id: tenantId 
      }
    })

    return { message: 'User account deleted successfully' }
  }
}
