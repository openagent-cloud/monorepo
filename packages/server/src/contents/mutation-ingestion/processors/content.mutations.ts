import { MutationType } from '../dto/mutation.dto'
import type { PrismaService } from '../../../utils/prisma/prisma.service'

export async function processContentMutation(
  prisma: PrismaService,
  type: MutationType,
  key?: string,
  value?: Record<string, any>,
  user?: any
) {
  let contentId: number
  switch (type) {
    case MutationType.INSERT:
      if (!value) throw new Error('Value is required for INSERT')

      // Uniqueness check for reactions
      if (
        value.content_type_id === 6 &&
        value.author_id &&
        value.parent_id &&
        value.metadata?.kind
      ) {
        if (value.metadata.kind === 'upvote' || value.metadata.kind === 'downvote') {
          // Find any existing upvote or downvote by this user on this content
          const existingUpvote = await prisma.content.findFirst({
            where: {
              author_id: value.author_id,
              parent_id: value.parent_id,
              content_type_id: 6,
              metadata: {
                equals: { kind: 'upvote' }
              }
            }
          })
          const existingDownvote = await prisma.content.findFirst({
            where: {
              author_id: value.author_id,
              parent_id: value.parent_id,
              content_type_id: 6,
              metadata: {
                equals: { kind: 'downvote' }
              }
            }
          })

          // Check if user already has this exact reaction type
          const sameReaction = value.metadata.kind === 'upvote' ? existingUpvote : existingDownvote
          if (sameReaction) {
            throw new Error(
              'Duplicate reaction: user already reacted with this kind on this content'
            )
          }

          // Remove opposite reaction if it exists
          const oppositeReaction =
            value.metadata.kind === 'upvote' ? existingDownvote : existingUpvote
          if (oppositeReaction) {
            await prisma.content.delete({ where: { id: oppositeReaction.id } })
          }
        } else if (value.metadata.kind === 'emoji' && value.metadata.emoji) {
          // Emoji uniqueness logic (as before)
          const existing = await prisma.content.findFirst({
            where: {
              author_id: value.author_id,
              parent_id: value.parent_id,
              content_type_id: 6,
              metadata: {
                equals: { kind: 'emoji', emoji: value.metadata.emoji }
              }
            }
          })
          if (existing) {
            throw new Error(
              'Duplicate reaction: user already reacted with this kind/emoji on this content'
            )
          }
        }
      }

      return await prisma.content.create({
        data: value as any
      })

    case MutationType.UPDATE:
      if (!key) throw new Error('Key is required for UPDATE')
      if (!value) throw new Error('Value is required for UPDATE')

      contentId = parseInt(key, 10)
      return await prisma.content.update({
        where: { id: contentId },
        data: value
      })

    case MutationType.REMOVE: {
      if (!key) throw new Error('Key is required for REMOVE')

      const deleteId = parseInt(key, 10)

      // Check if content exists and get authorization info
      const existingContent = await prisma.content.findUnique({
        where: { id: deleteId }
      })

      if (!existingContent) {
        throw new Error(`Content with ID ${deleteId} not found`)
      }

      // Check authorization: allow if user is the author or has admin privileges
      if (user) {
        const isAuthor = existingContent.author_id === user.id
        const isAdmin = user.role && ['admin', 'superadmin', 'moderator'].includes(user.role)

        if (!isAuthor && !isAdmin) {
          throw new Error('You do not have permission to delete this content')
        }
      }

      // Delete related content_access entries first
      await prisma.content_access.deleteMany({
        where: { content_id: deleteId }
      })

      // Check if this content has children
      const hasChildren = await prisma.content.findFirst({
        where: { parent_id: deleteId }
      })

      if (hasChildren) {
        // If there are children, update them to remove the parent reference
        await prisma.content.updateMany({
          where: { parent_id: deleteId },
          data: { parent_id: null }
        })
      }

      return await prisma.content.delete({
        where: { id: deleteId }
      })
    }

    default:
      throw new Error(`Unknown mutation type: ${String(type)}`)
  }
}
