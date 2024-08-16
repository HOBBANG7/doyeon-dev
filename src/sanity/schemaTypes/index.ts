import { type SchemaTypeDefinition } from 'sanity'
import eventType from './eventType'
import artistType from './artistType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [eventType, artistType]
}
// export const schemaTypes = [eventType]
