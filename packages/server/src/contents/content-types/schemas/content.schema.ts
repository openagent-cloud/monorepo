import { JSONSchemaType } from 'ajv'

export interface ContentType {
	name: string
	schema: JSONSchemaType<any>
}
