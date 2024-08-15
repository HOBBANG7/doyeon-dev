import { defineField, defineType } from 'sanity'

export const artistType = defineType({
  name: 'artist', // *[_type == "artist"]
  title: 'Artist',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string'
    })
  ]
})
