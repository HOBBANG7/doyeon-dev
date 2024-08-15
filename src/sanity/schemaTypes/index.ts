import { type SchemaTypeDefinition } from 'sanity'
import { artistType } from './artistType'
import eventType from './eventType'
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [eventType, artistType]
}
// export const schemaTypes = [eventType]
