import { defineField, defineType } from 'sanity'

export default {
  title: 'Event',
  name: 'event',
  type: 'document',
  fields: [
    { title: 'name', name: 'name', type: 'string' },
    { title: 'title', name: 'title', type: 'string' },
    { title: 'isMale', name: 'isMale', type: 'boolean' },
    // { title: 'data', name: 'data', type: 'array' }
    {
      type: 'array',
      name: 'items',
      of: [
        {
          type: 'event',
          title: 'event'
        },
        {
          type: 'event',
          name: 'anotherAuthor', // all good
          title: 'Another author'
        }
      ]
    }
  ],
  preview: {
    select: {
      title: '',
      subtitle: ''
    }
  }
}
// export const eventType = defineType({
//   name: 'event',
//   title: 'Event',
//   type: 'document',
//   fields: [
//     defineField({
//       name: 'name',
//       type: 'string'
//     })
//   ]
// })
