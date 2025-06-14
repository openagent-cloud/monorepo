import { MutationType } from '../dto/mutation.dto'

export async function processContentTypeMutation(
	type: MutationType,
	key?: string,
	value?: Record<string, any>,
) {
	let contentTypeId: number
	let deleteId: number
	switch (type) {
		case MutationType.INSERT:
			if (!value) throw new Error('Value is required for INSERT')
			return await this.prisma.content_type.create({
				data: value as any,
			})

		case MutationType.UPDATE:
			if (!key) throw new Error('Key is required for UPDATE')
			if (!value) throw new Error('Value is required for UPDATE')

			contentTypeId = parseInt(key, 10)
			return await this.prisma.content_type.update({
				where: { id: contentTypeId },
				data: value,
			})

		case MutationType.REMOVE:
			if (!key) throw new Error('Key is required for REMOVE')

			deleteId = parseInt(key, 10)
			return await this.prisma.content_type.delete({
				where: { id: deleteId },
			})

		default:
			throw new Error(`Unknown mutation type: ${String(type)}`)
	}
}
