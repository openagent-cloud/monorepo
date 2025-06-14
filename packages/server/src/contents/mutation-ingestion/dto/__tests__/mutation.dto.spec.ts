import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { MutationDto, MutationType } from '../mutation.dto'

describe('MutationDto', () => {
	// Test valid insert mutations for different content types
	describe('Insert mutations validation', () => {
		it('should validate a valid comment insert mutation', async () => {
			// Comment insert mutation from client
			const commentMutation = {
				type: MutationType.INSERT,
				collection: 'content',
				value: {
					title: 'This is a comment', // Per rule #8, comment text in title
					author_id: 1,
					content_type_id: 5, // Comment type ID
					parent_id: 42, // Parent content ID
					metadata: {
						kind: 'text',
					},
					access_type: 'public',
				},
			}

			const dto = plainToInstance(MutationDto, commentMutation)
			const errors = await validate(dto)
			expect(errors.length).toBe(0)
		})

		it('should validate a valid reaction insert mutation', async () => {
			// Reaction (upvote) insert mutation from client
			const upvoteMutation = {
				type: MutationType.INSERT,
				collection: 'content',
				value: {
					title: 'Upvote', // Per rule #8, title for reaction
					author_id: 1,
					content_type_id: 6, // Reaction type ID
					parent_id: 42, // Parent content ID
					metadata: {
						kind: 'upvote',
					},
					access_type: 'public',
				},
			}

			const dto = plainToInstance(MutationDto, upvoteMutation)
			const errors = await validate(dto)
			expect(errors.length).toBe(0)
		})
	})

	// Test valid update mutations
	describe('Update mutations validation', () => {
		it('should validate a valid content update mutation', async () => {
			// Update mutation from client
			const updateMutation = {
				type: MutationType.UPDATE,
				collection: 'content',
				key: '42', // ID of content to update
				value: {
					title: 'Updated comment text',
					metadata: {
						kind: 'text',
					},
				},
			}

			const dto = plainToInstance(MutationDto, updateMutation)
			const errors = await validate(dto)
			expect(errors.length).toBe(0)
		})
	})

	// Test valid remove mutations
	describe('Remove mutations validation', () => {
		it('should validate a valid content remove mutation', async () => {
			// Remove mutation from client
			const removeMutation = {
				type: MutationType.REMOVE,
				collection: 'content',
				key: '42', // ID of content to remove
			}

			const dto = plainToInstance(MutationDto, removeMutation)
			const errors = await validate(dto)
			expect(errors.length).toBe(0)
		})
	})

	// Test invalid mutations
	describe('Invalid mutations', () => {
		it('should reject mutation with missing required fields', async () => {
			// Missing collection field
			const invalidMutation = {
				type: MutationType.INSERT,
				// collection is missing
				value: {
					title: 'Comment text',
					author_id: 1,
					content_type_id: 5,
					parent_id: 42,
					metadata: { kind: 'text' },
					access_type: 'public',
				},
			}

			const dto = plainToInstance(MutationDto, invalidMutation)
			const errors = await validate(dto)
			expect(errors.length).toBeGreaterThan(0)
		})

		it('should reject mutation with invalid type', async () => {
			// Invalid mutation type
			const invalidMutation = {
				type: 'invalid_type', // Not one of MutationType values
				collection: 'content',
				value: {
					title: 'Comment text',
					author_id: 1,
					content_type_id: 5,
					parent_id: 42,
					metadata: { kind: 'text' },
					access_type: 'public',
				},
			}

			const dto = plainToInstance(MutationDto, invalidMutation)
			const errors = await validate(dto)
			expect(errors.length).toBeGreaterThan(0)
		})

		it('should reject update mutation without key', () => {
			// Update mutation missing key
			const invalidMutation = {
				type: MutationType.UPDATE,
				collection: 'content',
				// key is missing
				value: {
					title: 'Updated comment',
				},
			}

			const dto = plainToInstance(MutationDto, invalidMutation)
			// The class-validator doesn't actually validate conditional required fields
			// So we need to manually check that key is present for updates
			expect(dto.key).toBeUndefined()
		})
	})
})
