/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import { docsSchema } from '@astrojs/starlight/schema'

import { defineCollection, z } from 'astro:content'

const docs = defineCollection({
  schema: docsSchema({
    extend: z.object({}),
  }),
})

export const collections = { docs }
